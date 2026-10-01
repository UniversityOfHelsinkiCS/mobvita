import React, { useState, useEffect } from 'react'
import FlipCard from '../FlipCard'
import AppButton from 'Components/AppButton'
import { images } from 'Utilities/common'
import { useDispatch } from 'react-redux'
import { setFlashcardAnswered } from 'Utilities/redux/flashcardReducer'
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
    dispatch(setFlashcardAnswered(true))
    flipCard()
  }

  const cardProps = {
    cardNumbering,
    stage,
    id,
  }

  const translations = Array.isArray(glosses)
    ? [...new Set(glosses)].map(item => <li key={item}>{item}</li>)
    : glosses

  // Quick keeps its own layout; only the word size matches the translate and reversed decks.
  const fontClass =
    lemma.length < 15 ? 'flashcard-quick-word auto' : 'flashcard-quick-word-small auto'

  return (
    <FlipCard isFlipped={flipped} onFlip={flipCard}>
      <Flashcard {...cardProps}>
        <div className="flex-col grow">
          <span className={fontClass}>{lemma}</span>
          {!answered && (
            <div className="flex space-evenly" style={{ paddingBottom: '2.5em' }}>
              <AppButton
                style={{ backgroundColor: 'transparent', padding: '0.25em', borderRadius: '50%' }}
                sx={{
                  transition: 'transform 0.15s ease',
                  '&:hover': { backgroundColor: 'transparent', transform: 'scale(1.15)' },
                }}
                onClick={() => checkAnswer(true)}
              >
                <img src={images.checkCircle} alt="I know it" style={{ width: 64, height: 64 }} />
              </AppButton>
              <AppButton
                style={{ backgroundColor: 'transparent', padding: '0.25em', borderRadius: '50%' }}
                sx={{
                  transition: 'transform 0.15s ease',
                  '&:hover': { backgroundColor: 'transparent', transform: 'scale(1.15)' },
                }}
                onClick={() => checkAnswer(false)}
              >
                <img src={images.question} alt="I don't know" style={{ width: 64, height: 64 }} />
              </AppButton>
            </div>
          )}
        </div>
      </Flashcard>
      <Flashcard {...cardProps}>
        <div className="flashcard-quick-translations">
          <ul>{translations}</ul>
        </div>
      </Flashcard>
    </FlipCard>
  )
}

export default Quick
