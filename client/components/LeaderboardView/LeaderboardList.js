import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Spinner from 'Components/Spinner'
import { useCurrentUser } from 'Utilities/common'
import LeaderboardItem from './LeaderboardItem'

const LeaderboardList = ({ amountToShow }) => {
  const { leaderboard, user_rank: userPositionIndex } = useSelector(
    ({ leaderboard }) => leaderboard.data
  )
  const user = useCurrentUser()

  const filteredLeaderboard = useMemo(
    () => leaderboard?.filter(item => item.weekly_time_spent !== 0).splice(0, amountToShow),
    [leaderboard]
  )

  if (!leaderboard) return <Spinner />

  const isUserInTopPositions = userPositionIndex < filteredLeaderboard.length
  const isUserParticipatingInLeaderboards = user.publish_progress
  const showUserPosition = !isUserInTopPositions && isUserParticipatingInLeaderboards

  return (
    <div>
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
      {showUserPosition && (
        <div>
          <div className="leaderboard-item-container center">
            <span>&bull;&bull;&bull;</span>
          </div>
          <LeaderboardItem
            position={userPositionIndex + 1}
            username={user.username}
            value={`${user.weekly_times[0].practice_time}h`}
            highlighted
          />
        </div>
      )}
    </div>
  )
}

export default LeaderboardList
