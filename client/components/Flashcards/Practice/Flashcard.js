import React from 'react'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { FormattedMessage } from 'react-intl'
import { flashcardColors } from 'Utilities/common'
import FlashcardDelete from './FlashcardDelete'

const Flashcard = ({ flipCard, cardNumbering, stage, children, id, handleEdit }) => {
  const { background, foreground } = flashcardColors

  return (
    <div
      className="flashcard"
      style={{ backgroundColor: background[stage], color: foreground[stage] }}
    >
      <div data-cy="flashcard-content" className="flashcard-content">
        <div className="flashcard-header">
          <div>
            {handleEdit && (
              <button className="flashcard-blended-input" type="button" onClick={handleEdit}>
                <EditOutlinedIcon sx={{ color: foreground[stage] || 'white' }} />
              </button>
            )}
            {cardNumbering}
          </div>
          <FlashcardDelete id={id} />
        </div>
        {children}
      </div>
      <div className="flashcard-footer">
        <button
          className="flashcard-blended-input auto-left"
          type="button"
          onClick={() => flipCard()}
          style={{ color: foreground[stage] }}
        >
          <FormattedMessage id="Flip" />
          {'  '}
          <ArrowForwardIcon sx={{ color: foreground[stage] }} />
        </button>
      </div>
    </div>
  )
}

export default Flashcard
