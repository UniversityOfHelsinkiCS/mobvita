import React, { useState, useEffect } from 'react'
import ReactCardFlip from 'react-card-flip'
import { recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'
import FlashcardSide from './FlashcardSide'

const Flashcard = ({ card }) => {
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

  const { glosses, lemma, _id, story, lan_in: inputLanguage, lan_out: outputLanguage } = card

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
      >
        <h2>{lemma}</h2>
      </FlashcardSide>
      <FlashcardSide
        answerChecked={answerChecked}
        answerCorrect={answerCorrect}
        checkAnswer={checkAnswer}
        flipCard={flipCard}
      >
        <ul className="flashcardTranslations">{translations}</ul>
      </FlashcardSide>
    </ReactCardFlip>
  )
}

export default Flashcard
