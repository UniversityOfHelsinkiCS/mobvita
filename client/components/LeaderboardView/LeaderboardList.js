import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Spinner from 'Components/Spinner'
import { useCurrentUser, images } from 'Utilities/common'
import LeaderboardItem from './LeaderboardItem'

const Medal = ({ position }) => (
  <img src={images[`${position}Medal`]} alt={`${position} position medal`} height="24px" />
)

const LeaderboardList = ({ amountToShow }) => {
  const { leaderboard, user_rank: userPositionIndex, user_record: userRecord } = useSelector(
    ({ leaderboard }) => leaderboard.data
  )
  const user = useCurrentUser()
  const userParticipatingInCompetition = user.publish_progress

  const filteredLeaderboard = useMemo(
    () =>
      leaderboard
        ?.filter(item => item.weekly_time_spent !== 0)
        .splice(0, amountToShow)
        .map(item => ({
          userId: item.user_id,
          hoursPracticed: Math.floor(item.weekly_time_spent * 10) / 10,
          ...item,
        })),
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
      {filteredLeaderboard.map(({ userId, username, hoursPracticed }, index) => (
        <LeaderboardItem
          key={userId || username}
          username={username}
          value={`${hoursPracticed}h`}
          highlighted={userId === user.oid}
          position={getPositionToRender(index + 1, userId)}
        />
      ))}
      {!userInTopPositions && (
        <div>
          <div className="leaderboard-item-container center">
            <span>&bull;&bull;&bull;</span>
          </div>
          <LeaderboardItem
            position={userPositionIndex + 1}
            username={user.username}
            value={`${Math.floor(userRecord * 10) / 10}h`}
            highlighted
          />
        </div>
      )}
    </div>
  )
}

export default LeaderboardList
