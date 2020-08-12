import React from 'react'
import { ProgressBar } from 'react-bootstrap'
import Medal from './Medal'

const Achievement = ({ name, level, current, total }) => {
  const progressPercentage = (current / total) * 100
  const progressLabel = `${Math.floor(current)}/${total}`

  const medalAchieved = (medalLevel) => medalLevel <= level

  return (
    <div>
      <div className="achievement-wrapper">
        <div className="achievement-container">
          <div className="achievement-title">{name}</div>
          <div className="achievement-content">
            <div className="space-between padding-bottom-2 padding-top-1">
              <Medal medal={medalAchieved(1) && 'bronze'} />
              <Medal medal={medalAchieved(2) && 'silver'} />
              <Medal medal={medalAchieved(3) && 'gold'} />
              <Medal medal={medalAchieved(4) && 'emerald'} />
              <Medal medal={medalAchieved(5) && 'diamond'} />
            </div>
            <ProgressBar now={progressPercentage} label={progressLabel} style={{ height: '1.5rem' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Achievement
