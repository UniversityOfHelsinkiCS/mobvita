import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useCurrentUser, images } from 'Utilities/common'
import LeaderboardItem from './LeaderboardItem'
import PlaceholderItem from './PlaceholderItem'

const Medal = ({ position }) => (
  <img src={images[`${position}Medal`]} alt={`${position} position medal`} height="24px" />
)

const LeaderboardList = ({ amountToShow }) => {
  const {
    leaderboard,
    user_rank: userPositionIndex,
    user_record: userRecord,
    user_history: userRankingHistory,
  } = useSelector(({ leaderboard }) => leaderboard.data)
  const user = useCurrentUser()
  const userParticipatingInCompetition = user.publish_progress

  const filteredLeaderboard = useMemo(
    () =>
      leaderboard
        ?.filter(item => item.weekly_time_spent !== 0)
        .splice(0, amountToShow)
        .map(item => ({
          hoursPracticed: Math.floor(item.weekly_time_spent * 10) / 10,
          rankingHistory: item.leaderboard_history,
          ...item,
        })),
    [leaderboard]
  )

  const getAdjustedPosition = index => {
    if (userParticipatingInCompetition || index < userPositionIndex) return index + 1
    if (index > userPositionIndex) return index
    return null
  }

  const toRender = position => {
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

  const getPositionToRender = index => {
    const position = getAdjustedPosition(index)
    return toRender(position)
  }

  if (!leaderboard)
    return (
      <div>
        {Array(amountToShow)
          .fill()
          .map((_, i) => i + 1)
          .map(position => (
            <PlaceholderItem key={position} position={toRender(position)} />
          ))}
      </div>
    )

  const userInTopPositions = userPositionIndex < filteredLeaderboard.length

  return (
    <div>
      {filteredLeaderboard.map(({ userId, username, hoursPracticed, rankingHistory }, index) => (
        <LeaderboardItem
          key={userId || username}
          username={username}
          value={`${hoursPracticed}h`}
          highlighted={index === userPositionIndex}
          position={getPositionToRender(index)}
          rankingHistory={rankingHistory}
        />
      ))}
      {!userInTopPositions && (
        <div>
          <div className="leaderboard-item-container justify-center">
            <span>&bull;&bull;&bull;</span>
          </div>
          <LeaderboardItem
            position={userPositionIndex + 1}
            username={user.username}
            value={`${Math.floor(userRecord * 10) / 10}h`}
            highlighted
            rankingHistory={userRankingHistory}
          />
        </div>
      )}
    </div>
  )
}

export default LeaderboardList
