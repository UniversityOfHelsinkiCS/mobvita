import React from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { useIntl, FormattedMessage } from 'react-intl'

import { getGeneralChatbotResponse } from 'Utilities/redux/chatbotReducer'

const ChatbotSuggestions = ({ isWaitingForResponse }) => {
  const intl = useIntl()
  const dispatch = useDispatch()

  const handleSuggestedMessage = message => {
    dispatch(getGeneralChatbotResponse(message))
  }

  return (
    <div className="chatbot-suggestions">
      <Button
        type="button"
        basic
        disabled={isWaitingForResponse}
        onClick={() =>
          handleSuggestedMessage(
            intl.formatMessage({ id: 'chatbot-message-suggestion-next-steps' })
          )
        }
      >
        <FormattedMessage id="chatbot-message-suggestion-next-steps" />
      </Button>
      <Button
        type="button"
        basic
        disabled={isWaitingForResponse}
        onClick={() =>
          handleSuggestedMessage(
            intl.formatMessage({ id: 'chatbot-message-suggestion-performance' })
          )
        }
      >
        <FormattedMessage id="chatbot-message-suggestion-performance" />
      </Button>
    </div>
  )
}

export default ChatbotSuggestions
