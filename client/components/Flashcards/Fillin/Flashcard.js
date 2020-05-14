import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactCardFlip from 'react-card-flip'
import { recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'
import FlashcardFront from './FlashcardFront'
import FlashcardBack from './FlashcardBack'

const Flashcard = ({ card, cardIndex, setSwipeIndex, focusedAndBigScreen, swipeIndex }) => {
  const [flipped, setFlipped] = useState(false)
  const [answerChecked, setAnswerChecked] = useState(false)
  const [answerCorrect, setAnswerCorrect] = useState(null)

  const { sessionId } = useSelector(({ flashcards }) => flashcards)

  const dispatch = useDispatch()

  useEffect(() => {
    setFlipped(false)
    setAnswerChecked(false)
    setAnswerCorrect(null)
  }, [card])

  const flipCard = () => {
    setFlipped(!flipped)
    setAnswerChecked(true)
  }

  const {
    glosses,
    format,
    lemma,
    _id,
    story,
    lan_in: inputLanguage,
    lan_out: outputLanguage,
    stage,
    hint,
  } = card

  const checkAnswer = (answer) => {
    if (answer !== '') {
      const correct = glosses.includes(answer.toLowerCase()).toString()
      const answerDetails = {
        flashcard_id: _id,
        correct,
        answer,
        exercise: 'fillin',
        mode: 'trans',
        story,
        lemma,
        session_id: sessionId,
      }
      dispatch(recordFlashcardAnswer(inputLanguage, outputLanguage, answerDetails))
      setAnswerCorrect(correct)
    }
    flipCard()
  }

  const cardProps = {
    cardIndex,
    setSwipeIndex,
    stage,
    format,
    id: _id,
    answerCorrect,
    flipCard,
    focusedAndBigScreen,
  }

  return (
    <ReactCardFlip isFlipped={flipped}>
      <FlashcardFront
        answerChecked={answerChecked}
        checkAnswer={checkAnswer}
        hint={hint}
        lemma={lemma}
        {...cardProps}
      />
      <FlashcardBack
        glosses={glosses}
        flipped={flipped}
        swipeIndex={swipeIndex}
        {...cardProps}
      />
    </ReactCardFlip>
  )
}

export default Flashcard
