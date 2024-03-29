import React from 'react'

const LeaderboardItem = ({ position, username, value, rankingHistory, highlighted = false }) => (
  <div
    className="leaderboard-item-container"
    style={highlighted ? { backgroundColor: '#32AAF8', color: '#000' } : {}}
  >
    <div className="flex" style={{ maxWidth: '75%' }}>
      <div className="justify-center" style={{ width: '2.5rem', fontSize: '1.1rem' }}>
        {position}
      </div>
      <div
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          paddingTop: '0.1rem',
          paddingLeft: '1rem',
        }}
      >
        {username}
      </div>
      <div className="flex">
        {rankingHistory['0'] && (
          <div className="leaderboard-reward position-gold">{rankingHistory['0']}</div>
        )}
        {rankingHistory['1'] && (
          <div className="leaderboard-reward position-silver">{rankingHistory['1']}</div>
        )}
        {rankingHistory['2'] && (
          <div className="leaderboard-reward position-bronze">{rankingHistory['2']}</div>
        )}
      </div>
    </div>
    <span
      style={{
        fontWeight: 400,
        fontSize: '1.1rem',
        color: highlighted ? '#000' : '#000',
        paddingRight: '.75rem',
      }}
    >
      {value}
    </span>
  </div>
)

export default LeaderboardItem
