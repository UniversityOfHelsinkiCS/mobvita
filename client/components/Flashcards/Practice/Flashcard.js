import React from 'react'
import { flashcardColors, images } from 'Utilities/common'
import AppIcon from 'Components/ui/AppIcon'
import FlashcardDelete from './FlashcardDelete'

// A card face; `showActions` (back only, not an `id` test since blue cards may lack one) adds
// edit/delete, and `cardBackground` overrides the per-stage colour.
const Flashcard = ({
  flipCard,
  cardNumbering,
  stage,
  children,
  id,
  handleEdit,
  showActions,
  cardBackground,
}) => {
  const { background, foreground } = flashcardColors

  return (
    <div
      className="flashcard"
      style={{ backgroundColor: cardBackground || background[stage], color: foreground[stage] }}
    >
      <div data-cy="flashcard-content" className="flashcard-content">
        <div className="flashcard-header">
          <div className="flashcard-header-slot">
            {showActions && handleEdit && (
              <button
                className="flashcard-blended-input"
                type="button"
                onClick={handleEdit}
                aria-label="edit"
              >
                <AppIcon src={images.edit03} size={20} />
              </button>
            )}
            {showActions && <FlashcardDelete id={id} />}
          </div>
          <div className="flashcard-header-slot flashcard-header-slot--center">{cardNumbering}</div>
          <div className="flashcard-header-slot flashcard-header-slot--end">
            <button
              className="flashcard-flip-button"
              type="button"
              onClick={() => flipCard()}
              aria-label="flip card"
              data-cy="flashcard-flip"
            >
              <AppIcon src={images.flipBackCircle} size={36} style={{ display: 'block' }} />
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Flashcard
