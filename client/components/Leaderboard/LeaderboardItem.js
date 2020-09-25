import React from 'react'

const LeaderboardItem = ({ position, username, value, highlighted = false }) => (
  <div
    className="leaderboard-item-container"
    style={highlighted ? { backgroundColor: '#CEFFC9', color: '#2CB22C' } : {}}
  >
    <div className="flex">
      <div style={{ width: '2.5rem', fontSize: '1.1rem' }}>{position}</div>
      <div
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          paddingTop: '0.1rem',
        }}
      >
        {username}
      </div>
    </div>
    <span style={{ fontSize: '1.1rem', color: highlighted ? '#77DD77' : '#777' }}>{value}</span>
  </div>
)

export default LeaderboardItem
