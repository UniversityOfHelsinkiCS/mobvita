import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'
import AppButton from 'Components/AppButton'
import { FormattedMessage } from 'react-intl'
import { AppMenuCloseContext } from 'Components/ui/AppMenu'

const ChatActionMenuSuggetions = ({ predefinedChatbotRequests, disabled, onClose }) => {
  const dispatch = useDispatch()
  const closeMenu = useContext(AppMenuCloseContext)

  return (
    <div
      className="chatbot-suggestions"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
    >
      {predefinedChatbotRequests.map(({ msgId, func }, index) => (
        <AppButton
          key={index}
          type="button"
          variant="contrast-outline"
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
        </AppButton>
      ))}
    </div>
  )
}

export default ChatActionMenuSuggetions
