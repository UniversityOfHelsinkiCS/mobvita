import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { hiddenFeatures } from 'Utilities/common'
import Medal from 'Components/Achievements/Medal'

const MedalAmount = ({ medal, amount }) => (
  <div className="medal-wrapper">
    <div className="achievement-container">
      <div className="medal-title">{amount}</div>
      <div className="padding-sides-1 padding-bottom-1">
        <Medal medal={medal} />
      </div>
    </div>
  </div>
)

const MedalSummary = () => {
  const achievements = useSelector(state => state.user.data.user.achievements)

  if (!hiddenFeatures || !achievements) return null

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
    <Link to="/achievements">
      <div className="space-evenly gap-1 padding-sides-1 padding-top-2 padding-bottom-2">
        <MedalAmount medal="bronze" amount={medals.bronze} />
        <MedalAmount medal="silver" amount={medals.silver} />
        <MedalAmount medal="gold" amount={medals.gold} />
        <MedalAmount medal="emerald" amount={medals.emerald} />
        <MedalAmount medal="diamond" amount={medals.diamond} />
      </div>
    </Link>
  )
}

export default MedalSummary
