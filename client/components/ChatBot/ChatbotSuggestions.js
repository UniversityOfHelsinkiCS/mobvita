import React from 'react'
import { useDispatch } from 'react-redux'
import { styled } from '@mui/material/styles'
import { FormattedMessage } from 'react-intl'
import { colors, font } from 'Assets/mui_theme/designTokens'

const Pill = styled('button', {
  shouldForwardProp: prop => prop !== 'disabled',
})(({ disabled }) => ({
  alignSelf: 'flex-start',
  padding: '9px 18px',
  borderRadius: 999,
  border: 'none',
  backgroundColor: colors.green,
  color: colors.ink,
  fontFamily: font.family,
  fontWeight: 600,
  fontSize: 15,
  textAlign: 'left',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  transition: 'background-color 0.15s ease',
  '&:hover': { backgroundColor: disabled ? colors.green : colors.greenHover },
}))

const ChatbotSuggestions = ({ predefinedChatbotRequests, disabled }) => {
  const dispatch = useDispatch()

  return (
    <div className="chatbot-suggestions">
      {predefinedChatbotRequests.map(({ msgId, func }) => (
        <Pill
          key={msgId}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return
            dispatch(func)
          }}
        >
          <FormattedMessage id={msgId} />
        </Pill>
      ))}
    </div>
  )
}

export default ChatbotSuggestions
