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
          hoursPracticed: Math.floor(item.weekly_time_spent * 10) / 10,
          ...item,
        })),
    [leaderboard]
  )

  const getAdjustedPosition = index => {
    if (userParticipatingInCompetition || index < userPositionIndex) return index + 1
    if (index > userPositionIndex) return index
    return null
  }

  const getPositionToRender = index => {
    const position = getAdjustedPosition(index)
    switch (position) {
      case 1:
        return <Medal position="first" />
      case 2:
        return <Medal position="second" />
      case 3:
        return <Medal position="third" />
      default:
        return position
    }
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
          highlighted={index === userPositionIndex}
          position={getPositionToRender(index)}
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
