import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

const FlashcardEndView = ({ handleNewDeck }) => {
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

  if (RightArrowPress || EnterPress) {
    handleNewDeck()
  }

  return (
    <div className="flashcard justify-center">
      <div>
        <p style={{ fontWeight: '500', fontSize: '1.2em', padding: '1em' }}>
          <FormattedMessage id="well-done-click-next-card-to-play-another-set-of-cards" />
        </p>
        <div className="flashcard-input" style={{ flex: 0 }}>
          <Button
            className="flashcard-button"
            block
            variant="outline-primary"
            onClick={() => handleNewDeck()}
          >
            <FormattedMessage id="next-card" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FlashcardEndView
