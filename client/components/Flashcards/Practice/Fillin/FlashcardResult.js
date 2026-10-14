import React from 'react'
import { images } from 'Utilities/common'
import AppIcon from 'Components/ui/AppIcon'
import { colors } from 'Assets/mui_theme/designTokens'

// `size` is the face's px square — the card's back shows it large, the front's floating copy small.
// The happy face's green has no token, so it stays an <img>; the sad one is alert orange.
const FlashcardResult = ({ answerCorrect, size = 20 }) => {
  if (answerCorrect === null) return null

  return (
    <div className="flashcard-result">
      {answerCorrect ? (
        <img
          src={images.smileHappy}
          alt=""
          className="smile up"
          style={{ width: size, height: size }}
        />
      ) : (
        <AppIcon src={images.smileSad} size={size} color={colors.alert} className="smile down" />
      )}
    </div>
  )
}

export default FlashcardResult
