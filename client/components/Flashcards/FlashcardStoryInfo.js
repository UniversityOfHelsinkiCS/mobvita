import React from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'

const content = ({ type, numOfRewardableWords, truncatedTitle }) => (
  <>
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
  </>
)

export const FlashcardStoryInfo = ({ title, type, numOfRewardableWords }) => {
  if (!title) return null

  const truncatedTitle = title.length > 50 ? `${title.slice(0, 50)}...` : title

  return (
    <div className="flashcard-story-info-body">
      {content({ type, numOfRewardableWords, truncatedTitle })}
    </div>
  )
}

export const FlashcardStoryInfoIcon = ({ type, numOfRewardableWords, title }) => {
  if (!title) return <div></div>

  const truncatedTitle = title.length > 50 ? `${title.slice(0, 50)}...` : title

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id="flashcard-story-info-tooltip" className="white-tooltip">
          {content({ type, numOfRewardableWords, truncatedTitle })}
        </Tooltip>
      }
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          display: 'inline-flex',
          flex: '0 0 28px',
          alignSelf: 'flex-start',
        }}
      >
        <Icon name="info circle" style={{ width: '24px', height: '24px', display: 'block' }} />
      </div>
    </OverlayTrigger>
  )
}
