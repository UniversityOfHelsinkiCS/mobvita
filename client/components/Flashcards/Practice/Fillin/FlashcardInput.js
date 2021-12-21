import React, { useState, useRef } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useIntl } from 'react-intl'

const FlashcardInput = ({ checkAnswer, focusedAndBigScreen, answerChecked }) => {
  const [answer, setAnswer] = useState('')

  const intl = useIntl()

  const answerInput = useRef()

  if (answerChecked) return null

  const handleSubmit = e => {
    e.preventDefault()
    checkAnswer(answer)
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
        />
        <Button className="flashcard-button" block variant="outline-primary" type="submit">
          {intl.formatMessage({ id: 'check-answer' })}
        </Button>
      </form>
    </div>
  )
}

export default FlashcardInput
