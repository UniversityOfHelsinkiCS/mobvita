import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Skeleton } from '@mui/material'
import { images } from 'Utilities/common'

const PLACE_TROPHY = { first: images.place1, second: images.place2, third: images.place3 }

const Winner = ({ position, name, record, rankingHistory }) => {
  const first = position === 'first'

  const getMedalAmount = medalPosition => {
    if (!name) return null
    return rankingHistory[medalPosition - 1] || 0
  }

  return (
    <div className="leaderboard-winner">
      {/* Width-based so the trophies scale down to fit the narrow home summary card as well as
          the wider /leaderboard page. #1 is larger than #2/#3. */}
      <img
        src={PLACE_TROPHY[position]}
        alt={`${position} place trophy`}
        style={{ width: '100%', maxWidth: first ? '104px' : '82px', height: 'auto' }}
      />
      {name ? (
        <div className="flex-col align-center">
          <div className="leaderboard-winner-rewards">
            <div className="leaderboard-reward position-silver">{getMedalAmount(2)}</div>
            <div className="leaderboard-reward position-gold">{getMedalAmount(1)}</div>
            <div className="leaderboard-reward position-bronze">{getMedalAmount(3)}</div>
          </div>
          <span className="leaderboard-winner-name">{name}</span>
          <span className="leaderboard-winner-record">{record}</span>
        </div>
      ) : (
        <div className="flex-col align-center">
          <Skeleton variant="text" sx={{ minWidth: '5rem', mt: '.5rem' }} />
          <Skeleton variant="text" sx={{ minWidth: '2rem' }} />
        </div>
      )}
    </div>
  )
}

const LastWeeksWinners = () => {
  const previousLeaderboard = useSelector(
    ({ leaderboard }) => leaderboard?.data?.previous_leaderboard
  )

  const lastWeeksWinners = useMemo(
    () =>
      previousLeaderboard?.slice(0, 3).map(winner => ({
        username: winner.username,
        record: `${Math.floor(winner.weekly_time_spent * 10) / 10}h`,
        rankingHistory: winner.leaderboard_history,
      })),
    [previousLeaderboard]
  )

  return (
    <div className="pt-nm pb-nm">
      <div className="leaderboard-winner-container">
        <Winner
          position="second"
          name={lastWeeksWinners && lastWeeksWinners[1]?.username}
          record={lastWeeksWinners && lastWeeksWinners[1]?.record}
          rankingHistory={lastWeeksWinners && lastWeeksWinners[1]?.rankingHistory}
        />
        <Winner
          position="first"
          name={lastWeeksWinners && lastWeeksWinners[0]?.username}
          record={lastWeeksWinners && lastWeeksWinners[0]?.record}
          rankingHistory={lastWeeksWinners && lastWeeksWinners[0]?.rankingHistory}
        />
        <Winner
          position="third"
          name={lastWeeksWinners && lastWeeksWinners[2]?.username}
          record={lastWeeksWinners && lastWeeksWinners[2]?.record}
          rankingHistory={lastWeeksWinners && lastWeeksWinners[2]?.rankingHistory}
        />
      </div>
    </div>
  )
}

export default LastWeeksWinners
