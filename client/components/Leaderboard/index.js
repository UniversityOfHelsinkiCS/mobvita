import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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

  const isUserInTopPositions = userPositionIndex < leaderboard.length

  if (!leaderboard) return <Spinner fullHeight />

  return (
    <div className="component-container padding-sides-1">
      <h2 className="header-3">Hours practiced</h2>
      <hr />
      {leaderboard.map(({ user_id: userId, username, total_time_spent: hoursPracticed }, index) => (
        <LeaderboardItem
          key={userId}
          position={index + 1}
          username={username}
          value={`${Math.floor(hoursPracticed)}h`}
          highlighted={userId === user.oid}
        />
      ))}
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
