import React, { useState, useRef } from 'react'
import { Form } from 'react-bootstrap'
import AppButton from 'Components/AppButton'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { dictionaryLanguageSelector } from 'Utilities/common'

const FlashcardInput = ({ checkAnswer, focusedAndBigScreen, answerChecked, displayedHints }) => {
  const [answer, setAnswer] = useState('')
  const intl = useIntl()
  const selectedLocale = intl.locale

  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const selectedLanguage = dictionaryLanguage && selectedLocale !== 'en'
    ? intl.formatMessage({ id: dictionaryLanguage }).toLowerCase()
    : intl.formatMessage({ id: dictionaryLanguage })

  const answerInput = useRef()

  if (answerChecked) return null

  const handleSubmit = e => {
    e.preventDefault()
    checkAnswer(answer, displayedHints)
    setAnswer('')
  }

  if (focusedAndBigScreen) {
    setTimeout(() => {
      if (answerInput.current) answerInput.current.focus()
    }, 500)
  }

  return (
    <div className="flashcard-input">
      <form onSubmit={handleSubmit}>
        <Form.Control
          ref={answerInput}
          type="text"
          value={answer}
          onChange={event => setAnswer(event.target.value)}
          placeholder={intl.formatMessage({ id: 'flashcard-input-placeholder' }, { selectedLanguage })}
        />
        <AppButton className="flashcard-button" style={{ width: '100%' }} variant="outline-primary" type="submit">
          {intl.formatMessage({ id: 'check-answer' })}
        </AppButton>
      </form>
    </div>
  )
}

export default FlashcardInput
