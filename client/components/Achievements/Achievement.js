import React from 'react'
import { ProgressBar } from 'react-bootstrap'
import Medal from './Medal'

const Achievement = ({ name, level, current, total }) => {
  const progressPercentage = (current / total) * 100
  const progressLabel = level === 5 ? Math.floor(current) : `${Math.floor(current)}/${total}`

  const medalAchieved = medalLevel => medalLevel <= level

  const wrapperExtraStyle =
    level === 5
      ? {
          borderColor: level === 5 && '#28a745',
          color: level === 5 && '#28a745',
          boxShadow: 'inset 0 0 5px #43d163',
        }
      : {}

  return (
    <div>
      <div className="achievement-wrapper" style={wrapperExtraStyle}>
        <div className="achievement-container">
          <div className="achievement-title">{name}</div>
          <div className="achievement-content">
            <div className="space-between pb-nm pt-sm">
              <Medal medal={medalAchieved(1) && 'bronze'} />
              <Medal medal={medalAchieved(2) && 'silver'} />
              <Medal medal={medalAchieved(3) && 'gold'} />
              <Medal medal={medalAchieved(4) && 'platinum'} />
              <Medal medal={medalAchieved(5) && 'diamond'} />
            </div>
            <ProgressBar
              now={progressPercentage}
              label={<span>{progressLabel}</span>}
              className="achievement-progress"
              variant={level === 5 && 'success'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Achievement
