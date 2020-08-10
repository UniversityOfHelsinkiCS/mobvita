import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Achievement from './Achievement'

const Achievements = () => {
  const achievements = useSelector(state => state.user.data.user.achievements)

  const medals = useMemo(
    () =>
      achievements.reduce(
        (medalObject, achievement) => {
          const tempObject = medalObject
          const { level } = achievement
          if (level >= 1) tempObject.bronze++
          if (level >= 2) tempObject.silver++
          if (level >= 3) tempObject.gold++
          if (level >= 4) tempObject.platinum++
          if (level >= 5) tempObject.diamond++
          return tempObject
        },
        {
          bronze: 0,
          silver: 0,
          gold: 0,
          platinum: 0,
          diamond: 0,
        }
      ),
    [achievements]
  )

  return (
    <div className="padding-sides-1 gap-row-2">
      <div className="space-evenly padding-top-2">
        {medals.bronze}x
        <div className="achievement-circle" style={{ backgroundColor: '#cd7f32' }}></div>
        {medals.silver}x
        <div className="achievement-circle" style={{ backgroundColor: '#C0C0C0' }}></div>
        {medals.gold}x
        <div className="achievement-circle" style={{ backgroundColor: '#FFD700' }}></div>
        {medals.platinum}x
        <div className="achievement-circle" style={{ backgroundColor: '#e5e4e2' }}></div>
        {medals.diamond}x
        <div className="achievement-circle" style={{ backgroundColor: '#B9F2FF' }}></div>
      </div>
      {achievements.map(achievement => (
        <Achievement
          key={achievement.name}
          name={achievement.name}
          level={achievement.level}
          current={achievement.current}
          total={achievement.total}
        />
      ))}
    </div>
  )
}

export default Achievements
