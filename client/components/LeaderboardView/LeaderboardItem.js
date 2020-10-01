import React from 'react'
import { images } from 'Utilities/common'

const LeaderboardPosition = ({ position }) => {
  if (position === 1)
    return <img src={images.firstMedal} alt="first position medal" height="24px" />
  if (position === 2)
    return <img src={images.secondMedal} alt="second position medal" height="24px" />
  if (position === 3)
    return <img src={images.thirdMedal} alt="third position medal" height="24px" />
  return position
}

const LeaderboardItem = ({ position, username, value, highlighted = false }) => (
  <div
    className="leaderboard-item-container"
    style={highlighted ? { backgroundColor: '#CEFFC9', color: '#2CB22C' } : {}}
  >
    <div className="flex" style={{ maxWidth: '75%' }}>
      <div className="center" style={{ width: '2.5rem', fontSize: '1.1rem' }}>
        <LeaderboardPosition position={position} />
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
    </div>
    <span
      style={{
        fontSize: '1.1rem',
        color: highlighted ? '#77DD77' : '#777',
        paddingRight: '.75rem',
      }}
    >
      {value}
    </span>
  </div>
)

export default LeaderboardItem
