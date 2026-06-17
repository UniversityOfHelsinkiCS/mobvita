import React from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { useIntl, FormattedMessage } from 'react-intl'

const ChatbotSuggestions = ({ predefinedChatbotRequests, disabled }) => {
  const intl = useIntl()
  const dispatch = useDispatch()


  return (
    <div className="chatbot-suggestions">
      {predefinedChatbotRequests.map(({ msgId, func }, index) => (
        <a
          className="chatbot-suggestion-message"
          key={index}
          type="button"
          basic
          disabled={disabled}
          onClick={() =>dispatch(func)}
        >
          <FormattedMessage id={msgId} />
        </a>
      ))}
    </div>
  )
}

export default ChatbotSuggestions
