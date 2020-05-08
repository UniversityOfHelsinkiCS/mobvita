import React, { useState, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { List, Button, Segment, Icon } from 'semantic-ui-react'
import { Shake } from 'reshake'
import { FormattedMessage, useIntl } from 'react-intl'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import { getTranslationAction } from 'Utilities/redux/translationReducer'
import { learningLanguageSelector, translatableLanguages, speak } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Spinner } from 'react-bootstrap'

const DictionaryHelp = ({ translation, surfaceWord }) => {
  const [showHelp, setShow] = useState(false)
  const [shaking, setShaking] = useState(false)
  const { width: windowWidth } = useWindowDimensions()
  const dispatch = useDispatch()
  const intl = useIntl()
  const translationLanguageCode = useSelector(({ user }) => user.data.user.last_trans_language)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending } = useSelector(({ translation }) => translation)


  useEffect(() => {
    if (!translatableLanguages[learningLanguage].includes(translationLanguageCode)) {
      dispatch(updateDictionaryLanguage(translatableLanguages[learningLanguage][0]))
    }
  }, [learningLanguage])

  const dictionaryOptions = translatableLanguages[learningLanguage] ? translatableLanguages[learningLanguage].map(element => ({
    key: element,
    value: element,
    text: intl.formatMessage({ id: element }),
  })) : []

  const handleSpeakerClick = (word) => {
    speak(word, learningLanguage)
  }


  const translations = translation && translation.map(translated => (
    <List.Item key={translated.URL} data-cy="translations" style={{ color: '#555555' }}>
      <span>
        {translated.lemma}
        <Icon name="volume up" className="padding-left-1 clickable" onClick={() => handleSpeakerClick(translated.lemma)} />
      </span>
      <List bulleted style={{ color: 'slateGrey', fontStyle: 'italic' }}>
        {translated.glosses.map((word, i) => <List.Item key={`${translated.URL}-${i}`}>{word}</List.Item>)}
      </List>
    </List.Item>
  ))

  useEffect(() => {
    if (translations && translations.length > 0) {
      setShaking(true)
      setTimeout(() => {
        setShaking(false)
      }, 500)
    }
  }, [translation])

  const handleDropdownChange = (value) => {
    if (translation) {
      const lemmas = translation.map(t => t.lemma).join('+')
      if (lemmas !== '') dispatch(getTranslationAction(learningLanguage, lemmas, value))
    }
    console.log(value)
    dispatch(updateDictionaryLanguage(value))
  }

  const smallWindow = windowWidth < 1024

  if (!showHelp && smallWindow) {
    return (
      <div className="dictionary-button">
        <Button
          className="navigationbuttonopen"
          icon
          basic
          onClick={() => setShow(true)}
        >
          <Shake
            h={5}
            v={5}
            r={3}
            dur={500}
            int={10}
            max={100}
            fixed
            fixedStop={false}
            freez={false}
            active={shaking}
          >
            <Icon size="large" name="book" />
          </Shake>
        </Button>
      </div>
    )
  }

  const translationResults = () => {
    if (pending) return <div><span><FormattedMessage id="(DictionaryHelp) Loading, please wait" />... </span><Spinner animation="border" /></div>
    if (translations && translations.length > 0) return translations
    if (!translation) return <span><FormattedMessage id="(DictionaryHelp) No translation available" /></span>
    return <span><FormattedMessage id="click-on-words-near-the-exercises-to-explore-their-meaning" /></span>
  }

  return (
    <div className="dictionary-help">
      <Segment>
        <div className="align-right" style={{ color: 'slateGrey' }}>
          <FormattedMessage id="translation-target-language" />
          <select
            disabled={dictionaryOptions.length <= 1}
            defaultValue={translationLanguageCode}
            data-cy="dictionary-dropdown"
            style={{ marginLeft: '0.5em', border: 'none', color: 'slateGrey', backgroundColor: 'white' }}
            onChange={e => handleDropdownChange(e.target.value)}
          >
            {dictionaryOptions.map(option => <option key={option.key} value={option.value}>{option.text}</option>)}
          </select>
        </div>
        <div className="space-between padding-top-1">
          <List>
            {surfaceWord
              && (
                <List.Item style={{ color: '#555555', paddingBottom: '0.5em', fontWeight: 550 }}>
                  {surfaceWord}
                  <Icon name="volume up" className="padding-left-1 clickable" onClick={() => handleSpeakerClick(surfaceWord)} />
                </List.Item>
              )}
            {translationResults()}
          </List>
          {smallWindow
            ? (
              <Button icon basic onClick={() => setShow(false)} style={{ alignSelf: 'flex-end' }}>
                <Icon name="angle down" size="large" color="blue" />
              </Button>
            )
            : null}
        </div>
      </Segment>
    </div>
  )
}

const mapStateToProps = ({ translation }) => ({ translation: translation.data, surfaceWord: translation.surfaceWord })

export default connect(mapStateToProps, null)(DictionaryHelp)
