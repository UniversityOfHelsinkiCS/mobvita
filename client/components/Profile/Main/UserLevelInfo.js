import React from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

export const XpBar = () => {
  const user = useSelector(state => state.user.data.user)
  const { level, xp_to_next_level } = user

  const requiredXpToNextLevel = (((level + 1) * 50 - 25) ** 2 - 625) / 100
  const currentLevelXp = requiredXpToNextLevel - xp_to_next_level
  const progressPercentage = (currentLevelXp / requiredXpToNextLevel).toFixed(2)

  return (
    <div>
      <br />
      <div className="xp-wrapper">
        <div
          className="progress-bar progress-bar-striped bg-info"
          style={{ width: `${progressPercentage * 100}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
      <div className="xp-gathered ps-lg">{`${currentLevelXp} / ${requiredXpToNextLevel}`}</div>
    </div>
  )
}

export const UserLevel = () => {
  const user = useSelector(state => state.user.data.user)
  const { level } = user
  return (
    <div>
      <div className="bold ps-lg" as="h2">
        <FormattedMessage id="level" />
      </div>
      <span className="account-info-item ps-lg">{level}</span>
    </div>
  )
}

export const UserLevelInfo = () => {
  return (
    <div className="ps-lg">
      <UserLevel />
      <XpBar />
    </div>
  )
}

export default UserLevelInfo
