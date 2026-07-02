import React from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'

const ChatbotSuggestions = ({ predefinedChatbotRequests, disabled }) => {
  const dispatch = useDispatch()


  return (
    <div className="chatbot-suggestions">
      {predefinedChatbotRequests.map(({ msgId, func }, index) => (
        <a
          className="chatbot-suggestion-message"
          key={index}
          role="button"
          aria-disabled={disabled}
          style={{
            pointerEvents: disabled ? 'none' : undefined,
            opacity: disabled ? 0.5 : undefined,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          onClick={() => {
            if (disabled) return
            dispatch(func)
          }}
        >
          <FormattedMessage id={msgId} />
        </a>
      ))}
    </div>
  )
}

export default ChatbotSuggestions
