import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import MedalInfo from './MedalInfo'

const Medals = () => {
  const achievements = useSelector(state =>
    state.user.data.user.achievements?.concat({
      name: 'Test achievement',
      level: 5,
      current: 102,
      total: 100,
    })
  )

  const medals = useMemo(
    () =>
      achievements?.reduce(
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
    <div className="achievement-medals gap-1 gap-row-1">
      <MedalInfo amount={medals.bronze} medal="bronze" />
      <MedalInfo amount={medals.silver} medal="silver" />
      <MedalInfo amount={medals.gold} medal="gold" />
      <MedalInfo amount={medals.emerald} medal="emerald" />
      <MedalInfo amount={medals.diamond} medal="diamond" />
    </div>
  )
}

export default Medals
