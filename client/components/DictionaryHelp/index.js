import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { List, Accordion } from 'semantic-ui-react'


const DictionaryHelp = ({ translation }) => {
  const [showHelp, setShow] = useState(false)

  const translations = translation ? translation.map(translated =>
    <List.Item key={translated.URL}>
      {translated.lemma}
      <List bulleted>
        {translated.glosses.map((word, i) => <List.Item key={`${translated.URL}-${i}`}>{word}</List.Item>)}
      </List>
    </List.Item>
  ) : 'no translation found'

  useEffect(() => {
    if (translations.length > 0) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [translation])

  return (
    <Accordion styled fluid>
      <Accordion.Title onClick={() => setShow(!showHelp)} index={0}>
        Dictionary Help
      </Accordion.Title>
      <Accordion.Content active={showHelp} index={1} style={{ minHeight: '5em' }}>
        <List>
          {translations}
        </List>
      </Accordion.Content>
    </Accordion>
  )

}

const mapStateToProps = ({ translation }) => ({
  translation: translation.data
})

export default connect(mapStateToProps, null)(DictionaryHelp)
