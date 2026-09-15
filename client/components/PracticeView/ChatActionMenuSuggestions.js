import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { AppMenuCloseContext } from 'Components/ui/AppMenu'
import { PredefinedRequestButton } from 'Components/ui/ChatInput'

const ChatActionMenuSuggetions = ({ predefinedChatbotRequests, disabled, onClose }) => {
  const dispatch = useDispatch()
  const closeMenu = useContext(AppMenuCloseContext)

  return (
    <div
      className="chatbot-suggestions"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
    >
      {predefinedChatbotRequests.map(({ msgId, func }, index) => (
        <PredefinedRequestButton
          key={index}
          type="button"
          disabled={disabled}
          data-cy={`chatbot-suggestion-${msgId}`}
          onClick={e => {
            e.stopPropagation()
            if (func) dispatch(func)
            if (onClose) onClose()
            if (closeMenu) closeMenu()
          }}
        >
          <FormattedMessage id={msgId} />
        </PredefinedRequestButton>
      ))}
    </div>
  )
}

export default ChatActionMenuSuggetions
