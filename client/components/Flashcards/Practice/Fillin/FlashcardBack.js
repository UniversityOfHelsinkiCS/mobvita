import React, { useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import FlashcardResult from './FlashcardResult'
import Flashcard from '../Flashcard'

const FlashcardBack = ({
  answerCorrect,
  glosses,
  focusedAndBigScreen,
  flipped,
  setSwipeIndex,
  swipeIndex,
  infoMessage,
  lemma,
  handleIndexChange,
  ...props
}) => {
  const history = useHistory()
  const blueCardsTest = history.location.pathname.includes('test')
  const handleEnter = useCallback(event => {
    if (event.keyCode === 13) {
      if (blueCardsTest) {
        handleIndexChange(swipeIndex + 1)
      }
      setSwipeIndex(swipeIndex + 1)
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
    <Flashcard {...props}>
      <span
        style={{
          textAlign: 'center',
          fontWeight: 550,
          fontSize: '20px',
          paddingBottom: '1em',
          paddingTop: '1em',
        }}
      >
        {lemma}
      </span>
      {infoMessage && <div className="justify-center">{infoMessage}</div>}
      <div className="flashcard-text-container">
        <div className="flashcard-translations">
          <ul>{translations}</ul>
        </div>
      </div>
      <div className="flashcard-input-and-result-container">
        <FlashcardResult answerCorrect={answerCorrect} />
      </div>
    </Flashcard>
  )
}
export default FlashcardBack
