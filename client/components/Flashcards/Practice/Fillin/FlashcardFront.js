import React from 'react'
import { useSelector } from 'react-redux'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import FlashcardInput from './FlashcardInput'
import FlashcardResult from './FlashcardResult'
import FlashcardHint from './FlashcardHint'
import Flashcard from '../Flashcard'

const FlashcardFront = ({
  answerChecked,
  answerCorrect,
  checkAnswer,
  hints,
  lemma,
  focusedAndBigScreen,
  ...props
}) => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const sameLanguage = learningLanguage === dictionaryLanguage

  return (
    <Flashcard {...props}>
      <div className="flashcard-text-container">
        <FlashcardHint hint={hints} />
        <h2 data-cy="flashcard-title" className="flashcard-title">{lemma}</h2>
      </div>
      {!sameLanguage
        && (
          <div className="flashcard-input-and-result-container">
            <FlashcardInput
              answerChecked={answerChecked}
              checkAnswer={checkAnswer}
              focusedAndBigScreen={focusedAndBigScreen}
            />
            <FlashcardResult answerCorrect={answerCorrect} />
          </div>
        )
      }
    </Flashcard>
  )
}

export default FlashcardFront
