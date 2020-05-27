import React from 'react'
import { Icon } from 'semantic-ui-react'

const FlashcardResult = ({ answerCorrect }) => {
  if (answerCorrect === null) return null

  const iconName = answerCorrect ? 'thumbs up outline' : 'thumbs down outline'

  return (
    <div className="flashcard-result">
      <Icon name={iconName} size="huge" />
    </div>
  )
}

export default FlashcardResult
