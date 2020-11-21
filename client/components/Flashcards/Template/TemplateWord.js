import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Form } from 'react-bootstrap'

const TemplateWord = ({ word, setWord, getTranslations, hintRef, wordRef, editing = false }) => {
  const handleWordChange = e => {
    setWord(e.target.value)
  }

  const handleEnterKey = e => {
    if (e.key === 'Enter' && hintRef.current) {
      e.preventDefault()
      hintRef.current.focus()
    }
  }

  return (
    <div className="pt-nm pb-xl">
      {editing ? (
        <span className="header-3 justify-center bold">{word}</span>
      ) : (
        <div>
          <label htmlFor="newWord" className="header-3 justify-center">
            <FormattedMessage id="new-word" />
          </label>
          <Form.Control
            id="newWord"
            type="text"
            ref={wordRef}
            value={word}
            onChange={handleWordChange}
            onBlur={getTranslations}
            onKeyDown={handleEnterKey}
          />
        </div>
      )}
    </div>
  )
}

export default TemplateWord
