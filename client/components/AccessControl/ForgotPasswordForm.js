import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import AppTextField from 'Components/ui/AppTextField'
import AppButton from 'Components/AppButton'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'

/**
 * ForgotPasswordForm — presentational reset-request form (pure: props only). Built from the design
 * system primitives to match the login card. The container owns redux + open state.
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

const ForgotPasswordForm = ({ email, onEmailChange, onSubmit, pending }) => {
  const intl = useIntl()

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20, fontSize: '0.9rem', color: colors.ink }}>
        <FormattedMessage id="password-reset-instructions" />
      </div>
      <div style={{ marginBottom: 24 }}>
        <AppTextField
          label={intl.formatMessage({ id: 'Email' })}
          type="email"
          value={email}
          onChange={e => onEmailChange(e.target.value)}
          placeholder={intl.formatMessage({ id: 'Email' })}
        />
      </div>
      <AppButton type="submit" disabled={pending} sx={primaryButtonSx}>
        <FormattedMessage id="reset-my-password" />
      </AppButton>
    </form>
  )
}

export default ForgotPasswordForm
