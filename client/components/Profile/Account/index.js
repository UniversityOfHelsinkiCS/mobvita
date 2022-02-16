import React from 'react'
import { useCurrentUser } from 'Utilities/common'
import AccountInfo from './AccountInfo'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'

const Account = () => {
  const user = useCurrentUser()
  const isRegisteredUser = user.email !== 'anonymous_email'

  return (
    <div className="cont ps-nm">
      <AccountInfo />
      <hr />
      <ChangePassword />
      {isRegisteredUser && (
        <div>
          <hr />
          <DeleteAccount />
        </div>
      )}
    </div>
  )
}

export default Account
