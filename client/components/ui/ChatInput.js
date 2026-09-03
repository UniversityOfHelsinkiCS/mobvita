import React from 'react'
import { styled } from '@mui/material/styles'
import { colors } from 'Assets/mui_theme/designTokens'
import { images } from 'Utilities/common'
import AppMenu from './AppMenu'
import ChatActionMenuSuggestions from 'Components/PracticeView/ChatActionMenuSuggestions'

/**
 * ChatInput — the pill text field + circular send button shared by the chatbots.
 *
 * Controlled: pass `value` / `onChange(value)` and `onSubmit()`
 * (fired on Enter or the send button).
 * `disabled` blocks typing and sending (e.g. while awaiting a reply).
 */
const Form = styled('form')({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
})

// Resting/empty border is soft; it firms up (and the field brightens) once the user is typing.
const SOFT_BORDER = '#B1D3C2'

const Field = styled('input')({
  flex: 1,
  minWidth: 0,
  height: 36,
  padding: '9px 10px',
  borderRadius: 999,
  border: `2px solid ${SOFT_BORDER}`,
  backgroundColor: '#FFFFFF',
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

const SuggestionButton = styled('button')({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  '& img': { width: 24, height: 24, display: 'block' },
  '&:disabled': { cursor: 'not-allowed' },
})

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
  name = 'userInput',
  predefinedChatbotRequests,
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
      {predefinedChatbotRequests && (
        <AppMenu
          trigger={
            <SuggestionButton type="button" aria-label="Suggestion" disabled={disabled}>
              <img src={images.menu3} alt="Suggestion" />
            </SuggestionButton>
          }
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          disableScrollLock
        >
          <ChatActionMenuSuggestions predefinedChatbotRequests={predefinedChatbotRequests} />
        </AppMenu>
      )}
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
