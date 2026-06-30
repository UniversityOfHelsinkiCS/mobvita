import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'

import CorrectionSuggestionPopper from 'Components/EssayWritingView/CorrectionSuggestionPopper'
import { getEssayChatbotSessionId } from 'Components/EssayWritingView/utils/essayDraftStorage'
import {
  getCorrectionText,
  isCorrectionDeletion,
} from 'Components/EssayWritingView/utils/correctionTokens'
import RobotIcon from 'Components/PracticeView/RobotIcon'
import Spinner from 'Components/Spinner'
import { getEssayChatbotResponse } from 'Utilities/redux/chatbotReducer'

import './Chatbot.scss'

const getCorrectedTextFromCorrectionEntry = correctionEntry => {
  if (!correctionEntry) return ''
  if (correctionEntry.correctedText) return correctionEntry.correctedText

  return (correctionEntry.corrections || [])
    .map(word => (
      isCorrectionDeletion(word)
        ? ''
        : getCorrectionText(word.corrected ?? word.original)
    ))
    .join('')
}

const EssayChatbot = ({ essayFocus, essayText, onSentenceSelect }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const [essaySessionId] = useState(getEssayChatbotSessionId)
  const [currentMessage, setCurrentMessage] = useState('')
  const latestMessageRef = useRef(null)
  const {
    correctionSuggestionSentenceIds,
    correctionSuggestionsBySentenceId,
    correctionsByKey,
  } = useSelector(({ writingCorrection }) => writingCorrection)
  const {
    essayMessages,
    isWaitingForEssayResponse,
  } = useSelector(({ chatbot }) => chatbot)
  const correctionSuggestions = correctionSuggestionSentenceIds
    .map(sentenceId => correctionSuggestionsBySentenceId[sentenceId])
    .filter(Boolean)

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [essayMessages.length, correctionSuggestions.length])

  const handleMessageSubmit = event => {
    event.preventDefault()

    if (!currentMessage.trim()) return

    dispatch(
      getEssayChatbotResponse({
        sessionId: essaySessionId,
        message: currentMessage,
        originalText: essayFocus?.originalText || essayFocus?.focusedSentence || essayText,
        correctedText: essayFocus?.correctedText || '',
        sentenceId: essayFocus?.sentenceId || essayFocus?.selection?.sentenceId || null,
      }),
    )
    setCurrentMessage('')
  }

  return (
    <div className="chatbot">
      <div className="ai-assistant-header">
        <RobotIcon className="ai-header-icon" size={24} />
        <h3 className="ai-header-title">
          <FormattedMessage id="chatbot-toggle-label" />
        </h3>
      </div>

      <div className="chatbot-messages">
        {correctionSuggestions.map(({ key, sentence, sentenceId }) => (
          <CorrectionSuggestionPopper
            key={sentenceId}
            correctionEntry={correctionsByKey[key]}
            focusedSelection={
              essayFocus?.selection?.sentenceId === sentenceId
                ? essayFocus.selection
                : null
            }
            sentence={sentence}
            onSentenceSelect={
              onSentenceSelect
                ? (correctionRange, interactionType) => onSentenceSelect({
                  correctedText: getCorrectedTextFromCorrectionEntry(correctionsByKey[key]),
                  interactionType,
                  originalText: correctionsByKey[key]?.text || sentence,
                  sentence,
                  sentenceId,
                  ...(correctionRange || {}),
                })
                : undefined
            }
          />
        ))}
        {essayMessages.map((message, index) => (
          <div
            className={`message message-${message.type}`}
            key={`${message.type}-${index}`}
            ref={index === essayMessages.length - 1 ? latestMessageRef : null}
            style={{ display: 'block' }}
          >
            {message.messageId ? (
              <FormattedMessage
                id={message.messageId}
                defaultMessage="Do you want to go deeper and focus your question on a particular part of the text or a suggestion I made? If so, click on the word or suggestion, and tell me to &quot;FOLLOW UP&quot;!"
              />
            ) : message.text ? (
              <ReactMarkdown children={message.text} />
            ) : (
              <FormattedMessage id="Error rendering message" />
            )}
          </div>
        ))}
        {isWaitingForEssayResponse && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 10px' }}>
            <Spinner inline />
          </div>
        )}
      </div>
      <div className="chatbot-input-area">
        <form onSubmit={handleMessageSubmit} className="chatbot-input-form">
          <input
            type="text"
            name="essayChatbotInput"
            placeholder={intl.formatMessage({ id: 'enter-question-to-chatbot' })}
            value={currentMessage}
            disabled={isWaitingForEssayResponse}
            onChange={event => setCurrentMessage(event.target.value)}
          />
          <Button type="submit" primary disabled={isWaitingForEssayResponse}>
            <FormattedMessage id="submit-chat-message" defaultMessage="Send" />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default EssayChatbot
