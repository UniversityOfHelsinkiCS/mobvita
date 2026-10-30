import React from 'react'
import AppButton from 'Components/AppButton'
import { FormattedMessage } from 'react-intl'
import { images, backgroundColors, showAllEncouragements } from "Utilities/common"
import { useSelector } from 'react-redux'

// Home-view nudge to import the daily stories; shown when cached stories exist.
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
              src={images.libraryBig}
              alt="pile of books"
              style={{ width: '8%', flexShrink: 0, marginRight: '1em' }}
            />
            <div>
              <div className="flex space-between">
                <div>
                  <FormattedMessage id="daily-stories" />
                  &nbsp;
                  <FormattedMessage id="daily-stories-explanation" />
                </div>
                <AppButton onClick={handleDailyStoriesClick} style={{ marginLeft: '.5rem' }}>
                  <FormattedMessage id="show-daily-stories-button" />
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default DailyStoriesEncouragement
