import React, { useState, useEffect } from 'react'
import ReactCardFlip from 'react-card-flip'
import Check from '@mui/icons-material/Check'
import QuestionMark from '@mui/icons-material/QuestionMark'
import AppButton from 'Components/AppButton'
import { addToTotal } from 'Utilities/redux/flashcardReducer'
import { useDispatch } from 'react-redux'
import Flashcard from '../Flashcard'

const Quick = ({ card, cardNumbering, answerCard }) => {
  const [flipped, setFlipped] = useState(false)
  const [answered, setAnswered] = useState(false)
  const dispatch = useDispatch()

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

  const fontClass = lemma.length < 15 ? 'header-2 auto' : 'header-3 auto'

  return (
    <ReactCardFlip isFlipped={flipped}>
      <Flashcard {...cardProps}>
        <div className="flex-col grow">
          <span className={fontClass}>{lemma}</span>
          {!answered && (
            <div className="flex space-evenly padding-bottom-4">
              <AppButton
                style={{ backgroundColor: 'white', padding: '1em', borderRadius: '50%' }}
                onClick={() => checkAnswer(true)}
              >
                <Check sx={{ fontSize: '4rem', margin: 0, color: '#21BA45' }} />
              </AppButton>
              <AppButton
                style={{ backgroundColor: 'white', padding: '1em', borderRadius: '50%' }}
                onClick={() => checkAnswer(false)}
              >
                <QuestionMark sx={{ fontSize: '4rem', margin: 0, color: '#FBBD08' }} />
              </AppButton>
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
