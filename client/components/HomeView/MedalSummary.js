import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Medal from 'Components/Achievements/Medal'

const MedalAmount = ({ medal, amount }) => (
  <div className="medal-wrapper">
    <div className="achievement-container">
      <div className="medal-title">{amount}</div>
      <div className="ps-sm pb-sm">
        <Medal medal={medal} />
      </div>
    </div>
  </div>
)

const MedalSummary = () => {
  const achievements = useSelector(state => state.user.data.user.achievements)

  if (!achievements) return null

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
    <Link to="/achievements" className="space-evenly ps-sm pt-nm pb-nm gap-col-sm">
      <MedalAmount medal="bronze" amount={medals.bronze} />
      <MedalAmount medal="silver" amount={medals.silver} />
      <MedalAmount medal="gold" amount={medals.gold} />
      <MedalAmount medal="platinum" amount={medals.platinum} />
      <MedalAmount medal="diamond" amount={medals.diamond} />
    </Link>
  )
}

export default MedalSummary
