import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useIntl } from 'react-intl'

const FlashcardInput = ({ answerChecked, checkAnswer }) => {
  const [answer, setAnswer] = useState('')
  const intl = useIntl()

  if (answerChecked) return null

  const handleSubmit = () => {
    checkAnswer(answer)
    setAnswer('')
  }

  return (
    <div className="flashcardInputAndCheck">
      <form onSubmit={handleSubmit}>
        <Form.Control
          type="text"
          value={answer}
          onChange={event => setAnswer(event.target.value)}
        />
        <Button
          className="flashcardCheck"
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
