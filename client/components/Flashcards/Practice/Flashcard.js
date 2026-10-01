import React from 'react'
import { flashcardColors, images } from 'Utilities/common'
import FlashcardDelete from './FlashcardDelete'

// `showActions` is the back of the card asking for the edit/delete row. It is an explicit flag
// rather than a test on `id`, because a blue-card deck's items can arrive without one and the
// controls still belong there. The front is the exercise, so it never sets it.
// `cardBackground` overrides the per-stage colour — the blue-cards deck paints every card alike.
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
              <button className="flashcard-blended-input" type="button" onClick={handleEdit}>
                <img src={images.edit03} alt="edit" style={{ width: 20, height: 20 }} />
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
              <img src={images.flipBackCircle} alt="" />
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Flashcard
