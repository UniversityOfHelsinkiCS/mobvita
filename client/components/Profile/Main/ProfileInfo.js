import React from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

const ProfileInfo = () => {
  const { username } = useSelector(({ user }) => user.data.user)
  return (
    <div>
      <div className="sm-label">
        <FormattedMessage id="username" />
      </div>
      <span className="account-info-item">
        {username}
      </span>
    </div>
  )
}

export default ProfileInfo