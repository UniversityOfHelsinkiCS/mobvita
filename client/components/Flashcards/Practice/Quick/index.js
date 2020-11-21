import React, { useState, useEffect } from 'react'
import ReactCardFlip from 'react-card-flip'
import { Button, Icon } from 'semantic-ui-react'
import Flashcard from '../Flashcard'

const Quick = ({ card, cardNumbering, answerCard }) => {
  const [flipped, setFlipped] = useState(false)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    setFlipped(false)
  }, [card])

  const { lemma, _id: id, stage, glosses } = card

  const flipCard = () => {
    setFlipped(!flipped)
  }

  const checkAnswer = answerIsCorrect => {
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
    ? [...new Set(glosses)].map(item => <li key={item}>{item}</li>)
    : glosses

  return (
    <ReactCardFlip isFlipped={flipped}>
      <Flashcard {...cardProps}>
        <div className="flex-col grow">
          <span className="header-2 auto">{lemma}</span>
          {!answered && (
            <div className="flex space-evenly padding-bottom-4">
              <Button
                circular
                style={{ backgroundColor: 'white', padding: '1em' }}
                onClick={() => checkAnswer(true)}
              >
                <Icon name="checkmark" size="huge" color="green" style={{ margin: 0 }} />
              </Button>
              <Button
                circular
                style={{ backgroundColor: 'white', padding: '1em' }}
                onClick={() => checkAnswer(false)}
              >
                <Icon name="question" size="huge" color="yellow" style={{ margin: 0 }} />
              </Button>
            </div>
          )}
        </div>
      </Flashcard>
      <Flashcard {...cardProps}>
        <div className="overflow-auto bold justify-center align-center grow">
          <ul style={{ maxHeight: '90%', maxWidth: '100%', paddingRight: '2em' }}>
            {translations}
          </ul>
        </div>
      </Flashcard>
    </ReactCardFlip>
  )
}

export default Quick
