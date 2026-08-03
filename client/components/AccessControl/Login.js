import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createRealToken } from 'Utilities/redux/userReducer'
import { useNavigate, useLocation } from 'react-router-dom'
import { localeCodeToName } from 'Utilities/common'
import LoginForm from './LoginForm'
import ForgotPassword from './ForgotPassword'
import InterfaceLanguageView from '../LanguageSelectView/InterfaceLanguageView'

/**
 * Login — connected container. Owns all redux/navigation/effects and the auxiliary modals, and
 * renders the pure <LoginForm> for the markup. Keep this file free of presentational concerns.
 */
const Login = ({ onSwitchToSignUp, onTryRevita }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false) // visual only for now — see redesign notes
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [showLangModal, setShowLangModal] = useState(false)

  const loginError = useSelector(({ user }) => user.error)
  const errorMessage = useSelector(({ user }) => user.errorMessage)
  const { user, pending } = useSelector(({ user }) => user)
  const { locale, updated } = useSelector(({ locale }) => locale)

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const login = () => {
    dispatch(createRealToken(email, password, (updated && localeCodeToName(locale)) || null))
  }

  useEffect(() => {
    const { from } = location.state || { from: { pathname: '/' } }
    if (user) {
      if (!user.user.interfaceLanguage) {
        setShowLangModal(true)
      } else if (!user.user.last_used_language) {
        navigate('/learningLanguage', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    }
  }, [navigate, location.state, user])

  return (
    <>
      <LoginForm
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={login}
        onForgotPassword={() => setForgotPasswordOpen(true)}
        onSwitchToSignUp={onSwitchToSignUp}
        onTryRevita={onTryRevita}
        rememberMe={rememberMe}
        onRememberMeChange={setRememberMe}
        error={loginError}
        errorMessage={errorMessage}
        pending={pending}
      />
      <ForgotPassword isOpen={forgotPasswordOpen} setOpen={setForgotPasswordOpen} />

      {/* Interface Language Selection Modal */}
      {showLangModal && <InterfaceLanguageView setShowLangModal={setShowLangModal} />}
    </>
  )
}

export default Login
