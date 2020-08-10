import React from 'react'
import { ProgressBar } from 'react-bootstrap'

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
              <div className="achievement-circle" style={{ backgroundColor: medalAchieved(1) ? '#cd7f32' : '' }}></div>
              <div className="achievement-circle" style={{ backgroundColor: medalAchieved(2) ? '#C0C0C0' : '' }}></div>
              <div className="achievement-circle" style={{ backgroundColor: medalAchieved(3) ? '#FFD700' : '' }}></div>
              <div className="achievement-circle" style={{ backgroundColor: medalAchieved(4) ? '#e5e4e2' : '' }}></div>
              <div className="achievement-circle" style={{ backgroundColor: medalAchieved(5) ? '#B9F2FF' : '' }}></div>
            </div>
            <ProgressBar now={progressPercentage} label={progressLabel} style={{ height: '1.5rem' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Achievement
