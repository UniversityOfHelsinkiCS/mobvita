import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useIntl } from 'react-intl'

const FlashcardInput = ({ answerChecked, checkAnswer }) => {
  const [answer, setAnswer] = useState('')
  const intl = useIntl()

  if (answerChecked) return null

  const handleCheckAnswer = () => {
    checkAnswer(answer)
    setAnswer('')
  }

  return (
    <div className="flashcardInputAndCheck">
      <Form.Control
        type="text"
        value={answer}
        onChange={event => setAnswer(event.target.value)}
      />
      <Button
        className="flashcardCheck"
        block
        variant="outline-primary"
        type="button"
        onClick={handleCheckAnswer}
      >
        {intl.formatMessage({ id: 'check-answer' })}
      </Button>
    </div>
  )
}

export default FlashcardInput
