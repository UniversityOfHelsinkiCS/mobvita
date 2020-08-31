import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, Button, Segment, Icon } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import { getTranslationAction } from 'Utilities/redux/translationReducer'
import {
  learningLanguageSelector,
  translatableLanguages,
  speak,
  respVoiceLanguages,
  getTextStyle,
} from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Spinner } from 'react-bootstrap'

const Speaker = ({ word }) => {
  const learningLanguage = useSelector(learningLanguageSelector)

  const voice = respVoiceLanguages[learningLanguage]

  const handleSpeakerClick = () => {
    speak(word, voice)
  }

  if (!voice) return null

  return (
    <Icon
      name="volume up"
      style={{ marginLeft: '1rem' }}
      className="clickable"
      onClick={handleSpeakerClick}
    />
  )
}

const DictionaryButton = ({ setShow }) => {
  return (
    <div className="dictionary-button">
      <Button className="navigationbuttonopen" icon basic onClick={() => setShow(true)}>
        <Icon size="large" name="book" />
      </Button>
    </div>
  )
}

const Clue = ({ clue }) => (
  <div style={{ fontWeight: 'bold', color: '#2185D0' }}>
    <FormattedMessage id="Your clue" />
    {`: ${clue.number} ${clue.direction}`}
  </div>
)

const Lemma = ({ lemma, inflectionRef }) => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const { maskSymbol } = useSelector(({ translation }) => translation)

  const content = useMemo(() => {
    if (maskSymbol) return maskSymbol
    if (inflectionRef !== undefined) {
      return (
        <a href={inflectionRef.url} target="_blank" rel="noopener noreferrer">
          {lemma}
        </a>
      )
    }
    return lemma
  }, [inflectionRef, maskSymbol])

  return (
    <div style={getTextStyle(learningLanguage)}>
      {content}
      <Speaker word={lemma} />
    </div>
  )
}

const DictionaryHelp = ({ minimized }) => {
  const [showHelp, setShow] = useState(false)
  const { width: windowWidth } = useWindowDimensions()

  const translationLanguageCode = useSelector(({ user }) => user.data.user.last_trans_language)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, data: translation, surfaceWord, lemmas, clue, maskSymbol } = useSelector(
    ({ translation }) => translation
  )

  const dispatch = useDispatch()
  const intl = useIntl()

  useEffect(() => {
    if (!translatableLanguages[learningLanguage].includes(translationLanguageCode)) {
      dispatch(updateDictionaryLanguage(translatableLanguages[learningLanguage][0]))
    }
  }, [learningLanguage])

  useEffect(() => {
    if (pending) setShow(true)
  }, [pending])

  const dictionaryOptions = translatableLanguages[learningLanguage]
    ? translatableLanguages[learningLanguage].map(element => ({
        key: element,
        value: element,
        text: intl.formatMessage({ id: element }),
      }))
    : []

  const translations =
    translation &&
    translation.map(translated => (
      <div key={translated.URL} data-cy="translations" style={{ color: '#555555' }}>
        {clue ? (
          <Clue clue={clue} />
        ) : (
          <Lemma lemma={translated.lemma} inflectionRef={translated.ref} />
        )}
        <List bulleted style={{ color: 'slateGrey', fontStyle: 'italic' }}>
          {translated.glosses.map(word => (
            <List.Item key={word}>{word}</List.Item>
          ))}
        </List>
      </div>
    ))

  const handleDropdownChange = value => {
    if (translation) {
      const lemmas = translation.map(t => t.lemma).join('+')
      if (lemmas !== '')
        dispatch(
          getTranslationAction({ learningLanguage, dictionaryLanguage: value, wordLemmas: lemmas })
        )
    }
    console.log(value)
    dispatch(updateDictionaryLanguage(value))
  }

  const smallWindow = minimized || windowWidth < 1024

  if (!showHelp && smallWindow) {
    return (
      <DictionaryButton setShow={setShow} translation={translation} translations={translations} />
    )
  }

  const parsedLemmas = () => lemmas.split('+').join(',').split('|').join(',').split(',')

  const showSurfaceWord = () => {
    if (!surfaceWord || clue) return false
    if (translation) {
      return !translation.some(
        translated => translated.lemma.toLowerCase() === surfaceWord.toLowerCase()
      )
    }
    return surfaceWord.toLowerCase() !== parsedLemmas()[0].toLowerCase()
  }

  const translationResults = () => {
    if (pending)
      return (
        <div>
          <span>
            <FormattedMessage id="(DictionaryHelp) Loading, please wait" />
            ...{' '}
          </span>
          <Spinner animation="border" />
        </div>
      )
    if (translations && translations.length > 0)
      return (
        <div
          className={`dictionary-translations${
            smallWindow ? ' dictionary-translations-overlay' : ''
          }`}
        >
          {translations}
        </div>
      )
    if (!translation) {
      return (
        <List.Item style={{ color: '#555555' }}>
          {!clue && (
            <div style={{ width: '100%', ...getTextStyle(learningLanguage) }}>
              {maskSymbol ? maskSymbol : parsedLemmas()[0]}
              <Speaker word={parsedLemmas()[0]} />
            </div>
          )}
          <List bulleted style={{ color: 'slateGrey', fontStyle: 'italic' }}>
            <span>
              <FormattedMessage id="(DictionaryHelp) No translation available" />
            </span>
          </List>
        </List.Item>
      )
    }
    return (
      <span>
        <FormattedMessage id="click-on-words-near-the-exercises-to-explore-their-meaning" />
      </span>
    )
  }

  return (
    <div className={`dictionary-help${smallWindow ? ' dictionary-help-overlay' : ''}`}>
      <Segment>
        <div className="align-right" style={{ color: 'slateGrey' }}>
          <FormattedMessage id="translation-target-language" />
          <select
            disabled={dictionaryOptions.length <= 1}
            defaultValue={translationLanguageCode}
            data-cy="dictionary-dropdown"
            style={{
              marginLeft: '0.5em',
              border: 'none',
              color: 'slateGrey',
              backgroundColor: 'white',
            }}
            onChange={e => handleDropdownChange(e.target.value)}
          >
            {dictionaryOptions.map(option => (
              <option key={option.key} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
        <div className="space-between padding-top-1">
          <div>
            {showSurfaceWord() && (
              <div
                style={{
                  paddingBottom: '0.5em',
                  display: 'flex',
                  ...getTextStyle(learningLanguage),
                }}
              >
                <span style={{ color: '#2185D0' }}>{maskSymbol || surfaceWord}</span>
                <Speaker word={surfaceWord} />
              </div>
            )}
            {translationResults()}
          </div>
          {smallWindow ? (
            <Button icon basic onClick={() => setShow(false)} style={{ alignSelf: 'flex-end' }}>
              <Icon name="angle down" size="large" color="blue" />
            </Button>
          ) : null}
        </div>
      </Segment>
    </div>
  )
}

export default DictionaryHelp
