import React, { useState, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { List, Button, Header, Segment, Icon, Modal, Dropdown } from 'semantic-ui-react'
import { Shake } from 'reshake'
import { setLocale } from 'Utilities/redux/localeReducer'
import { localeOptions } from 'Utilities/common'


const DictionaryHelp = ({ translation }) => {
  const [showHelp, setShow] = useState(false)
  const [shaking, setShaking] = useState(false)
  const dispatch = useDispatch()
  const translationLanguageCode = useSelector(({ locale }) => locale)

  const dictionaryOptions = localeOptions.map(localeObj => (
    {
      key: localeObj.code,
      value: localeObj.code,
      text: localeObj.name,
    }
  ))


  const translations = translation ? translation.map(translated => (
    <List.Item key={translated.URL}>
      {translated.lemma}
      <List bulleted>
        {translated.glosses.map((word, i) => <List.Item key={`${translated.URL}-${i}`}>{word}</List.Item>)}
      </List>
    </List.Item>
  )) : 'no translation found'

  const placeholder = 'Unfamiliar word? Click on any word to explore its meaning'

  useEffect(() => {
    if (translations.length > 0) {
      setShaking(true)
      setTimeout(() => {
        setShaking(false)
      }, 500)
    }
  }, [translation])

  if (!showHelp) {
    return (
      <div style={{ position: 'fixed', right: '0.5%', bottom: '0.5%', backgroundColor: '#fafafa' }}>
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

  return (
    <div>
      <Segment className="navigationpanel" style={{ position: 'fixed', right: '5%', bottom: '2%', width: '90%' }}>
        <Modal trigger={<Button>Change translation language</Button>}>
          <Modal.Header>Change translation language</Modal.Header>
          <Modal.Content>
            <span>Translate to: </span>
            <Dropdown
              closeOnChange

              defaultValue={translationLanguageCode}
              onChange={(e, data) => dispatch(setLocale(data.value))}
              options={dictionaryOptions}
            />
          </Modal.Content>
        </Modal>

        <Header size="medium" textAlign="center">
          <Button className="navigationbuttonclose" icon basic floated="right" onClick={() => setShow(false)}>
            <Icon name="angle down" />
          </Button>
        </Header>
        <List>
          {translations.length > 0 ? translations : placeholder}
        </List>
      </Segment>
    </div>
  )
}

const mapStateToProps = ({ translation }) => ({ translation: translation.data })

export default connect(mapStateToProps, null)(DictionaryHelp)
