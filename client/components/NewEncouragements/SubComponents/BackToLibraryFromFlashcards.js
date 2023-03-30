import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { images, backgroundColors } from 'Utilities/common'


const BackToLibraryFromFlashcards = () => {
  return (
    <div className="pt-md">
      <div
        className="flex enc-message-body"
        style={{
          alignItems: 'center',
          backgroundColor: backgroundColors[0],
        }}
      >
        <img
          src={images.practice}
          alt="dumbbell"
          style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
        />
        <div>
          <FormattedMessage id="go-back-to-library" />
          <br />
          <Link className="interactable" to="/library">
            <FormattedMessage id="go-back-to-library-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BackToLibraryFromFlashcards