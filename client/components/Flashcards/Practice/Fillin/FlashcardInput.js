import React, { useState, useRef } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useIntl } from 'react-intl'

const FlashcardInput = ({ checkAnswer, focusedAndBigScreen, answerChecked, displayedHints }) => {
  const [answer, setAnswer] = useState('')

  const intl = useIntl()

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
          //className="flashcard-answer-input"
          type="text"
          value={answer}
          onChange={event => setAnswer(event.target.value)}
          placeholder={intl.formatMessage({ id: 'flashcard-input-placeholder' })}
        />
        <Button className="flashcard-button" block variant="outline-primary" type="submit">
          {intl.formatMessage({ id: 'check-answer' })}
        </Button>
      </form>
    </div>
  )
}

export default FlashcardInput
