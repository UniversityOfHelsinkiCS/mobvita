import React, { useState, useRef } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useIntl } from 'react-intl'

const FlashcardInput = ({ answerChecked, checkAnswer, focused }) => {
  const [answer, setAnswer] = useState('')

  const intl = useIntl()

  const answerInput = useRef()

  if (answerChecked) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    checkAnswer(answer)
    setAnswer('')
  }

  if (focused) {
    setTimeout(() => {
      if (answerInput.current) answerInput.current.focus()
    }, 100)
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
        <Button
          className="flashcard-button"
          block
          variant="outline-primary"
          type="submit"
        >
          {intl.formatMessage({ id: 'check-answer' })}
        </Button>
      </form>
    </div>
  )
}

export default FlashcardInput
