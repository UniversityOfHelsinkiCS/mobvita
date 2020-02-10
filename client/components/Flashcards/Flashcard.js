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

  const checkAnswer = (event) => {
    event.preventDefault()
    setCorrect(word.translations.includes(answer.toLowerCase()))

    setFlipped(!flipped)
    setAnswer('')
  }

  const text = correct ? 'correct' : 'incorrect'
  const color = correct ? 'green' : 'red'

  return (
    <div
<<<<<<< HEAD
      style={{ display: 'flex', width: '50%', height: '50%', margin: 'auto' }}
      className="border"
=======
      //style={{ display: 'flex', width: '50%', height: '50%', margin: 'auto', backgroundColor: color }}
      //className="border"
      id="flashcard"
>>>>>>> 603c54f2b1b7246e4f1b5d08cabfeba34e4043f6
      tabIndex="-1"
    >
<<<<<<< HEAD
      <div style={{ margin: 'auto' }}>
        {content}
        <form onSubmit={checkAnswer}>
          <input type="text" value={answer} onChange={event => setAnswer(event.target.value)} />
          <button type="submit">check</button>
        </form>
        {flipped && <div style={{ color }}>{text}</div>}
=======
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
>>>>>>> 603c54f2b1b7246e4f1b5d08cabfeba34e4043f6
      </div>
    </div>
  )
}

export default Flashcard
