import React from 'react'
import { useSelector } from 'react-redux'

const AccountInfo = () => {
  const { username, email } = useSelector(({ user }) => user.data.user)

  return (
    <div>
      <span className="bootstrap-label">Email</span>
      <p className="account-info-item">
        {email}
      </p>
      <span className="bootstrap-label">Username</span>
      <p className="account-info-item">
        {username}
      </p>
    </div>
  )
}

export default AccountInfo
