import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

const FlashcardEndView = ({ handleNewDeck }) => (
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

export default FlashcardEndView
