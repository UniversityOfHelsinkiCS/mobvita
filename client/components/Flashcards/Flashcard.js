import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Button, Form } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'

const Flashcard = ({ card }) => {
  const [answer, setAnswer] = useState('')
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setFlipped(false)
  }, [card])

  const dispatch = useDispatch()

  const intl = useIntl()

  const { glosses, lemma, _id, story, lan_in: inputLanguage, lan_out: outputLanguage } = card

  const translations = Array.isArray(glosses)
    ? glosses.map(item => <li key={item}>{item}</li>)
    : glosses

  const content = flipped ? <ul>{translations}</ul> : <p>{lemma}</p>

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

    dispatch((recordFlashcardAnswer(inputLanguage, outputLanguage, answerDetails)))

    setFlipped(!flipped)
    setAnswer('')
  }

  return (
    <div
      id="flashcard"
      tabIndex="-1"
    >
      <span id="flashcardText">{content}</span>
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
        <div id="flashcardFlipContainer">
          <button
            id="flashcardFlip"
            variant="light"
            type="button"
            onClick={() => setFlipped(!flipped)}
          >
            {`${intl.formatMessage({ id: 'Flip' })}   `}
            <Icon name="arrow right" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Flashcard
