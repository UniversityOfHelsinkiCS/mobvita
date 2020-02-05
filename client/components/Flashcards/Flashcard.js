import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Button, Form } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'

const Flashcard = ({ word }) => {
  const [flipped, setFlipped] = useState(false)
  const [answer, setAnswer] = useState('')
  const [correct, setCorrect] = useState(false)

  const intl = useIntl();

  useEffect(() => {
    setFlipped(false)
  }, [word])

  const translations = Array.isArray(word.translations)
    ? word.translations.map(item => <li key={item}>{item}</li>)
    : word.translations

  const content = flipped ? <ul>{translations}</ul> : <p>{word.root}</p>

  const checkAnswer = () => {
    setCorrect(word.translations.includes(answer.toLowerCase()))

    setFlipped(!flipped)
    setAnswer('')
  }

  let color = ''
  if (flipped) {
    color = correct ? 'green' : 'red'
  }

  return (
    <div
      //style={{ display: 'flex', width: '50%', height: '50%', margin: 'auto', backgroundColor: color }}
      //className="border"
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
            onClick={checkAnswer}
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
