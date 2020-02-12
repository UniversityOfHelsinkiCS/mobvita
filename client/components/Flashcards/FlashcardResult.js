import React from 'react'
import { Icon } from 'semantic-ui-react'

const FlashcardResult = ({ answerCorrect }) => {
  if (answerCorrect === null) return null

  const iconName = answerCorrect === 'true' ? 'thumbs up outline' : 'thumbs down outline'

  return (
    <div className="flashcardResult">
      <Icon name={iconName} size="huge" />
    </div>
  )
}

export default FlashcardResult
