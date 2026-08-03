import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { registerUser } from 'Utilities/redux/registerReducer'
import { getSelf } from 'Utilities//redux/userReducer'
import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import { setNotification } from 'Utilities/redux/notificationReducer'
import AppButton from 'Components/AppButton'
import { colors, font } from 'Assets/mui_theme/designTokens'
import SignUpForm from './SignUpForm'

/**
 * Register — connected container. Owns registration redux/effects and renders the pure
 * <SignUpForm>. `onSwitchToLogin` (optional) is the in-card link back to the login form.
 */
const Register = ({ onSwitchToLogin }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [formState, setFormState] = useState({
    email: '',
    username: '',
    password: '',
    passwordAgain: '',
  })
  const [accepted, setAccepted] = useState(false)

  const {
    error,
    message: errorMessage,
    pending: registerPending,
    accountCreated,
  } = useSelector(({ register }) => register)
  const userEmail = useSelector(({ user }) => user.data?.user?.email)

  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      dispatch(setNotification(errorMessage, 'error'))
    }
  }, [error])

  useEffect(() => {
    if (!registerPending && accountCreated && location.pathname.includes('register')) {
      dispatch(getSelf())
    }
  }, [accountCreated, dispatch, location.pathname, registerPending])

  useEffect(() => {
    if (location.pathname.includes('register') && userEmail !== 'anonymous_email') {
      navigate('/home')
    }
  }, [location.pathname, navigate, userEmail])

  const handleFieldChange = (name, value) => {
    setFormState({ ...formState, [name]: value })
  }

  const handleSubmit = () => {
    const { email, username, password, passwordAgain } = formState

    if (password !== passwordAgain) {
      dispatch(setNotification('passwords-do not-match', 'error'))
    } else if (accepted) {
      dispatch(
        registerUser({
          username,
          password,
          email,
          interface_language: undefined,
        }),
      )
    } else {
      dispatch(setNotification('you-must-accept-terms-and-conditions', 'error'))
    }
  }

  return (
    <SignUpForm
      email={formState.email}
      username={formState.username}
      password={formState.password}
      passwordAgain={formState.passwordAgain}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onSwitchToLogin={onSwitchToLogin}
      accepted={accepted}
      onAcceptedChange={setAccepted}
      termsTrigger={
        <TermsAndConditions
          trigger={
            <AppButton
              variant="link"
              sx={{
                p: 0,
                minWidth: 0,
                color: colors.ink,
                fontFamily: font.family,
                fontSize: '0.85rem',
                fontWeight: 500,
                textTransform: 'none',
                textDecoration: 'underline',
                '&:hover': { textDecoration: 'none', backgroundColor: 'transparent' },
              }}
            >
              <FormattedMessage id="i-accept-the-terms" />
            </AppButton>
          }
        />
      }
      error={error}
      errorMessage={errorMessage}
      pending={registerPending}
    />
  )
}

export default Register
