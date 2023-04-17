import React from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { images, backgroundColors, showAllEncouragements } from "Utilities/common"
import { useSelector } from 'react-redux'

const DailyStoriesEncouragement = ({ handleDailyStoriesClick }) => {
  const { cachedStories } = useSelector(({ metadata }) => metadata)

  return (
    <>
      {cachedStories?.length > 0 || showAllEncouragements ? (
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[2] }}
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
      ) : null}
    </>
  )
}

export default DailyStoriesEncouragement
