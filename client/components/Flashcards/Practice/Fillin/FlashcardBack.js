import React, { useEffect, useCallback } from 'react'
import FlashcardResult from './FlashcardResult'
import Flashcard from '../Flashcard'

const FlashcardBack = ({
  answerCorrect,
  glosses,
  focusedAndBigScreen,
  flipped,
  swipeIndex,
  infoMessage,
  lemma,
  handleIndexChange,
  ...props
}) => {
  // Enter advances the deck, but the listener is on `document` — so a press inside any field (the
  // assistant's chat box, the answer input) belongs to that field, not to the deck.
  const handleEnter = useCallback(event => {
    if (event.keyCode !== 13) return

    const target = event.target
    const tag = target?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return

    handleIndexChange(swipeIndex + 1)
  })

  useEffect(() => {
    if (focusedAndBigScreen && flipped) {
      document.addEventListener('keydown', handleEnter, false)

      return () => {
        document.removeEventListener('keydown', handleEnter, false)
      }
    }
  }, [focusedAndBigScreen, flipped])

  const translations = Array.isArray(glosses)
    ? [...new Set(glosses)].map(item => <li key={item}>{item}</li>)
    : glosses

  return (
    <Flashcard showActions {...props}>
      <div className="flashcard-back">
        <div className="flashcard-result-slot">
          {/* Both faces stay mounted, so the verdict is rendered only while the back is the side
              being shown — otherwise it is already there part-way through the turn. */}
          {flipped && <FlashcardResult answerCorrect={answerCorrect} />}
        </div>
        {infoMessage && <div className="flashcard-back-info">{infoMessage}</div>}
        <h3 className="flashcard-back-lemma">{lemma}</h3>
        <div className="flashcard-back-translations">
          <ul>{translations}</ul>
        </div>
      </div>
    </Flashcard>
  )
}
export default FlashcardBack
