import React from 'react'
import { styled } from '@mui/material/styles'
import { colors, font } from 'Assets/mui_theme/designTokens'
import { images } from 'Utilities/common'

/**
 * ChatInput — the pill text field + circular send button shared by the chatbots.
 *
 * Controlled: pass `value` / `onChange(value)` and `onSubmit()` (fired on Enter or the send button).
 * `disabled` blocks typing and sending (e.g. while awaiting a reply).
 */
const Form = styled('form')({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
})

// Resting/empty border is soft; it firms up (and the field brightens) once the user is typing.
const SOFT_BORDER = '#D3E2D9'

const Field = styled('input')({
  flex: 1,
  minWidth: 0,
  height: 44,
  padding: '0 20px',
  borderRadius: 999,
  border: `1px solid ${SOFT_BORDER}`,
  backgroundColor: '#FFFFFF',
  fontFamily: font.family,
  fontSize: 15,
  color: colors.ink,
  outline: 'none',
  transition: 'border-color 0.15s ease, background-color 0.15s ease',
  '&::placeholder': { color: colors.muted },
  // "active": focused or holding text
  '&:focus': { borderColor: colors.green },
  '&:not(:placeholder-shown)': { borderColor: colors.green },
  '&:disabled': { backgroundColor: 'transparent', borderColor: SOFT_BORDER, cursor: 'not-allowed' },
})

// Bare button — the Circle SVG (active/disabled) is the whole circle+arrow icon.
const SendButton = styled('button')({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  '& img': { width: 36, height: 36, display: 'block' },
  '&:disabled': { cursor: 'not-allowed' },
})

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
  name = 'userInput',
  ...rest
}) => {
  const canSend = !disabled && !!value?.trim()

  const handleSubmit = event => {
    event.preventDefault()
    if (!canSend) return
    onSubmit()
  }

  return (
    <Form onSubmit={handleSubmit} {...rest}>
      <Field
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
      />
      <SendButton type="submit" aria-label="Send" disabled={!canSend}>
        <img src={canSend ? images.sendActive : images.sendInactive} alt="Send" />
      </SendButton>
    </Form>
  )
}

export default ChatInput
