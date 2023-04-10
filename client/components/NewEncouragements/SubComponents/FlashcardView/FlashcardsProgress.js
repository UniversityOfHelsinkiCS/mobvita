import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { images, backgroundColors } from 'Utilities/common'

const FlashcardsProgress = () => {
  return (
    <div className="pt-md">
      <div
        className="flex enc-message-body"
        style={{
          alignItems: 'center',
          backgroundColor: backgroundColors[2],
        }}
      >
        <img
          src={images.barChart}
          alt="bar chart"
          style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
        />
        <div>
          <FormattedMessage id="go-to-flashcards-progress" />
          &nbsp;
          <Link className="interactable" to="/profile/progress/flashcards">
            <FormattedMessage id="review-progress" />
          </Link>
          ?
        </div>
      </div>
    </div>
  )
}

export default FlashcardsProgress