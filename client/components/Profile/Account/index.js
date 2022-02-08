import React from 'react'
import AccountInfo from './AccountInfo'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'

const Account = () => {
  return (
    <div className="cont ps-nm">
      <AccountInfo />
      <hr />
      <ChangePassword />
      <hr />
      <DeleteAccount />
    </div>
  )
}

export default Account
