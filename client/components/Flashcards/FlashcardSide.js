import React from 'react'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import FlashcardDelete from './FlashcardDelete'
import SelectLanguage from './SelectLanguage'

const FlashcardSide = ({
  flipCard,
  cardIndex,
  stage,
  format,
  children,
  id,
}) => {
  const backgroundColor = [
    'rgb(255, 99, 71)',
    'rgb(255, 165, 0)',
    'rgb(255, 215, 0)',
    'yellowgreen',
    'limegreen',
  ]

  return (
    <div className="flashcard" style={{ backgroundColor: backgroundColor[stage] }}>
      <div
        data-cy="flashcard-content"
        className="flashcard-content"
      >
        <div className="flashcard-header">
          {cardIndex}
          <FlashcardDelete id={id} />
        </div>
        {children}
      </div>
      <div className="flashcard-footer">
        <SelectLanguage />
        {format !== 'no-cards'
          && (
            <button
              className="flashcard-blended-input"
              type="button"
              onClick={() => flipCard()}
            >
              <FormattedMessage id="Flip" />
              {'  '}
              <Icon name="arrow right" />
            </button>
          )
        }
      </div>

    </div>
  )
}

export default FlashcardSide
