import React from 'react'
import FlashcardResult from './FlashcardResult'
import FlashcardSide from './FlashcardSide'

const FlashcardBack = ({ answerCorrect, glosses, ...props }) => {
  const translations = Array.isArray(glosses)
    ? glosses.map(item => <li key={item}>{item}</li>)
    : glosses

  return (
    <FlashcardSide {...props}>
      <div className="flashcard-text-container">
        <div className="flashcard-translations">
          <ul>{translations}</ul>
        </div>
      </div>
      <div className="flashcard-input-and-result-container">
        <FlashcardResult answerCorrect={answerCorrect} />
      </div>
    </FlashcardSide>
  )
}
export default FlashcardBack
