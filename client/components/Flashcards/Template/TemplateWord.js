import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Form } from 'react-bootstrap'

const TemplateWord = ({ word, setWord, handleWordBlur }) => {
  const handleWordChange = (e) => {
    setWord(e.target.value)
  }

  return (
    <div className="padding-top-2 padding-bottom-4" >
      <label htmlFor="newWord" className="header-3 center">
        <FormattedMessage id="new-word" />
      </label>
      <Form.Control
        id="newWord"
        type="text"
        value={word}
        onChange={handleWordChange}
        onBlur={handleWordBlur}
      />
    </div>
  )
}

export default TemplateWord
