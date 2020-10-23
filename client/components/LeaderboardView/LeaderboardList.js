import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Spinner from 'Components/Spinner'
import { useCurrentUser, images } from 'Utilities/common'
import LeaderboardItem from './LeaderboardItem'

const Medal = ({ position }) => (
  <img src={images[`${position}Medal`]} alt={`${position} position medal`} height="24px" />
)

const LeaderboardList = ({ amountToShow }) => {
  const { leaderboard, user_rank: userPositionIndex } = useSelector(
    ({ leaderboard }) => leaderboard.data
  )
  const user = useCurrentUser()
  const userParticipatingInCompetition = user.publish_progress

  const filteredLeaderboard = useMemo(
    () => leaderboard?.filter(item => item.weekly_time_spent !== 99).splice(0, amountToShow),
    [leaderboard]
  )

  const isEligibleForMedal = (positionInList, positionToCheck) => {
    const userInPositionToCheckOrHigher = userPositionIndex < positionToCheck
    return (
      (!userParticipatingInCompetition &&
        userInPositionToCheckOrHigher &&
        positionInList === positionToCheck + 1) ||
      ((!userInPositionToCheckOrHigher || userParticipatingInCompetition) &&
        positionInList === positionToCheck)
    )
  }

  const getPositionToRender = (position, userIdForPosition) => {
    const isCurrentUser = userIdForPosition === user.oid
    if (
      position > 4 ||
      (userParticipatingInCompetition && position > 3) ||
      (isCurrentUser && !userParticipatingInCompetition)
    )
      return position
    if (isEligibleForMedal(position, 3)) return <Medal position="third" />
    if (isEligibleForMedal(position, 2)) return <Medal position="second" />
    return <Medal position="first" />
  }

  if (!leaderboard) return <Spinner />

  const userInTopPositions = userPositionIndex < filteredLeaderboard.length

  return (
    <div>
      {filteredLeaderboard.map(
        ({ user_id: userId, username, weekly_time_spent: hoursPracticed }, index) => (
          <LeaderboardItem
            key={userId}
            username={username}
            value={`${hoursPracticed}h`}
            highlighted={userId === user.oid}
            position={getPositionToRender(index + 1, userId)}
          />
        )
      )}
      {!userInTopPositions && (
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
