import React from 'react'
import { FormattedHTMLMessage } from 'react-intl'

const FlashcardStoryInfo = ({ title, type, numOfRewardableWords }) => {
  if (!title) return <div></div>

  return (
    <div className="flashcard-story-info-body">
      {type === 'test' ? (
        <h5>
          <FormattedHTMLMessage
            id="story-blue-cards"
            values={{
              nWords: numOfRewardableWords,
              story: title,
            }}
          />
        </h5>
      ) : (
        <h5>
          <FormattedHTMLMessage
            id="story-flashcards"
            values={{
              story: title,
            }}
          />
        </h5>
      )}
    </div>
  )
}

export default FlashcardStoryInfo