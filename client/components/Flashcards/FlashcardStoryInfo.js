import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React from 'react'

import CustomTooltip from 'Components/CustomTooltip'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

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
    <CustomTooltip
      title={content({ type, numOfRewardableWords, truncatedTitle })}
      placement="bottom"
      permanent
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
        <InfoOutlinedIcon sx={{ fontSize: 24, display: 'block' }} />
      </div>
    </CustomTooltip>
  )
}
