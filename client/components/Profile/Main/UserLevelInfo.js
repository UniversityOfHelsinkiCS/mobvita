import React from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import AppProgressBar from 'Components/ui/AppProgressBar'

export const XpBar = () => {
  const user = useSelector(state => state.user.data.user)
  const { level, xp_to_next_level } = user

  const requiredXpToNextLevel = (((level + 1) * 50 - 25) ** 2 - 625) / 100
  const currentLevelXp = requiredXpToNextLevel - xp_to_next_level
  const progressPercentage = (currentLevelXp / requiredXpToNextLevel).toFixed(2)

  return (
    <div>
      <div className="bold" as="h2">XP</div>
      <AppProgressBar value={progressPercentage * 100} />
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
