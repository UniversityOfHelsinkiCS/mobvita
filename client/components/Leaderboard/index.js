import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import Spinner from 'Components/Spinner'
import { useCurrentUser } from 'Utilities/common'
import LeaderboardItem from './LeaderboardItem'

const Leaderboard = () => {
  const { leaderboard, user_rank: userPositionIndex } = useSelector(
    ({ leaderboard }) => leaderboard.data
  )
  const user = useCurrentUser()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getLeaderboards(25))
  }, [])

  const filteredLeaderboard = useMemo(
    () => leaderboard?.filter(item => item.weekly_time_spent !== 0),
    [leaderboard]
  )

  if (!leaderboard) return <Spinner fullHeight />

  const isUserInTopPositions = userPositionIndex < filteredLeaderboard.length

  return (
    <div className="component-container padding-sides-1" style={{ maxWidth: '720px' }}>
      <h2 className="header-3">
        <FormattedMessage id="Hours practiced" />
      </h2>
      <span className="additional-info">
        <FormattedMessage id="Top people this week" />
      </span>
      <hr />
      {filteredLeaderboard.map(
        ({ user_id: userId, username, weekly_time_spent: hoursPracticed }, index) => (
          <LeaderboardItem
            key={userId}
            position={index + 1}
            username={username}
            value={`${hoursPracticed}h`}
            highlighted={userId === user.oid}
          />
        )
      )}
      {!isUserInTopPositions && (
        <div>
          <div className="leaderboard-item-container center">
            <span>&bull;&bull;&bull;</span>
          </div>
          <LeaderboardItem
            position={userPositionIndex + 1}
            username={user.username}
            value="?h"
            highlighted
          />
        </div>
      )}
    </div>
  )
}

export default Leaderboard
