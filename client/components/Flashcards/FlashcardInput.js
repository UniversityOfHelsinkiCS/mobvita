import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useIntl } from 'react-intl'
import { recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'

const FlashcardInput = ({ card, flipCard, answerChecked, setAnswerCorrect }) => {
  const [answer, setAnswer] = useState('')
  const intl = useIntl()

  if (answerChecked) return null

  const { glosses, lemma, _id, story, lan_in: inputLanguage, lan_out: outputLanguage } = card

  const checkAnswer = (event) => {
    event.preventDefault()
    const correct = glosses.includes(answer.toLowerCase()).toString()

    const answerDetails = {
      flashcard_id: _id,
      correct,
      answer,
      exercise: 'fillin',
      mode: 'trans',
      story,
      lemma,
    }

    recordFlashcardAnswer(inputLanguage, outputLanguage, answerDetails)

    flipCard()
    setAnswer('')
    setAnswerCorrect(correct)
  }

  return (
    <div id="flashcardInputAndCheck">
      <Form.Control
        type="text"
        value={answer}
        onChange={event => setAnswer(event.target.value)}
      />
      <Button
        id="flashcardCheck"
        block
        variant="outline-primary"
        type="button"
        onClick={checkAnswer}
      >
        {intl.formatMessage({ id: 'check-answer' })}
      </Button>
    </div>
  )
}

export default FlashcardInput
