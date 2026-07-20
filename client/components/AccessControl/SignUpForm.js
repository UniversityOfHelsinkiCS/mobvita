import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import Checkbox from '@mui/material/Checkbox'
import AppTextField from 'Components/ui/AppTextField'
import AppButton from 'Components/AppButton'
import Spinner from 'Components/Spinner'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'

/**
 * SignUpForm — presentational sign-up card (2026 auth design).
 *
 * Pure: props only, no redux/navigation. The container (Register.js) owns registration logic and
 * provides `onSwitchToLogin` (the in-card link). Mirrors LoginForm's styling.
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

const SignUpForm = ({
  email,
  username,
  password,
  passwordAgain,
  onFieldChange, // (name, value)
  onSubmit,
  onSwitchToLogin,
  accepted = false,
  onAcceptedChange,
  termsTrigger, // node: the Terms & Conditions link/modal trigger
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
        <FormattedMessage id="landing-page-sign-up" />
      </h1>
      <div style={{ fontSize: '0.85rem', color: colors.ink, margin: '0.35em 0 1.5em' }}>
        <FormattedMessage id="already-have-an-account" />{' '}
        {onSwitchToLogin && (
          <button type="button" style={linkStyle} onClick={onSwitchToLogin} data-cy="to-login">
            <FormattedMessage id="Login" />
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
            onChange={e => onFieldChange('email', e.target.value)}
            placeholder={intl.formatMessage({ id: 'email-address' })}
            inputProps={{ 'data-cy': 'signup-email' }}
          />
        </div>
        <div style={{ marginBottom: shape.fieldGap }}>
          <AppTextField
            label={intl.formatMessage({ id: 'Username' })}
            error={error}
            value={username}
            onChange={e => onFieldChange('username', e.target.value)}
            placeholder={intl.formatMessage({ id: 'Username' })}
            inputProps={{ 'data-cy': 'signup-username' }}
          />
        </div>
        <div style={{ marginBottom: shape.fieldGap }}>
          <AppTextField
            label={intl.formatMessage({ id: 'Password' })}
            type="password"
            error={error}
            value={password}
            onChange={e => onFieldChange('password', e.target.value)}
            placeholder={intl.formatMessage({ id: 'Password' })}
            inputProps={{ 'data-cy': 'signup-password' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <AppTextField
            label={intl.formatMessage({ id: 'repeat-password' })}
            type="password"
            error={error}
            value={passwordAgain}
            onChange={e => onFieldChange('passwordAgain', e.target.value)}
            placeholder={intl.formatMessage({ id: 'repeat-password' })}
            inputProps={{ 'data-cy': 'signup-password-again' }}
          />
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.85rem',
            marginBottom: '1.5em',
          }}
        >
          <Checkbox
            size="small"
            checked={accepted}
            onChange={e => onAcceptedChange && onAcceptedChange(e.target.checked)}
            data-cy="accept-terms"
            sx={{ p: 0, mr: 1, color: colors.green, '&.Mui-checked': { color: colors.green } }}
          />
          {termsTrigger || <FormattedMessage id="i-accept-the-terms" />}
        </label>

        {error && errorMessage && (
          <div style={{ color: colors.error, fontSize: '0.85rem', marginBottom: '1em' }}>
            {errorMessage}
          </div>
        )}

        <AppButton
          data-cy="register"
          type="submit"
          disabled={pending || !accepted}
          fullWidth
          sx={primaryButtonSx}
        >
          {pending ? <Spinner inline /> : <FormattedMessage id="landing-page-sign-up" />}
        </AppButton>
      </form>
    </div>
  )
}

export default SignUpForm
