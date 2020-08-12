import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Achievement from './Achievement'
import Medal from './Medal'

const MedalAmount = ({ amount, medal }) => (
  <div className="achievement-medal-amount">
    <span>{amount}x</span>
    <Medal medal={medal} />
  </div>
)

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
          if (level >= 4) tempObject.emerald++
          if (level >= 5) tempObject.diamond++
          return tempObject
        },
        {
          bronze: 0,
          silver: 0,
          gold: 0,
          emerald: 0,
          diamond: 0,
        }
      ),
    [achievements]
  )

  return (
    <div className="padding-sides-1 gap-row-2">
      <h2 className="header-3">Achievement medals</h2>
      <div className="achievement-medals">
        <MedalAmount amount={medals.bronze} medal="bronze" />
        <MedalAmount amount={medals.silver} medal="silver" />
        <MedalAmount amount={medals.gold} medal="gold" />
        <MedalAmount amount={medals.emerald} medal="emerald" />
        <MedalAmount amount={medals.diamond} medal="diamond" />
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
