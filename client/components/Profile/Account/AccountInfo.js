import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import EditOutlined from '@mui/icons-material/EditOutlined'
import AppButton from 'Components/AppButton'
import AppTextField from 'Components/ui/AppTextField'
import { updateUsername } from 'Utilities/redux/userReducer'

const AccountInfo = () => {
  const { username, email } = useSelector(({ user }) => user.data.user)

  const [editingUser, setEditingUser] = useState(false)
  const [usernameValue, setUsernameValue] = useState(username)

  const dispatch = useDispatch()

  const handleUsernameSave = () => {
    setEditingUser(false)
    dispatch(updateUsername(usernameValue))
  }

  return (
    <div>
      <span className="sm-label">
        <FormattedMessage id="Email" />:
      </span>
      <p className="account-info-item">{email}</p>
      <br />
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <span className="sm-label">
          <FormattedMessage id="username" />
          :&nbsp;
        </span>
        {!editingUser && (
          <EditOutlined
            onClick={() => setEditingUser(true)}
            sx={{ fontSize: 18, color: 'grey', marginLeft: '0.5em', cursor: 'pointer' }}
          />
        )}
      </div>
      {editingUser ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AppTextField
            value={usernameValue}
            onChange={e => setUsernameValue(e.target.value)}
          />
          <AppButton variant="primary" onClick={handleUsernameSave}>
            <FormattedMessage id="Save" />
          </AppButton>
        </div>
      ) : (
        <p className="account-info-item">{usernameValue}</p>
      )}
    </div>
  )
}

export default AccountInfo
