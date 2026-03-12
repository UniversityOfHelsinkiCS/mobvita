import React from 'react'
import { FormattedHTMLMessage } from 'react-intl'

const FlashcardStoryInfo = ({ title, type, numOfRewardableWords }) => {
  return (
    <div className="flashcard-story-info-body">
      {(title && type === 'test' && (
        <h5>
          <FormattedHTMLMessage
            id="story-blue-cards"
            values={{
              nWords: numOfRewardableWords,
              story: title,
            }}
          />
        </h5>
      )) ||
        (title && (
          <h5>
            <FormattedHTMLMessage
              id="story-flashcards"
              values={{
                story: title,
              }}
            />
          </h5>
        )) ||
        null}
    </div>
  )
}

export default FlashcardStoryInfo