import React from 'react'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import FlashcardDelete from './FlashcardDelete'

const Flashcard = ({
  flipCard,
  cardNumbering,
  stage,
  children,
  id,
  handleEdit,
}) => {
  const backgroundColor = [
    '#FF6347',
    '#E28413',
    '#D19710',
    '#8EA604',
    '#5FAD56',
  ]

  return (
    <div className="flashcard" style={{ backgroundColor: backgroundColor[stage] }}>
      <div
        data-cy="flashcard-content"
        className="flashcard-content"
      >
        <div className="flashcard-header">
          <div>
            {handleEdit
              && (
                <button
                  className="flashcard-blended-input"
                  type="button"
                  onClick={handleEdit}
                >
                  <Icon name="edit" style={{ color: 'white' }} />
                </button>
              )
            }
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
        >
          <FormattedMessage id="Flip" />
          {'  '}
          <Icon name="arrow right" />
        </button>
      </div>

    </div>
  )
}

export default Flashcard
