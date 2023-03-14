import React from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { images, backgroundColors } from 'Utilities/common'


const DailyStoriesEncouragement = ({ handleDailyStoriesClick }) => {
  return (
    <div className="pt-md">
      <div
        className="flex enc-message-body"
        style={{ alignItems: 'center', backgroundColor: backgroundColors[0] }}
      >
        <img
          src={images.library}
          alt="pile of books"
          style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
        />
        <div>
          <div className="flex space-between">
            <div>
              <FormattedMessage id="daily-stories" />
              &nbsp;
              <FormattedMessage id="daily-stories-explanation" />
            </div>
            <Button onClick={handleDailyStoriesClick} style={{ marginLeft: '.5rem' }}>
              <FormattedMessage id="show-daily-stories-button" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyStoriesEncouragement