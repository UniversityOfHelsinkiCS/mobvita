import React, { useState, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { List, Button, Header, Segment, Icon, Dropdown } from 'semantic-ui-react'
import { Shake } from 'reshake'
import { FormattedMessage } from 'react-intl'
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
    text: element,
  })) : []


  const translations = translation ? translation.map(translated => (
    <List.Item key={translated.URL}>
      {translated.lemma}
      <List bulleted>
        {translated.glosses.map((word, i) => <List.Item key={`${translated.URL}-${i}`}>{word}</List.Item>)}
      </List>
    </List.Item>
  )) : 'no translation found'

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
    return <FormattedMessage id="click-to-translate" />
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
            {dictionaryOptions.map(option => <option key={option.key}>{option.text}</option>)}
          </select>
        </div>
        {smallWindow
          ? (
            <Header size="medium" textAlign="center">
              <Button className="navigationbuttonclose" icon basic floated="right" onClick={() => setShow(false)}>
                <Icon name="angle down" />
              </Button>
            </Header>
          )
          : null}
        <List>
          {translationResults()}

        </List>
      </Segment>
    </div>
  )
}

const mapStateToProps = ({ translation }) => ({ translation: translation.data })

export default connect(mapStateToProps, null)(DictionaryHelp)
