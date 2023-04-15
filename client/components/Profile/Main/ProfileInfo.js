import React from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

const ProfileInfo = () => {
  const { username } = useSelector(({ user }) => user.data.user)
  return (
    <div>
      <div className="bold ps-lg" as="h2">
        <FormattedMessage id="username" />
      </div>
      <span className="account-info-item ps-lg">{username}</span>
    </div>
  )
}

export default ProfileInfo
