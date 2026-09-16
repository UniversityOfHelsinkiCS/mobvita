import React from 'react'
import { FormattedMessage } from 'react-intl'
import { flashcardColors, images } from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import FlashcardDelete from './FlashcardDelete'

// `showActions` is the back of the card asking for the edit/delete row. It is an explicit flag
// rather than a test on `id`, because a blue-card deck's items can arrive without one and the
// controls still belong there. The front is the exercise, so it never sets it.
const Flashcard = ({ flipCard, cardNumbering, stage, children, id, handleEdit, showActions }) => {
  const { background, foreground } = flashcardColors

  return (
    <div
      className="flashcard"
      style={{ backgroundColor: background[stage], color: foreground[stage] }}
    >
      <div data-cy="flashcard-content" className="flashcard-content">
        <div className="flashcard-header">
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            {showActions && handleEdit && (
              <button className="flashcard-blended-input" type="button" onClick={handleEdit}>
                <img src={images.edit03} alt="edit" style={{ width: 20, height: 20 }} />
              </button>
            )}
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>{cardNumbering}</div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {showActions && <FlashcardDelete id={id} />}
          </div>
        </div>
        {children}
      </div>
      <div className="flashcard-footer">
        <button
          className="flashcard-flip-button flashcard-blended-input"
          type="button"
          onClick={() => flipCard()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5em',
            width: '100%',
            padding: '0.7em',
            borderRadius: 999,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: colors.ink,
            color: colors.card,
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          <img src={images.flip} alt="" style={{ width: 20, height: 20 }} />
          <FormattedMessage id="Flip" />
        </button>
      </div>
    </div>
  )
}

export default Flashcard
