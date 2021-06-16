import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Icon, Input, Button } from 'semantic-ui-react'
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
          <Icon
            onClick={() => setEditingUser(true)}
            name="edit"
            size="small"
            color="grey"
            style={{ marginLeft: '0.5em', cursor: 'pointer' }}
          />
        )}
      </div>
      {editingUser ? (
        <Input
          value={usernameValue}
          onChange={e => setUsernameValue(e.target.value)}
          label={
            <Button primary onClick={handleUsernameSave}>
              <FormattedMessage id="Save" />
            </Button>
          }
          labelPosition="right"
        />
      ) : (
        <p className="account-info-item">{usernameValue}</p>
      )}
    </div>
  )
}

export default AccountInfo
