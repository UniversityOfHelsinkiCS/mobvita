import React, { useState } from 'react'
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
  phonetics,
  focusedAndBigScreen,
  stage,
  ...props
}) => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const sameLanguage = learningLanguage === dictionaryLanguage
  const fontClass = lemma.length < 15 ? 'flashcard-title' : 'flashcard-title-small'

  const [displayedHints, setDisplayedHints] = useState([])

  return (
    <Flashcard stage={stage} {...props}>
      <div className="flashcard-text-container">
        <FlashcardHint
          hints={hints}
          stage={stage}
          displayedHints={displayedHints}
          setDisplayedHints={setDisplayedHints}
        />
        <h2 data-cy="flashcard-title" className={fontClass}>
          {lemma}
        </h2>
        <h3 className="flashcard-phonetics">{phonetics && phonetics}</h3>
      </div>
      {!sameLanguage && (
        <div className="flashcard-input-and-result-container">
          <FlashcardInput
            answerChecked={answerChecked}
            checkAnswer={checkAnswer}
            focusedAndBigScreen={focusedAndBigScreen}
            displayedHints={displayedHints}
          />
          <FlashcardResult answerCorrect={answerCorrect} />
        </div>
      )}
    </Flashcard>
  )
}

export default FlashcardFront
