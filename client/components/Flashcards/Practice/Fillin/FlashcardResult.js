import React from 'react'
import { images } from 'Utilities/common'

// `size` is the face's px square — the card's back shows it large, the front's floating copy small.
const FlashcardResult = ({ answerCorrect, size = 20 }) => {
  if (answerCorrect === null) return null

  const src = answerCorrect ? images.smileHappy : images.smileSad

  return (
    <div className="flashcard-result">
      <img
        src={src}
        alt=""
        className={answerCorrect ? 'smile up' : 'smile down'}
        style={{ width: size, height: size }}
      />
    </div>
  )
}

export default FlashcardResult
