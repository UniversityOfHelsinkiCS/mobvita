import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import Checkbox from '@mui/material/Checkbox'
import AppTextField from 'Components/ui/AppTextField'
import AppButton from 'Components/AppButton'
import Spinner from 'Components/Spinner'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'

/**
 * LoginForm — presentational login card (2026 auth design).
 *
 * Pure: no redux, no navigation, no side effects. Every value/callback arrives as a prop, so it
 * renders in isolation on /design. The connected container (Login.js) owns redux, effects, modals,
 * and provides `onSwitchToSignUp` (the in-card link). i18n is allowed (IntlProvider is global).
 */
const primaryButtonSx = {
  backgroundColor: colors.green,
  color: colors.ink,
  borderRadius: `${shape.buttonRadius}px`,
  fontFamily: font.family,
  fontSize: font.button,
  fontWeight: 500,
  textTransform: 'none',
  boxShadow: 'none',
  padding: '6px 24px',
  '&:hover': { backgroundColor: colors.greenHover, boxShadow: 'none' },
  '&.Mui-disabled': { backgroundColor: colors.green, opacity: 0.5, color: colors.ink },
}

const ghostButtonSx = {
  backgroundColor: colors.card,
  color: colors.ink,
  border: `1px solid ${colors.green}`,
  borderRadius: `${shape.buttonRadius}px`,
  fontFamily: font.family,
  fontSize: font.button,
  fontWeight: 500,
  textTransform: 'none',
  boxShadow: 'none',
  padding: '6px 24px',
  '&:hover': { backgroundColor: colors.green, boxShadow: 'none' },
}

const linkStyle = {
  color: colors.ink,
  fontFamily: font.family,
  fontSize: '0.85rem',
  fontWeight: 500,
  textDecoration: 'underline',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
}

const LoginForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
  onSwitchToSignUp,
  onTryRevita,
  rememberMe = false,
  onRememberMeChange,
  error = false,
  errorMessage,
  pending = false,
}) => {
  const intl = useIntl()

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div style={{ fontFamily: font.family, color: colors.ink }}>
      <h1 style={{ fontFamily: font.family, fontSize: font.title, fontWeight: 400, margin: 0 }}>
        <FormattedMessage id="Login" />
      </h1>
      <div style={{ fontSize: '0.85rem', color: colors.ink, margin: '0.35em 0 1.5em' }}>
        <FormattedMessage id="dont-have-an-account" />{' '}
        {onSwitchToSignUp && (
          <button type="button" style={linkStyle} onClick={onSwitchToSignUp} data-cy="to-signup">
            <FormattedMessage id="landing-page-sign-up" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: shape.fieldGap }}>
          <AppTextField
            label={intl.formatMessage({ id: 'Email' })}
            type="email"
            error={error}
            value={email}
            onChange={e => onEmailChange(e.target.value)}
            placeholder={intl.formatMessage({ id: 'email-address' })}
            inputProps={{ 'data-cy': 'login-email' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <AppTextField
            label={intl.formatMessage({ id: 'Password' })}
            type="password"
            error={error}
            value={password}
            onChange={e => onPasswordChange(e.target.value)}
            placeholder={intl.formatMessage({ id: 'Password' })}
            inputProps={{ 'data-cy': 'login-password' }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5em',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <Checkbox
              size="small"
              checked={rememberMe}
              onChange={e => onRememberMeChange && onRememberMeChange(e.target.checked)}
              sx={{ p: 0, mr: 1, color: colors.green, '&.Mui-checked': { color: colors.green } }}
            />
            <FormattedMessage id="remember-me" />
          </label>
          <button type="button" style={linkStyle} onClick={onForgotPassword}>
            <FormattedMessage id="forgot-password" />
          </button>
        </div>

        {error && errorMessage && (
          <div style={{ color: colors.error, fontSize: '0.85rem', marginBottom: '1em' }}>
            {errorMessage}
          </div>
        )}

        <AppButton data-cy="login" type="submit" disabled={pending} fullWidth sx={primaryButtonSx}>
          {pending ? <Spinner inline /> : <FormattedMessage id="Login" />}
        </AppButton>
      </form>

      {onTryRevita && (
        <AppButton fullWidth onClick={onTryRevita} sx={{ ...ghostButtonSx, marginTop: '12px' }}>
          <FormattedMessage id="try-revita" />
        </AppButton>
      )}
    </div>
  )
}

export default LoginForm
