import React from 'react'
import { useDispatch } from 'react-redux'
import AppButton from 'Components/AppButton'
import { useIntl, FormattedMessage } from 'react-intl'

const ChatActionMenuSuggetions = ({ predefinedChatbotRequests, disabled, onClose }) => {
  const intl = useIntl()
  const dispatch = useDispatch()


  return (
    <div className="chatbot-suggestions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {predefinedChatbotRequests.map(({ msgId, func }, index) => (
        <AppButton
          key={index}
          type="button"
          variant="contrast-outline"
          disabled={disabled}
          data-cy={`chatbot-suggestion-${msgId}`}
          onClick={(e) => {
            e.stopPropagation()
            if (func) dispatch(func)
            if (onClose) onClose()
          }}
        >
          <FormattedMessage id={msgId} />
        </AppButton>
      ))}
    </div>
  )
}

export default ChatActionMenuSuggetions
