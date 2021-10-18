import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import { Link } from 'react-router-dom'
import LeaderboardList from 'Components/LeaderboardView/LeaderboardList'
import LastWeeksWinners from 'Components/LeaderboardView/LastWeeksWinners'

const LeaderboardSummary = () => {
  const dispatch = useDispatch()

  const { leaderboard } = useSelector(({ leaderboard }) => leaderboard.data)

  useEffect(() => {
    if (!leaderboard) dispatch(getLeaderboards())
  }, [])

  return (
    <Link to="/leaderboard" style={{ color: '#212529', textDecoration: 'none' }}>
      <div className="homeview-item" style={{ padding: '1em .2em 0 .2em' }}>
        <LastWeeksWinners />
        <LeaderboardList amountToShow={3} />
      </div>
    </Link>
  )
}

export default LeaderboardSummary
