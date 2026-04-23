import React from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { useIntl, FormattedMessage } from 'react-intl'

const ChatActionMenuSuggetions = ({ predefinedChatbotRequests, disabled, onClose }) => {
  const intl = useIntl()
  const dispatch = useDispatch()


  return (
    <div className="chatbot-suggestions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {predefinedChatbotRequests.map(({ msgId, func }, index) => (
        <Button
          key={index}
          type="button"
          basic
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation() 
            if (func) dispatch(func)
            if (onClose) onClose() 
          }}
        >
          <FormattedMessage id={msgId} />
        </Button>
      ))}
    </div>
  )
}

export default ChatActionMenuSuggetions