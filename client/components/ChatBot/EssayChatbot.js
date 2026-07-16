import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import CorrectionSuggestionPopper from 'Components/EssayWritingView/CorrectionSuggestionPopper'
import { getCorrectedTextFromCorrectionEntry } from 'Components/EssayWritingView/utils/correctionTokens'
import RobotIcon from 'Components/PracticeView/RobotIcon'
import SanitizedHTML from 'Components/SanitizedHTML'
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined'
import Spinner from 'Components/Spinner'
import { getEssayChatbotResponse } from 'Utilities/redux/chatbotReducer'

import './Chatbot.scss'

const FOLLOW_UP_MESSAGE_ID = 'essay-chatbot-follow-up-question'

const EssayChatbot = ({ essayFocus, essayText, onClearFocus, onSentenceSelect }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const [currentMessage, setCurrentMessage] = useState('')
  const latestMessageRef = useRef(null)
  const suggestionRefs = useRef({})
  const lastFocusedSentenceIdRef = useRef(null)
  const {
    correctionSuggestionSentenceIds,
    correctionSuggestionsBySentenceId,
    correctionsByKey,
    sessionId,
  } = useSelector(({ writingCorrection }) => writingCorrection)
  const { essayMessages, isWaitingForEssayResponse } = useSelector(({ chatbot }) => chatbot)
  const correctionSuggestions = correctionSuggestionSentenceIds
    .map(sentenceId => correctionSuggestionsBySentenceId[sentenceId])
    .filter(Boolean)
  const hasActiveSelection = Boolean(essayFocus?.selection)

  // When a suggestion is selected the panel switches from the full list to a focused view: just that
  // one suggestion pinned on top, with the conversation below it.
  const focusedSentenceId = essayFocus?.selection?.sentenceId
  const focusedSuggestion =
    (focusedSentenceId &&
      correctionSuggestions.find(suggestion => suggestion.sentenceId === focusedSentenceId)) ||
    null
  const isFocused = Boolean(focusedSuggestion)
  // Once a suggestion is selected, surface its feedback (the info-icon tooltip hints) as bot bubbles
  // in the conversation instead — one bubble per hint line.
  const focusedFeedbackHints = isFocused
    ? (essayFocus?.feedbackText || '')
        .split('\n')
        .map(hint => hint.trim())
        .filter(Boolean)
    : []

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [essayMessages.length, correctionSuggestions.length])

  // Remember which suggestion is open so that, on returning to the full list, it scrolls back to that
  // suggestion instead of jumping to the top.
  useEffect(() => {
    if (isFocused) {
      if (focusedSentenceId) lastFocusedSentenceIdRef.current = focusedSentenceId
      return
    }

    const previousNode =
      lastFocusedSentenceIdRef.current && suggestionRefs.current[lastFocusedSentenceIdRef.current]
    previousNode?.scrollIntoView({ block: 'start' })
  }, [isFocused, focusedSentenceId])

  const buildSentenceSelectHandler = ({ key, sentence, sentenceId }) =>
    onSentenceSelect
      ? (correctionRange, interactionType) =>
          onSentenceSelect({
            correctedText: getCorrectedTextFromCorrectionEntry(correctionsByKey[key]),
            interactionType,
            originalText: correctionsByKey[key]?.text || sentence,
            sentence,
            sentenceId,
            ...(correctionRange || {}),
          })
      : undefined

  const renderSuggestion = (suggestion, renderOnlyFocused = false) => (
    <CorrectionSuggestionPopper
      key={suggestion.sentenceId}
      correctionEntry={correctionsByKey[suggestion.key]}
      focusedSelection={
        essayFocus?.selection?.sentenceId === suggestion.sentenceId ? essayFocus.selection : null
      }
      renderOnlyFocused={renderOnlyFocused}
      sentence={suggestion.sentence}
      onSentenceSelect={buildSentenceSelectHandler(suggestion)}
    />
  )

  const handleMessageSubmit = event => {
    event.preventDefault()

    if (!currentMessage.trim()) return

    dispatch(
      getEssayChatbotResponse({
        sessionId,
        message: currentMessage,
        originalText: essayFocus?.originalText || essayFocus?.focusedSentence || essayText,
        correctedText: essayFocus?.correctedText || '',
        sentenceId: essayFocus?.sentenceId || essayFocus?.selection?.sentenceId || null,
        focusedWord: essayFocus?.focusedWord || '',
      }),
    )
    setCurrentMessage('')
  }

  return (
    <div className="chatbot">
      <div className="ai-assistant-header">
        {isFocused && (
          <button type="button" className="essay-chatbot-back" onClick={() => onClearFocus?.()}>
            <ArrowCircleLeftOutlinedIcon sx={{ fontSize: '2.2rem' }} />
          </button>
        )}
        <RobotIcon className="ai-header-icon" size={24} />
        <h3 className="ai-header-title">
          <FormattedMessage id="chatbot-toggle-label" />
        </h3>
      </div>

      {isFocused && (
        <div className="essay-chatbot-focused-suggestion">
          {renderSuggestion(focusedSuggestion, true)}
        </div>
      )}

      <div className="chatbot-messages">
        {!isFocused &&
          correctionSuggestions.map(suggestion => (
            <div
              key={suggestion.sentenceId}
              ref={node => {
                if (node) suggestionRefs.current[suggestion.sentenceId] = node
                else delete suggestionRefs.current[suggestion.sentenceId]
              }}
            >
              {renderSuggestion(suggestion)}
            </div>
          ))}
        {focusedFeedbackHints.map((hint, index) => (
          <div
            className="message message-bot"
            key={`focused-feedback-${index}`}
            style={{ display: 'block' }}
          >
            <SanitizedHTML html={hint} />
          </div>
        ))}
        {essayMessages.map((message, index) =>
          message.messageId === FOLLOW_UP_MESSAGE_ID && hasActiveSelection ? null : (
            <div
              className={`message message-${message.type}`}
              key={`${message.type}-${index}`}
              ref={index === essayMessages.length - 1 ? latestMessageRef : null}
              style={{ display: 'block' }}
            >
              {message.messageId ? (
                <FormattedMessage
                  id={message.messageId}
                  defaultMessage='Do you want to go deeper and focus your question on a particular part of the text or a suggestion I made? If so, click on the word or suggestion, and tell me to "FOLLOW UP"!'
                />
              ) : message.text ? (
                <ReactMarkdown children={message.text} />
              ) : (
                <FormattedMessage id="Error rendering message" />
              )}
            </div>
          ),
        )}
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
