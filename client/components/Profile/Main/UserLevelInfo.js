import React from 'react'
import { useSelector } from 'react-redux'

const XpBar = ({ user }) => {
  const { level, xp_to_next_level } = user

  const requiredXpToNextLevel = (((level + 1) * 50 - 25) ** 2 - 625) / 100
  const currentLevelXp = requiredXpToNextLevel - xp_to_next_level
  const progressPercentage = (currentLevelXp / requiredXpToNextLevel).toFixed(2)

  return (
    <div className="xp-wrapper">
      <div
        className="progress-bar progress-bar-striped bg-info"
        style={{ width: `${progressPercentage * 100}%` }}
        aria-valuenow={progressPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span>{`${currentLevelXp} / ${requiredXpToNextLevel}`}</span>
      </div>
    </div>
  )
}

const UserLevel = ({ user }) => {
  const { level } = user
  return (
    <div className="justify-center gap-col-nm">
      <div className="bold" as="h2">
        {' '}
        Level{' '}
      </div>
      <div className="level ps-lg">{level}</div>
    </div>
  )
}

const UserLevelInfo = () => {
  const user = useSelector(state => state.user.data.user)
  return (
    <div className="ps-lg">
      <UserLevel user={user} />
      <XpBar user={user} />
    </div>
  )
}

export default UserLevelInfo
