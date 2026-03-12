import React from 'react'
import { FormattedHTMLMessage } from 'react-intl'

const FlashcardStoryInfo = ({ title, type, numOfRewardableWords }) => {
  if (!title) return <div></div>

	const truncatedTitle = title.length > 50 ? `${title.slice(0, 50)}...` : title

  return (
    <div className="flashcard-story-info-body">
      {type === 'test' ? (
        <h5>
          <FormattedHTMLMessage
            id="story-blue-cards"
            values={{
              nWords: numOfRewardableWords,
              story: truncatedTitle,
            }}
          />
        </h5>
      ) : (
        <h5>
          <FormattedHTMLMessage
            id="story-flashcards"
            values={{
              story: truncatedTitle,
            }}
          />
        </h5>
      )}
    </div>
  )
}

export default FlashcardStoryInfo