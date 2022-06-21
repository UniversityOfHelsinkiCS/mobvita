import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { registerUser } from 'Utilities/redux/registerReducer'
import { getSelf } from 'Utilities//redux/userReducer'
import { Form, Checkbox } from 'semantic-ui-react'
import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import CERFLevelSlider from 'Components/CERFLevelSlider'
import { useIntl } from 'react-intl'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { localeCodeToName } from 'Utilities/common'
import { Button, Spinner } from 'react-bootstrap'

const Register = () => {
  const intl = useIntl()
  const history = useHistory()

  const [formState, setFormState] = useState({
    email: '',
    username: '',
    password: '',
    passwordAgain: '',
  })
  const [accepted, setAccepted] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)

  const toggleAccepted = () => {
    setAccepted(!accepted)
  }

  const {
    error,
    errorMessage,
    pending: registerPending,
    accountCreated,
  } = useSelector(({ register }) => register)
  const userEmail = useSelector(({ user }) => user.data?.user?.email)
  const locale = useSelector(({ locale }) => locale)

  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      dispatch(setNotification(errorMessage, 'error'))
    }
  }, [error])

  useEffect(() => {
    if (!registerPending && accountCreated && history.location.pathname.includes('register')) {
      dispatch(getSelf())
    }
  }, [registerPending])

  useEffect(() => {
    if (history.location.pathname.includes('register') && userEmail !== 'anonymous_email')
      history.push('/home')
  }, [userEmail])

  const handleSubmit = () => {
    const { email, username, password, passwordAgain } = formState

    if (password !== passwordAgain) {
      dispatch(setNotification('passwords-do-not-match', 'error'))
    } else if (accepted) {
      const payload = {
        username,
        password,
        email,
        interface_language: localeCodeToName(locale),
      }

      dispatch(registerUser(payload))
    } else {
      dispatch(setNotification('you-must-accept-terms-and-conditions', 'error'))
    }

    // TODO: Check email and password validity
  }

  const handleFormChange = e => {
    const { name, value } = e.target

    setFormState({
      ...formState,
      [name]: value,
    })
  }
  return (
    <div className="login-form">
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <Form.Input
            name="email"
            error={error}
            type="email"
            value={formState.email}
            onChange={e => handleFormChange(e)}
            placeholder={intl.formatMessage({ id: 'Email' })}
          />
          <Form.Input
            name="username"
            error={error}
            type="username"
            value={formState.username}
            onChange={e => handleFormChange(e)}
            placeholder={intl.formatMessage({ id: 'Username' })}
          />
          <Form.Input
            name="password"
            error={error}
            type="password"
            value={formState.password}
            onChange={e => handleFormChange(e)}
            placeholder={intl.formatMessage({ id: 'Password' })}
          />
          <Form.Input
            name="passwordAgain"
            error={error}
            type="password"
            value={formState.passwordAgain}
            onChange={e => handleFormChange(e)}
            placeholder={intl.formatMessage({ id: 'repeat-password' })}
          />
        </Form.Field>
        <CERFLevelSlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox data-cy="accept-terms" checked={accepted} onChange={() => toggleAccepted()} />
          <TermsAndConditions
            trigger={<Button variant="link"> Terms and Conditions, Privacy Policy </Button>}
          />
        </div>
        <div>
          <button type="submit" className="landing-page-button" disabled={registerPending}>
            {registerPending ? (
              <Spinner animation="border" variant="info" size="sm" />
            ) : (
              <span>{intl.formatMessage({ id: 'Register' })}</span>
            )}
          </button>
        </div>
      </Form>
    </div>
  )
}

export default Register
