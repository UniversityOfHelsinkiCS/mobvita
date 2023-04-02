import { images } from 'Utilities/common'
import React from 'react'
import { useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

const WelcomeBackEncouragement = () => {
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const bigScreen = width > 700
  const history = useHistory()
  const isInWelcome = history.location.pathname.includes('/welcome')
  const userData = useSelector(state => state.user.data.user)
  const { username } = userData
  const storiesCovered = userData.stories_covered
  if (!isInWelcome) {
    return null
  }

  return (
    <div className="flex">
      <div className="col-flex">
        <div
          style={{
            fontWeight: 500,
            fontSize: '1.4rem',
            marginBottom: bigScreen ? '1em' : '.5em',
          }}
        >
          {intl.formatMessage({ id: 'welcome-back-encouragement' }, { username })}
        </div>
        <>
          {storiesCovered > 0 && (
            <div style={{ marginBottom: '.5em' }}>
              {intl.formatMessage(
                { id: 'stories-covered-encouragement' },
                { stories: storiesCovered }
              )}
            </div>
          )}
        </>
      </div>
      <img
        src={images.balloons}
        alt="encouraging balloons"
        className={bigScreen ? 'enc-picture' : 'enc-picture-mobile'}
      />
    </div>
  )
}
export default WelcomeBackEncouragement
