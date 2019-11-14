import React, { useState } from 'react'
import { List, Accordion } from 'semantic-ui-react'


const DictionaryHelp = () => {

  const [showHelp, setShow] = useState(false)

  const wordArray = ['test', 'what', 'is', 'this'].map((word, i) => <List.Item key={i}>{word}</List.Item>) // fix when we get acual data from backend

  return (
    <Accordion styled fluid>
      <Accordion.Title onClick={() => setShow(!showHelp)} index={0}>
        Dictionary Help
      </Accordion.Title>
      <Accordion.Content active={showHelp} index={1} style={{ minHeight: '10em' }}>
        -- word to translate --
        <List bulleted>
          {wordArray}
        </List>
      </Accordion.Content>
    </Accordion>
  )

}

export default DictionaryHelp
