import React from 'react'
import AppTextField from 'Components/ui/AppTextField'
import AppButton from 'Components/AppButton'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'

/**
 * ContactForm — presentational contact form (pure: props only, no redux). Built from the design
 * system primitives so it matches the login card. The container (ContactUs) owns state + redux.
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

const field = { marginBottom: 20 }

const ContactForm = ({
  name,
  email,
  subject,
  message,
  onFieldChange,
  onSubmit,
  error,
  pending,
}) => {
  const handleSubmit = e => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={field}>
        <AppTextField
          label="Name"
          value={name}
          onChange={e => onFieldChange('name', e.target.value)}
          placeholder="Name"
        />
      </div>
      <div style={field}>
        <AppTextField
          label="Subject"
          value={subject}
          onChange={e => onFieldChange('subject', e.target.value)}
          placeholder="Subject"
        />
      </div>
      <div style={field}>
        <AppTextField
          label="Email"
          type="email"
          value={email}
          onChange={e => onFieldChange('email', e.target.value)}
          placeholder="Email"
        />
      </div>
      <div style={field}>
        <AppTextField
          label="Message"
          multiline
          minRows={4}
          value={message}
          onChange={e => onFieldChange('message', e.target.value)}
          placeholder="What can we help you with?"
        />
      </div>

      <AppButton type="submit" disabled={pending} sx={primaryButtonSx}>
        Submit
      </AppButton>
      {error && <div style={{ color: colors.error, marginTop: 8 }}>{error}</div>}
    </form>
  )
}

export default ContactForm
