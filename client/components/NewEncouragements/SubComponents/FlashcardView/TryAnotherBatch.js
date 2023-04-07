import React from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { images, backgroundColors } from 'Utilities/common'
import { Button } from 'react-bootstrap'


const TryAnotherBatch = ({ handleNewDeck }) => {
  return (
    <div className="pt-md">
      <div
        className="flex enc-message-body"
        style={{
          alignItems: 'center',
          backgroundColor: backgroundColors[1],
        }}
      >
        <img
          src={images.flashcards}
          alt="bar chart"
          style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
        />
        <div>
          <FormattedHTMLMessage id="well-done-click-next-card-to-play-another-set-of-cards-2" />
          &nbsp;
          <Button className="interactable" variant="primary" onClick={() => handleNewDeck()}>
            <FormattedMessage id="next-card" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TryAnotherBatch