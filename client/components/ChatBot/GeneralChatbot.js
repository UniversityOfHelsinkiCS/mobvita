import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useIntl, FormattedMessage } from 'react-intl'
import './Chatbot.scss'
import { sendGeneralDialogue, removeDialogue } from 'Utilities/redux/dialoguesReducer'
import Spinner from 'Components/Spinner'
import ChatBubble from 'Components/ui/ChatBubble'
import ChatInput from 'Components/ui/ChatInput'
import AddNewStoryOptions from 'Components/AddNewStoryOptions'
import { closeAddStoryOptions } from 'Utilities/redux/helperSidebarReducer'
import ChatbotSuggestions from './ChatbotSuggestions'

const GeneralChatbot = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [currentMessage, setCurrentMessage] = useState('')

  // Each URL keeps its own dialogue thread (Profile tabs included). Items live in the dialogues
  // store across navigation; we filter by scope instead of clearing.
  const scope = useLocation().pathname
  const items = useSelector(({ dialogues }) => dialogues.items)
  const isWaitingForResponse = useSelector(({ dialogues }) => !!dialogues.pending[scope])
  const messages = items.filter(i => i.scope === scope && i.type === 'chatbot-message')
  const addStoryOptionsOpen = useSelector(({ helperSidebar }) => helperSidebar?.addStoryOptionsOpen)

  const latestMessageRef = useRef(null)
  const predefinedChatbotRequests = [
    'chatbot-message-suggestion-next-steps',
    'chatbot-message-suggestion-performance',
  ].map(msgId => ({
    msgId,
    func: sendGeneralDialogue(intl.formatMessage({ id: msgId }), scope),
  }))

  const scrollToLatestMessage = () =>
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    scrollToLatestMessage()
  }, [messages.length])

  const handleMessageSubmit = () => {
    if (currentMessage.trim() === '') return
    dispatch(sendGeneralDialogue(currentMessage, scope))
    setCurrentMessage('')
  }

  return (
    <div className="chatbot vita-chatbot">
      <div className="ai-assistant-header">
        <h3 className="ai-header-title">Vita - AI Assistant</h3>
      </div>

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <ChatBubble
            key={message.id}
            ref={index === messages.length - 1 ? latestMessageRef : null}
            variant={message.role === 'user' ? 'user' : 'bot'}
            onRemove={message.removable ? () => dispatch(removeDialogue(message.id)) : undefined}
          >
            {message.text ? (
              <ReactMarkdown children={message.text} />
            ) : (
              <FormattedMessage id="Error rendering message" />
            )}
          </ChatBubble>
        ))}
        {isWaitingForResponse && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 8px' }}>
            <Spinner inline />
          </div>
        )}
      </div>

      {addStoryOptionsOpen && (
        <div className="chatbot-add-story-dock">
          <ChatBubble variant="options">
            <AddNewStoryOptions onClose={() => dispatch(closeAddStoryOptions())} />
          </ChatBubble>
        </div>
      )}

      <div className="chatbot-footer">
        {messages.length === 0 && !addStoryOptionsOpen && (
          <>
            <p className="chatbot-intro">
              <FormattedMessage id="general-chatbot-init-mess" values={{ language: intl.locale }} />
            </p>            
          </>
        )}
        <ChatInput
          value={currentMessage}
          onChange={setCurrentMessage}
          onSubmit={handleMessageSubmit}
          placeholder={intl.formatMessage({ id: 'enter-question-to-chatbot' })}
          disabled={isWaitingForResponse}
          predefinedChatbotRequests={predefinedChatbotRequests}
        />
      </div>
    </div>
  )
}

export default GeneralChatbot
