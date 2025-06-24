import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const FlashcardEndView = ({ handleNewDeck, open }) => {
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
    <div className="flashcard justify-center" style={{ visibility: 'hidden' }}>
      <p style={{ fontWeight: '500', fontSize: '1.2em', padding: '1em' }}>
        <FormattedMessage id="well-done-flashcards" />
      </p>
      <div className="flashcard-input" style={{ flex: 0 }}>
        <Link to="/">
          <Button className="flashcard-button" block variant="outline-primary">
            <FormattedMessage id="return-to-main-page" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default FlashcardEndView
