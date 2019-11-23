import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { List, Button, Header, Segment, Icon } from 'semantic-ui-react'
import { Shake } from 'reshake'

const DictionaryHelp = ({ translation }) => {
  const [showHelp, setShow] = useState(false)
  const [shaking, setShaking] = useState(false)

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
      <div>
        <Button
          className="navigationbuttonopen"
          icon
          basic
          onClick={() => setShow(true)}
          style={{ position: 'fixed', right: '0.5%', bottom: '0.5%' }}
        >
          <Shake
            h={5}
            v={5}
            r={3}
            dur={300}
            int={10}
            max={100}
            fixed
            fixedStop={false}
            freez={false}
            active={shaking}
          >
            <Icon name="book" />
          </Shake>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Segment className="navigationpanel" style={{ position: 'fixed', right: '2%', bottom: '2%' }}>
        <Header size="medium" textAlign="center">
          Dictionary Help
          <Button className="navigationbuttonclose" icon basic floated="right" onClick={() => setShow(false)} >
            <Icon name="chevron right" />
          </Button>
        </Header>
        <List>
          {translations.length > 0 ? translations : placeholder}
        </List>
      </Segment>
    </div>
  )
}

const mapStateToProps = ({ translation }) => ({
  translation: translation.data,
})

export default connect(mapStateToProps, null)(DictionaryHelp)
