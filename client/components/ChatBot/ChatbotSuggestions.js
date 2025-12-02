import React from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { useIntl, FormattedMessage } from 'react-intl'

const ChatbotSuggestions = ({ isWaitingForResponse, predefinedChatbotRequests }) => {
  const intl = useIntl()
  const dispatch = useDispatch()


  return (
    <div className="chatbot-suggestions">
      {predefinedChatbotRequests.map(({ msgId, func }, index) => (
        <Button
          key={index}
          type="button"
          basic
          disabled={isWaitingForResponse}
          onClick={() =>dispatch(func)}
        >
          <FormattedMessage id={msgId} />
        </Button>
      ))}
    </div>
  )
}

export default ChatbotSuggestions
