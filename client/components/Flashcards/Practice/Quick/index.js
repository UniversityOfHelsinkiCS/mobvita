import React, { useState, useEffect } from 'react'
import ReactCardFlip from 'react-card-flip'
import { Button } from 'semantic-ui-react'
import Flashcard from '../Flashcard'

const Quick = ({ card, cardNumbering, answerCard }) => {
  const [flipped, setFlipped] = useState(false)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    setFlipped(false)
  }, [card])

  const {
    lemma,
    _id: id,
    stage,
    glosses,
  } = card

  const flipCard = () => {
    setFlipped(!flipped)
  }

  const checkAnswer = (answerIsCorrect) => {
    answerCard(null, answerIsCorrect, 'fillin')
    setAnswered(true)
    flipCard()
  }

  const cardProps = {
    cardNumbering,
    stage,
    id,
    flipCard,
  }

  const translations = Array.isArray(glosses)
    ? glosses.map(item => <li key={item}>{item}</li>)
    : glosses

  return (
    <ReactCardFlip isFlipped={flipped}>
      <Flashcard {...cardProps}>
        <div className="flex-column grow">
          <span className="header-2 auto">{lemma}</span>
          {!answered
            && (
            <div className="flex space-evenly padding-bottom-4">
              <Button
                circular
                icon="checkmark huge green"
                style={{ backgroundColor: 'white' }}
                onClick={() => checkAnswer(true)}
              />
              <Button
                circular
                icon="question huge yellow"
                style={{ backgroundColor: 'white' }}
                onClick={() => checkAnswer(false)}
              />
            </div>
            )
          }
        </div>
      </Flashcard>
      <Flashcard {...cardProps}>
        <div className="overflow-auto bold center align-center grow">
          <ul style={{ maxHeight: '90%', maxWidth: '100%', paddingRight: '2em' }}>
            {translations}
          </ul>
        </div>
      </Flashcard>
    </ReactCardFlip>
  )
}

export default Quick
