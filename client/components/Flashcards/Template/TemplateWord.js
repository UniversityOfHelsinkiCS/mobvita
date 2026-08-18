import React from 'react'
import { FormattedMessage } from 'react-intl'
import AppTextField from 'Components/ui/AppTextField'

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
    <div className="flashcard-word-field">
      {editing ? (
        <span className="flashcard-word">{word}</span>
      ) : (
        <div>
          <label htmlFor="newWord" className="flashcard-form-title">
            <FormattedMessage id="new-word" />
          </label>
          <AppTextField
            id="newWord"
            inputRef={wordRef}
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
