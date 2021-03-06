import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import MedalInfo from './MedalInfo'

const Medals = () => {
  const achievements = useSelector(state => state.user.data.user.achievements)

  const medals = useMemo(
    () =>
      achievements?.reduce(
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
    <div className="achievement-medals gap-col-sm gap-row-sm">
      <MedalInfo amount={medals.bronze} medal="bronze" />
      <MedalInfo amount={medals.silver} medal="silver" />
      <MedalInfo amount={medals.gold} medal="gold" />
      <MedalInfo amount={medals.platinum} medal="platinum" />
      <MedalInfo amount={medals.diamond} medal="diamond" />
    </div>
  )
}

export default Medals
