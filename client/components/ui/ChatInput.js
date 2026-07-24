import React from 'react'
import { styled } from '@mui/material/styles'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { colors, font } from 'Assets/mui_theme/designTokens'

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

const Field = styled('input')({
  flex: 1,
  minWidth: 0,
  height: 44,
  padding: '0 20px',
  borderRadius: 999,
  border: `1px solid ${colors.green}`,
  backgroundColor: '#FFFFFF',
  fontFamily: font.family,
  fontSize: 15,
  color: colors.ink,
  outline: 'none',
  '&::placeholder': { color: colors.muted },
  '&:focus': { borderColor: colors.focus },
  '&:disabled': { backgroundColor: 'transparent', cursor: 'not-allowed' },
})

const SendButton = styled('button')({
  flexShrink: 0,
  width: 40,
  height: 40,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  border: `1px solid ${colors.green}`,
  backgroundColor: 'transparent',
  color: colors.ink,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, color 0.15s ease',
  '& svg': { fontSize: 20 },
  '&:hover:not(:disabled)': { backgroundColor: colors.green },
  '&:disabled': { color: colors.muted, borderColor: '#D9D6C9', cursor: 'not-allowed' },
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
  const handleSubmit = event => {
    event.preventDefault()
    if (disabled || !value?.trim()) return
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
      <SendButton type="submit" aria-label="Send" disabled={disabled || !value?.trim()}>
        <ArrowUpwardIcon />
      </SendButton>
    </Form>
  )
}

export default ChatInput
