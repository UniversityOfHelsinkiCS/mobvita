import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Spinner } from 'react-bootstrap'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import LeaderboardList from './LeaderboardList'

const Leaderboard = () => {
  const dispatch = useDispatch()

  const { data, pending } = useSelector(({ leaderboard }) => leaderboard)

  useEffect(() => {
    dispatch(getLeaderboards())
  }, [])

  const isLeaderBoardUpdating = data.leaderboard && pending

  return (
    <div className="component-container padding-sides-1" style={{ maxWidth: '720px' }}>
      <div className="space-between">
        <div>
          <h2 className="header-3">
            <FormattedMessage id="Hours practiced" />
          </h2>
          <span className="additional-info">
            <FormattedMessage id="Top people this week" />
          </span>
        </div>
        {isLeaderBoardUpdating && (
          <div>
            <span className="additional-info">
              <FormattedMessage id="Updating" />
            </span>
            <Spinner animation="grow" variant="primary" size="sm" />
          </div>
        )}
      </div>

      <hr />
      <LeaderboardList amountToShow={25} />
    </div>
  )
}

export default Leaderboard
