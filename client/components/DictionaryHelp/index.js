import React, { useState, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { List, Button, Header, Segment, Icon, Dropdown } from 'semantic-ui-react'
import { Shake } from 'reshake'
import { FormattedMessage, useIntl } from 'react-intl'
import { updateDictionaryLanguage, saveSelf } from 'Utilities/redux/userReducer'
import { getTranslationAction } from 'Utilities/redux/translationReducer'
import { learningLanguageSelector, translatableLanguages } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Spinner } from 'react-bootstrap'

const DictionaryHelp = ({ translation }) => {
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


  const translations = translation ? translation.map(translated => (
    <List.Item key={translated.URL} data-cy="translations">
      {translated.lemma}
      <List bulleted>
        {translated.glosses.map((word, i) => <List.Item key={`${translated.URL}-${i}`}>{word}</List.Item>)}
      </List>
    </List.Item>
  )) : <List.Item><span>no translation found</span></List.Item>

  useEffect(() => {
    if (translations.length > 0) {
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
    if (pending) return <div><span>Loading, please wait </span><Spinner animation="border" /></div>
    if (translations.length > 0) return translations
    return <span><FormattedMessage id="click-to-translate" /></span>
  }

  return (
    <div className="dictionary-help">
      <Segment>
        <div>
          <FormattedMessage id="translation-target-language" />
          <select
            disabled={dictionaryOptions.length <= 1}
            defaultValue={translationLanguageCode}
            data-cy="dictionary-dropdown"
            style={{ marginLeft: '0.5em', border: 'none', backgroundColor: 'white' }}
            onChange={e => handleDropdownChange(e.target.value)}
          >
            {dictionaryOptions.map(option => <option key={option.key} value={option.value}>{option.text}</option>)}
          </select>
        </div>
        <div className="space-between">
          <List>
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
      {!smallWindow
        && (
          <div style={{ textAlign: 'center' }}>
            <a href="https://responsivevoice.org">ResponsiveVoice-NonCommercial</a> <br />
            licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/"><img title="ResponsiveVoice Text To Speech" src="https://responsivevoice.org/wp-content/uploads/2014/08/95x15.png" alt="95x15" width="95" height="15" /></a>
          </div>
        )
      }
    </div >
  )
}

const mapStateToProps = ({ translation }) => ({ translation: translation.data })

export default connect(mapStateToProps, null)(DictionaryHelp)
