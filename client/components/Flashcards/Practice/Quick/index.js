import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { flashcardColors, images } from 'Utilities/common'
import { setFlashcardAnswered } from 'Utilities/redux/flashcardReducer'
import AppButton from 'Components/AppButton'
import FlipCard from '../FlipCard'
import Flashcard from '../Flashcard'
import CardAnswer from '../CardAnswer'
import useFittedTitle from '../useFittedTitle'

// Both choices are bare icons that swell a little under the pointer.
const choiceButton = {
  style: { backgroundColor: 'transparent', padding: '0.25em', borderRadius: '50%' },
  sx: {
    transition: 'transform 0.15s ease',
    '&:hover': { backgroundColor: 'transparent', transform: 'scale(1.15)' },
  },
}

const Quick = ({ card, cardNumbering, answerCard }) => {
  const [flipped, setFlipped] = useState(false)
  const [answerCorrect, setAnswerCorrect] = useState(null)
  const [answerSeen, setAnswerSeen] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setFlipped(false)
    setAnswerCorrect(null)
    setAnswerSeen(false)
  }, [card])

  const { lemma, _id: id, stage, glosses } = card
  const titleRef = useFittedTitle(lemma)

  // Turning to the back gives the answer away, so the two choices do not come back with the front.
  const flipCard = () => {
    setFlipped(!flipped)
    if (!flipped) setAnswerSeen(true)
  }

  // The learner grades themselves, so their own verdict is what the back's face reports.
  const checkAnswer = answerIsCorrect => {
    answerCard(null, answerIsCorrect, 'fillin')
    setAnswerCorrect(answerIsCorrect)
    dispatch(setFlashcardAnswered(true))
    flipCard()
  }

  const cardProps = {
    flipCard,
    cardNumbering,
    stage,
    id,
  }

  return (
    <FlipCard isFlipped={flipped}>
      <Flashcard {...cardProps}>
        <div className="flashcard-text-container">
          <h2 data-cy="flashcard-title" className="flashcard-title" ref={titleRef}>
            {lemma}
          </h2>
        </div>
        <div className="flashcard-quick-actions">
          {!answerSeen && (
            <>
              <AppButton {...choiceButton} onClick={() => checkAnswer(true)}>
                <img src={images.checkCircle} alt="I know it" style={{ width: 64, height: 64 }} />
              </AppButton>
              <AppButton {...choiceButton} onClick={() => checkAnswer(false)}>
                <img src={images.question} alt="I don't know" style={{ width: 64, height: 64 }} />
              </AppButton>
            </>
          )}
        </div>
      </Flashcard>
      <Flashcard {...cardProps} cardBackground={flashcardColors.backBackground}>
        <CardAnswer
          answerCorrect={answerCorrect}
          showVerdict={flipped}
          lemma={lemma}
          glosses={glosses}
        />
      </Flashcard>
    </FlipCard>
  )
}

export default Quick
