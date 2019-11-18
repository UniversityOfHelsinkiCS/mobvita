import React, { useState } from 'react'
import { connect } from 'react-redux'
import { List, Accordion } from 'semantic-ui-react'


const DictionaryHelp = ({ translation }) => {

  const translations = translation ? translation.map(translated =>
    <List.Item key={translated.URL}>
      {translated.lemma}
      <List bulleted>
        {translated.glosses.map(word => <List.Item>{word}</List.Item>)}
      </List>
    </List.Item>
  ) : 'no translation found'

  const [showHelp, setShow] = useState(false)

  return (
    <Accordion styled fluid>
      <Accordion.Title onClick={() => setShow(!showHelp)} index={0}>
        Dictionary Help
      </Accordion.Title>
      <Accordion.Content active={showHelp} index={1} style={{ minHeight: '10em' }}>
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
