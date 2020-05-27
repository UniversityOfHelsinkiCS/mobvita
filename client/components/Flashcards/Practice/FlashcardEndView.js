import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

const FlashcardEndView = ({ handleNewDeck }) => (
  <div className="flashcard">
    <div className="flashcard-content">
      <div className="flashcard-text-container">
        <p style={{ fontWeight: '550', fontSize: '1.5em' }}>
          <FormattedMessage id="well-done-click-next-card-to-play-another-set-of-cards" />
        </p>
      </div>
      <div className="flashcard-input">
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
