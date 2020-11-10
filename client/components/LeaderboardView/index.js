import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Spinner } from 'react-bootstrap'
import { images } from 'Utilities/common'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import Header from 'Components/Header'
import Subheader from 'Components/Subheader'
import LeaderboardList from './LeaderboardList'
import LastWeeksWinners from './LastWeeksWinners'

const Leaderboard = () => {
  const dispatch = useDispatch()

  const { pending } = useSelector(({ leaderboard }) => leaderboard)

  useEffect(() => {
    dispatch(getLeaderboards())
  }, [])

  return (
    <div className="component-container padding-sides-1" style={{ maxWidth: '720px' }}>
      <div className="space-between">
        <div style={{ width: '100%' }}>
          <div className="space-between">
            <Header translationId="Hours practiced" />
            {pending && (
              <div>
                <Spinner animation="grow" variant="primary" size="sm" />
                <span
                  style={{ color: '#777', fontSize: '12px', fontWeight: 550, paddingLeft: '.5rem' }}
                >
                  <FormattedMessage id="Updating" />
                </span>
              </div>
            )}
          </div>
          <LastWeeksWinners />
          <Subheader
            imgSource={images.leaderboard}
            imgAlt="leadeboard"
            translationId="Top people this week"
          />
        </div>
      </div>
      <LeaderboardList amountToShow={25} />
    </div>
  )
}

export default Leaderboard
