import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { images, backgroundColors } from 'Utilities/common'

const GrammarReviewExerciseEncouragement = () => {
  return (
    <div className="pt-md">
      <div
        className="flex enc-message-body"
        style={{ alignItems: 'center', backgroundColor: backgroundColors[1] }}
      >
        <img
          src={images.beeHive}
          alt="beehive"
          style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
        />
        <div>
          <FormattedMessage id="enc-grammar-progress-1" />
          &nbsp;
          <Link className="interactable" to="/profile/progress/grammar">
            <FormattedMessage id="enc-grammar-progress-2" />
          </Link>
          ?
        </div>
      </div>
    </div>
  )
}

export default GrammarReviewExerciseEncouragement