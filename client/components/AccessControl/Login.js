import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createRealToken } from 'Utilities/redux/userReducer'
import { Form } from 'semantic-ui-react'
import { useHistory, useLocation } from 'react-router'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from 'react-bootstrap'
import ForgotPassword from './ForgotPassword'
import InterfaceLanguageView from '../LanguageSelectView/InterfaceLanguageView'
import { localeCodeToName } from 'Utilities/common'
import Spinner from 'Components/Spinner'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [showLangModal, setShowLangModal] = useState(false)

  const loginError = useSelector(({ user }) => user.error)
  const errorMessage = useSelector(({ user }) => user.errorMessage)
  const { user, pending } = useSelector(({ user }) => user)
  const { locale, updated } = useSelector(({ locale }) => locale)

  const location = useLocation()
  const history = useHistory()
  const intl = useIntl()

  const dispatch = useDispatch()

  const login = () => {
    dispatch(createRealToken(email, password, updated && localeCodeToName(locale) || null))
  }

  useEffect(() => {
    const { from } = location.state || { from: { pathname: '/' } }
    if (user) {
      if (!user.user.interfaceLanguage) {
        setShowLangModal(true)
      } else if (!user.user.last_used_language) {
        history.replace('/learningLanguage')
      } else {
        history.replace(from)
      }
    }
  }, [user])

  return (
    <div className="login-form">
      <Form onSubmit={login}>
        <Form.Field>
          <Form.Input
            error={loginError}
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            placeholder={intl.formatMessage({ id: 'email-address' })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            error={loginError}
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder={intl.formatMessage({ id: 'Password' })}
          />
        </Form.Field>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <button data-cy="login" type="submit" className="landing-page-button" disabled={pending}>
            {pending ? (
              <Spinner inline />
            ) : (
              <span>{intl.formatMessage({ id: 'Login' })}</span>
            )}
          </button>
          {loginError && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
      </Form>
      <Button
        style={{ paddingLeft: '0px', marginTop: '1em' }}
        onClick={() => setForgotPasswordOpen(true)}
        variant="link"
      >
        <FormattedMessage id="forgot-password" />
      </Button>
      <ForgotPassword isOpen={forgotPasswordOpen} setOpen={setForgotPasswordOpen} />

      {/* Interface Language Selection Modal */}
      {showLangModal && <InterfaceLanguageView setShowLangModal={setShowLangModal} />}
    </div>
  )
}

export default Login
