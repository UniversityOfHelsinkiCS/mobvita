import React, { useEffect, useCallback } from 'react'
import { colors } from 'Assets/mui_theme/designTokens'
import FlashcardResult from './FlashcardResult'
import Flashcard from '../Flashcard'

// The green "Word Nest" pill used on the flashcard (design-only styling passed to the shared launcher).
export const WORDNEST_PILL_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: colors.green,
  color: colors.ink,
  border: 'none',
  outline: 'none',
  boxShadow: 'none',
  borderRadius: 999,
  padding: '7px 16px',
  fontWeight: 600,
  fontSize: 14,
}

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
  const handleEnter = useCallback(event => {
    if (event.keyCode === 13) {
      handleIndexChange(swipeIndex + 1)
    }
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
