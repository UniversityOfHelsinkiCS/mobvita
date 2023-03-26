import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { images } from 'Utilities/common'
import { useSelector } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'

const ExerciseEncouragementHeader = () => {
  const userData = useSelector(state => state.user.data.user)
  const intl = useIntl()
  const bigScreen = useWindowDimensions().width > 700

  const storiesCovered = userData.stories_covered
  const notFirst = storiesCovered > 1

  return (
    <div className="flex">
      <div>
        <div
          style={{
            marginBottom: '.75em',
            fontWeight: 500,
            fontSize: '1.4rem',
          }}
        >
          <FormattedMessage
            id={
              notFirst
                ? 'story-completed-encouragement'
                : 'first-story-covered-encouragement'
            }
          />
        </div>
        {storiesCovered > 1 && (
          <div style={{ marginBottom: '.5em' }}>
            {intl.formatMessage(
              { id: 'stories-covered-encouragement' },
              { stories: storiesCovered }
            )}
          </div>
        )}
      </div>
      <img
        src={images.fireworks}
        alt="encouraging fireworks"
        className={bigScreen ? 'enc-picture' : 'enc-picture-mobile'}
      />
    </div>
  )
}

export default ExerciseEncouragementHeader