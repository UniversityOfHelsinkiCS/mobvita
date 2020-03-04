import React, { useState, useEffect } from 'react'
import ReactCardFlip from 'react-card-flip'
import { recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'
import FlashcardSide from './FlashcardSide'

const Flashcard = ({ card, cardIndex, setSwipeIndex }) => {
  const [flipped, setFlipped] = useState(false)
  const [answerChecked, setAnswerChecked] = useState(false)
  const [answerCorrect, setAnswerCorrect] = useState(null)

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

    recordFlashcardAnswer(inputLanguage, outputLanguage, answerDetails)

    flipCard()
    setAnswerCorrect(correct)
  }

  const hintText = hint && hint[0] && hint[0].hint

  const noCards = format === 'no-cards'

  const translations = Array.isArray(glosses)
    ? glosses.map(item => <li key={item}>{item}</li>)
    : glosses

  return (
    <ReactCardFlip isFlipped={flipped}>
      <FlashcardSide
        answerChecked={answerChecked}
        answerCorrect={answerCorrect}
        checkAnswer={checkAnswer}
        flipCard={flipCard}
        cardIndex={cardIndex}
        stage={stage}
        setSwipeIndex={setSwipeIndex}
        noCards={noCards}
        hint={hintText}
        id={_id}
      >
        <h2>{lemma}</h2>
      </FlashcardSide>
      <FlashcardSide
        answerChecked={answerChecked}
        answerCorrect={answerCorrect}
        checkAnswer={checkAnswer}
        flipCard={flipCard}
        cardIndex={cardIndex}
        stage={stage}
        setSwipeIndex={setSwipeIndex}
        id={_id}
      >
        <ul className="flashcard-translations">{translations}</ul>
      </FlashcardSide>
    </ReactCardFlip>
  )
}

export default Flashcard
