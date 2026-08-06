import React from 'react'
import { images } from 'Utilities/common'

const FlashcardResult = ({ answerCorrect }) => {
  if (answerCorrect === null) return null

  const src = answerCorrect ? images.faceCorrect : images.faceIncorrect

  return (
    <div className="flashcard-result">
      {/* `thumbs up` / `thumbs down` classes are kept for flashcards_spec.js selectors. */}
      <img
        src={src}
        alt=""
        className={answerCorrect ? 'thumbs up' : 'thumbs down'}
        style={{ width: 48, height: 48 }}
      />
    </div>
  )
}

export default FlashcardResult
