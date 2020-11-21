import React from 'react'
import AccountInfo from './AccountInfo'
import ChangePassword from './ChangePassword'

const Account = () => {
  return (
    <div className="cont ps-nm">
      <AccountInfo />
      <hr />
      <ChangePassword />
    </div>
  )
}

export default Account
