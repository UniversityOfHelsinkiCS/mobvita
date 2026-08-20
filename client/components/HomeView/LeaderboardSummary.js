import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { colors } from 'Assets/mui_theme/designTokens'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import LeaderboardList from 'Components/LeaderboardView/LeaderboardList'
import LastWeeksWinners from 'Components/LeaderboardView/LastWeeksWinners'

const LeaderboardSummary = () => {
  const dispatch = useDispatch()

  const { leaderboard } = useSelector(({ leaderboard }) => leaderboard.data)

  useEffect(() => {
    if (!leaderboard) dispatch(getLeaderboards())
  }, [])

  return (
    <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
      <div
        style={{
          boxSizing: 'border-box',
          backgroundColor: colors.card,
          borderRadius: 30,
          padding: '24px 28px',
          color: colors.ink,
        }}
      >
        <LastWeeksWinners />
        <LeaderboardList amountToShow={3} />
      </div>
    </Link>
  )
}

export default LeaderboardSummary
