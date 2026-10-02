import React, { useEffect, useCallback } from 'react'
import FlashcardResult from './FlashcardResult'
import Flashcard from '../Flashcard'
import useFittedTitle from '../useFittedTitle'

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

  const titleRef = useFittedTitle(lemma)

  const translationItems = Array.isArray(glosses)
    ? [...new Set(glosses)]
    : [glosses].filter(Boolean)
  // A reversed card had its descriptions on the front, so its back carries no translations — the
  // word on its own is the whole answer.
  const answerIsWordOnly = translationItems.length === 0

  // Both faces stay mounted, so the verdict is rendered only while the back is the side being
  // shown — otherwise it is already there part-way through the turn.
  const verdict = flipped && <FlashcardResult answerCorrect={answerCorrect} />

  // A word-only answer mirrors the front exactly — floated verdict, same text box, same reserved
  // actions row — so flipping leaves the text where it was instead of dropping it down the card.
  if (answerIsWordOnly) {
    return (
      <Flashcard showActions {...props}>
        <div className="flashcard-result-float">{verdict}</div>
        {infoMessage && <div className="flashcard-back-info">{infoMessage}</div>}
        <div className="flashcard-text-container">
          <h2 className="flashcard-title" ref={titleRef}>
            {lemma}
          </h2>
        </div>
        <div className="flashcard-input-and-result-container" />
      </Flashcard>
    )
  }

  return (
    <Flashcard showActions {...props}>
      <div className="flashcard-back">
        <div className="flashcard-result-slot">{verdict}</div>
        {infoMessage && <div className="flashcard-back-info">{infoMessage}</div>}
        <h3 className="flashcard-back-lemma">{lemma}</h3>
        <div className="flashcard-back-translations">
          <ul>
            {translationItems.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </Flashcard>
  )
}
export default FlashcardBack
