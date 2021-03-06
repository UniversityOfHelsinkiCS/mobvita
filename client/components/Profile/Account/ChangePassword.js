import React, { useState } from 'react'
import { Form } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import { changePassword } from 'Utilities/redux/userReducer'
import { useCurrentUser } from 'Utilities/common'

export default function ChangePassword() {
  const intl = useIntl()
  const dispatch = useDispatch()
  const user = useCurrentUser()
  const isAnonymousUser = user.email === 'anonymous_email'

  const [settings, setSettings] = useState({
    newPassword: '',
    newPasswordAgain: '',
    passwordError: false,
    currentPassword: '',
  })

  const saveSettings = () => {
    const { newPassword, newPasswordAgain, currentPassword } = settings
    if (newPassword && currentPassword && newPassword === newPasswordAgain) {
      dispatch(changePassword(currentPassword, newPassword))
      setSettings({
        newPassword: '',
        newPasswordAgain: '',
        currentPassword: '',
        passwordError: false,
      })
    } else {
      setSettings({
        ...settings,
        passwordError: true,
      })
    }
  }

  const handleSettingChange = e => {
    const { name, value } = e.target

    setSettings({
      ...settings,
      [name]: value,
    })
  }

  const { newPassword, newPasswordAgain, currentPassword, passwordError } = settings

  return (
    <div>
      <div>
        <h2 className="header-2 pb-sm">{intl.formatMessage({ id: 'reset-password' })}</h2>

        <Form onSubmit={saveSettings}>
          <Form.Field>
            <Form.Input
              label={`${intl.formatMessage({ id: 'current-password' })}:`}
              type="password"
              name="currentPassword"
              value={currentPassword}
              error={passwordError}
              onChange={handleSettingChange}
            />
            <hr />
            <Form.Field>
              <Form.Input
                label={`${intl.formatMessage({ id: 'new-password' })}:`}
                type="password"
                name="newPassword"
                value={newPassword}
                error={passwordError}
                onChange={handleSettingChange}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                label={`${intl.formatMessage({ id: 'repeat-password' })}:`}
                type="password"
                name="newPasswordAgain"
                value={newPasswordAgain}
                error={passwordError}
                onChange={handleSettingChange}
              />
            </Form.Field>
          </Form.Field>
          {!isAnonymousUser && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Button variant="primary" data-cy="reset-password" type="submit">
                {intl.formatMessage({ id: 'Save' })}
              </Button>
            </div>
          )}
          {isAnonymousUser && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Button variant="secondary" data-cy="reset-password" type="submit" disabled>
                  {intl.formatMessage({ id: 'Save' })}
                </Button>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <FormattedMessage id="pw-reset-for-registered-users-only" />
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
