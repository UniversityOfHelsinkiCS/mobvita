import React, { useState, useEffect } from 'react'

const Flashcard = ({ word }) => {
  const [flipped, setFlipped] = useState(false)
  const [answer, setAnswer] = useState('')
  const [correct, setCorrect] = useState(false)

  useEffect(() => {
    setFlipped(false)
  }, [word])

  const translations = word.translations.map(item => <li key={item}>{item}</li>)
  const content = flipped ? <ul>{translations}</ul> : <h2>{word.root}</h2>

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
      style={{ display: 'flex', width: '50%', height: '50%', margin: 'auto' }}
      className="border"
      tabIndex="-1"
      role="button"
    >
      <div style={{ margin: 'auto' }}>
        {content}
        <form onSubmit={checkAnswer}>
          <input type="text" value={answer} onChange={event => setAnswer(event.target.value)} />
          <button type="submit">check</button>
        </form>
        {flipped && <div style={{ color }}>{text}</div>}
      </div>
    </div>
  )
}

export default Flashcard
