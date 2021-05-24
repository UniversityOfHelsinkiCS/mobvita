import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, Button, Segment, Icon } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import WordNestModal from 'Components/WordNestModal'
import {
  useDictionaryLanguage,
  useLearningLanguage,
  translatableLanguages,
  speak,
  respVoiceLanguages,
  getTextStyle,
  images,
  hiddenFeatures,
} from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Spinner } from 'react-bootstrap'

const Speaker = ({ word }) => {
  const learningLanguage = useLearningLanguage()

  const voice = respVoiceLanguages[learningLanguage]

  const handleSpeakerClick = () => {
    speak(word, voice)
  }

  if (!voice) return null

  return (
    <Icon
      name="volume up"
      style={{ marginRight: '1rem' }}
      className="clickable"
      onClick={handleSpeakerClick}
    />
  )
}

const DictionaryButton = ({ setShow }) => {
  return (
    <div className="dictionary-button">
      <Button className="navigationbuttonopen" icon basic onClick={() => setShow(true)}>
        <Icon size="large" name="book" data-cy="dictionary-icon" />
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

const Lemma = ({ lemma, sourceWord, handleSourceWordClick, userUrl, inflectionRef }) => {
  const learningLanguage = useLearningLanguage()
  const { maskSymbol } = useSelector(({ translation }) => translation)

  return (
    <div className="flex" style={getTextStyle(learningLanguage)}>
      <Speaker word={lemma} />
      {maskSymbol || (
        <a href={userUrl} target="_blank" rel="noopener noreferrer">
          {lemma}
        </a>
      )}
      {inflectionRef && (
        <a href={inflectionRef.url} target="_blank" rel="noopener noreferrer" className="flex">
          <Icon name="external" style={{ marginLeft: '1rem' }} />
        </a>
      )}
      {sourceWord && (
        <span
          onClick={() => handleSourceWordClick(sourceWord)}
          onKeyDown={() => handleSourceWordClick(sourceWord)}
          className="source-word"
          role="button"
          tabIndex={-1}
          style={{ paddingTop: '0rem', paddingLeft: '1rem' }}
        >
          <Icon name="angle double left" />
          {sourceWord}
        </span>
      )}
    </div>
  )
}

const DictionaryHelp = ({ minimized, inWordNestModal }) => {
  const [showHelp, setShow] = useState(false)
  const { width: windowWidth } = useWindowDimensions()
  const [wordNestModalOpen, setWordNestModalOpen] = useState(false)

  const translationLanguageCode = useSelector(({ user }) => user.data.user.last_trans_language)
  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()
  const { pending, data: translation, surfaceWord, lemmas, clue, maskSymbol } = useSelector(
    ({ translation }) => translation
  )

  const { data: words } = useSelector(({ wordNest }) => wordNest)

  const dispatch = useDispatch()
  const intl = useIntl()

  useEffect(() => {
    if (
      translatableLanguages[learningLanguage].length &&
      !translatableLanguages[learningLanguage].includes(translationLanguageCode)
    ) {
      dispatch(updateDictionaryLanguage(translatableLanguages[learningLanguage][0]))
    }
  }, [learningLanguage])

  useEffect(() => {
    if (pending) setShow(true)
  }, [pending])

  const handleSourceWordClick = lemma => {
    dispatch(setWords({ lemmas: lemma }))
    dispatch(
      getTranslationAction({
        learningLanguage,
        wordLemmas: lemma,
        dictionaryLanguage,
      })
    )
  }

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
          <Lemma
            lemma={translated.lemma}
            sourceWord={translated.source_word}
            handleSourceWordClick={handleSourceWordClick}
            inflectionRef={translated.ref}
            userUrl={translated.user_URL}
            inWordNestModal={inWordNestModal}
            setWordNestModalOpen={setWordNestModalOpen}
          />
        )}

        <List bulleted style={{ color: 'slateGrey', fontStyle: 'italic', marginTop: '.5rem' }}>
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
    dispatch(updateDictionaryLanguage(value))
  }

  const smallWindow = minimized || windowWidth < 1024

  if (!showHelp && smallWindow && !inWordNestModal) {
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

  const handleNestButtonClick = () => {
    setWordNestModalOpen(true)
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
          <div style={{ display: 'flex' }}>
            <div>{translations}</div>
            <div style={{ alignSelf: 'flex-start', marginLeft: '1em' }}>
              {hiddenFeatures && !inWordNestModal && words?.length > 0 && (
                <Button basic size="mini" onClick={handleNestButtonClick}>
                  <img src={images.nestIcon} alt="nest icon" width="22" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )
    if (!translation) {
      return (
        <List.Item style={{ color: '#555555' }}>
          {!clue && !inWordNestModal && (
            <div style={{ width: '100%', ...getTextStyle(learningLanguage) }}>
              <Speaker word={parsedLemmas()[0]} />
              {maskSymbol || parsedLemmas()[0]}
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
    <div
      className={`dictionary-help${
        smallWindow && !inWordNestModal ? ' dictionary-help-overlay' : ''
      }`}
    >
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
              marginBottom: '1em',
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

        <div className="space-between pt-sm">
          <div>
            {showSurfaceWord() && !inWordNestModal && (
              <div
                style={{
                  paddingBottom: '0.5em',
                  display: 'flex',
                  ...getTextStyle(learningLanguage),
                }}
              >
                <Speaker word={surfaceWord} />
                <span style={{ color: '#2185D0' }}>{maskSymbol || surfaceWord}</span>
              </div>
            )}
            {translationResults()}
          </div>
          {hiddenFeatures && !inWordNestModal && (
            <WordNestModal
              wordToCheck={translation ? translation[0]?.lemma : ''}
              open={wordNestModalOpen}
              setOpen={setWordNestModalOpen}
            />
          )}

          {smallWindow && !inWordNestModal ? (
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
