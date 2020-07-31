import React from 'react'
import AccountInfo from './AccountInfo'
import ChangePassword from './ChangePassword'

const Account = () => {
  return (
    <div className="component-container padding-sides-2">
      <AccountInfo />
      <hr />
      <ChangePassword />
    </div>
  )
}

export default Account
