import React, { useState } from 'react'
import { Form } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { updatePassword } from 'Utilities/redux/userReducer'


export default function Settings() {
  const intl = useIntl()
  const dispatch = useDispatch()

  const [settings, setSettings] = useState({
    password: null,
    passwordAgain: null,
    passwordError: null,
  })

  const saveSettings = () => {
    const { password, passwordAgain } = settings
    if (password === passwordAgain) {
      dispatch(updatePassword(password))
      setSettings({
        ...settings,
        passwordError: null,
        password: null,
        passwordAgain: null,
      })
    } else {
      setSettings({
        ...settings,
        passwordError: intl.formatMessage({ id: 'passwords-do-not-match' }),
      })
    }
  }

  const handleSettingChange = (e) => {
    const { name, value } = e.target

    setSettings({
      ...settings,
      [name]: value,
    })
  }

  const { password, passwordAgain, passwordError } = settings

  return (
    <div className="component-container">

      <h2>{intl.formatMessage({ id: 'reset-password' })}</h2>

      <Form onSubmit={saveSettings}>
        <Form.Field>
          <Form.Input
            label={intl.formatMessage({ id: 'new-password' })}
            type="password"
            name="password"
            value={password}
            onChange={handleSettingChange}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            label={intl.formatMessage({ id: 'repeat-password' })}
            type="password"
            name="passwordAgain"
            value={passwordAgain}
            onChange={handleSettingChange}
          />
        </Form.Field>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}

          <Button
            variant="primary"
            data-cy="reset-password"
            type="submit"
          >
            {intl.formatMessage({ id: 'Save' })}
          </Button>
        </div>
      </Form>


    </div>
  )
}
