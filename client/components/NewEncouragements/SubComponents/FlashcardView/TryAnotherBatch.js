import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React from 'react'
import { FormattedMessage } from 'react-intl';
import { images, backgroundColors } from 'Utilities/common'
import AppButton from 'Components/AppButton'


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
          <AppButton className="interactable" variant="primary" onClick={() => handleNewDeck()}>
            <FormattedMessage id="next-card" />
          </AppButton>
        </div>
      </div>
    </div>
  )
}

export default TryAnotherBatch