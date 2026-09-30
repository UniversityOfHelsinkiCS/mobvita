import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

// `cardBackground` is the deck's colour (blue for the blue-cards test); without it the card keeps
// the base flashcard colour from `.flashcard`.
const FlashcardEndView = ({ handleNewDeck, open, cardBackground }) => {
  // A bit hacky way to move to next deck with right arrow or enter

  const useKeyPress = targetKey => {
    const [keyPressed, setKeyPressed] = useState(false)
    function downHandler({ key }) {
      if (key === targetKey) setKeyPressed(true)
    }

    const upHandler = ({ key }) => {
      if (key === targetKey) setKeyPressed(false)
    }

    useEffect(() => {
      setTimeout(() => {
        window.addEventListener('keydown', downHandler)
        window.addEventListener('keyup', upHandler)
      }, 2000)

      return () => {
        window.removeEventListener('keydown', downHandler)
        window.removeEventListener('keyup', upHandler)
      }
    }, [])

    return keyPressed
  }

  const RightArrowPress = useKeyPress('ArrowRight')
  const EnterPress = useKeyPress('Enter')

  //if ((RightArrowPress || EnterPress) && !open) {
    //console.log('whats this?')
   // handleNewDeck()
  //}

  return (
    <div className="flashcard flashcard-end-view" style={{ backgroundColor: cardBackground }}>
      <p style={{ fontWeight: '500', fontSize: '1.2em' }}>
        <FormattedMessage id="well-done-flashcards" />
      </p>
    </div>
  )
}

export default FlashcardEndView
