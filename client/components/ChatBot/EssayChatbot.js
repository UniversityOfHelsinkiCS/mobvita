import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFlip } from 'swiper/modules'
import CorrectionSuggestionPopper from 'Components/EssayWritingView/CorrectionSuggestionPopper'
import { getCorrectedTextFromCorrectionEntry } from 'Components/EssayWritingView/utils/correctionTokens'
import SanitizedHTML from 'Components/SanitizedHTML'
import ChatInput from 'Components/ui/ChatInput'
import ChatBubble from 'Components/ui/ChatBubble'
import AppIcon from 'Components/ui/AppIcon'
import Spinner from 'Components/Spinner'
import { images } from 'Utilities/common'
import { getEssayChatbotResponse } from 'Utilities/redux/chatbotReducer'

import 'swiper/css'
import 'swiper/css/effect-flip'
import './Chatbot.scss'

const FOLLOW_UP_MESSAGE_ID = 'essay-chatbot-follow-up-question'

// A stable id for one correction bubble (sentence + range), used to keep a separate conversation
// thread per bubble. The empty string is the "general" thread shown in the list view. A passage
// selected past the last full stop has no sentence, so its key is its position in the essay.
const buildFocusKey = selection => {
  if (!selection) return ''
  const { sentenceId, startOffset = '', endOffset = '' } = selection
  return `${sentenceId ?? ''}::${startOffset}::${endOffset}`
}

const EssayChatbot = ({
  essayFocus,
  essayText,
  onClearFocus,
  onSentenceSelect,
  hideCorrectionSuggestions = false,
}) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const [currentMessage, setCurrentMessage] = useState('')
  const latestMessageRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const swiperRef = useRef(null)
  const savedListScrollRef = useRef(0)
  const pendingListClickRef = useRef(false)
  const focusOriginRef = useRef('textarea')
  const lastFocusedSentenceIdRef = useRef(null)
  const focusedCorrectionRef = useRef({ correctionKeys: null, focusKey: '' })
  const {
    correctionSuggestionSentenceIds,
    correctionSuggestionsBySentenceId,
    correctionsByKey,
    sessionId,
  } = useSelector(({ writingCorrection }) => writingCorrection)
  const { essayMessages, isWaitingForEssayResponse } = useSelector(({ chatbot }) => chatbot)
  // The teacher review chatbot hides the correction bubbles (list + focused view); it only shows the
  // conversation.
  const correctionSuggestions = hideCorrectionSuggestions
    ? []
    : correctionSuggestionSentenceIds
        .map(sentenceId => correctionSuggestionsBySentenceId[sentenceId])
        .filter(Boolean)
  const hasActiveSelection = Boolean(essayFocus?.selection)
  // A selected word focuses the panel just like a correction does, but it has no bubble of its own
  // — the focused view pins the word itself.
  const focusedTextSelection = essayFocus?.selection?.isTextSelection ? essayFocus.selection : null
  const correctionKeys = correctionSuggestions.map(suggestion => suggestion.key).join('|')

  // When a suggestion is selected the panel switches from the full list to a focused view: just that
  // one suggestion pinned on top, with the conversation below it.
  const focusedSentenceId = essayFocus?.selection?.sentenceId
  const focusedSuggestion =
    (focusedSentenceId &&
      correctionSuggestions.find(suggestion => suggestion.sentenceId === focusedSentenceId)) ||
    null
  const isFocused = Boolean(focusedSuggestion) || Boolean(focusedTextSelection)
  // Each bubble has its own conversation thread; the list view uses the general ('') thread.
  const activeFocusKey = isFocused ? buildFocusKey(essayFocus?.selection) : ''
  // Once a suggestion is selected, surface its feedback (the info-icon tooltip hints) in the
  // conversation instead, one grey assistant-side bubble per hint line (2026 design).
  const focusedFeedbackHints = isFocused
    ? (essayFocus?.feedbackText || '')
        .split('\n')
        .map(hint => hint.trim())
        .filter(Boolean)
    : []

  // Scroll to the latest message when the conversation grows (a new message in either view).
  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [essayMessages.length, correctionSuggestions.length])

  // Switching to a different bubble's thread jumps that thread to its latest message. Guarded to the
  // focused view so it doesn't fight the list view's scroll restoration when flipping back to the list.
  useEffect(() => {
    if (isFocused) latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeFocusKey, isFocused])

  // Flip to the focused face when a suggestion is selected, and back to the list otherwise.
  useEffect(() => {
    swiperRef.current?.slideTo(isFocused ? 1 : 0)
  }, [isFocused])

  // A correction focus lives and dies with the suggestion list: it is dropped when the list changes
  // under it, or when its own suggestion is gone. A selected passage is the user's text and stays.
  useEffect(() => {
    if (!isFocused) {
      focusedCorrectionRef.current = { correctionKeys: null, focusKey: '' }
      if (hasActiveSelection) onClearFocus?.(essayFocus)
      return
    }

    if (focusedTextSelection) return

    const tracked = focusedCorrectionRef.current

    if (tracked.focusKey !== activeFocusKey) {
      focusedCorrectionRef.current = { correctionKeys, focusKey: activeFocusKey }
      return
    }

    if (tracked.correctionKeys !== correctionKeys) onClearFocus?.(essayFocus)
  }, [activeFocusKey, correctionKeys, isFocused, hasActiveSelection, focusedTextSelection])

  // Position the list when returning to it: a selection made from the list restores the exact scroll
  // position it had (bubble stays put); a selection made from the text scrolls that suggestion to the
  // top of the list so it's the first bubble shown.
  useLayoutEffect(() => {
    if (isFocused) {
      focusOriginRef.current = pendingListClickRef.current ? 'list' : 'textarea'
      pendingListClickRef.current = false
      if (focusedSentenceId) lastFocusedSentenceIdRef.current = focusedSentenceId
      return
    }

    const container = messagesContainerRef.current
    if (!container) return

    if (focusOriginRef.current === 'list') {
      container.scrollTop = savedListScrollRef.current
      return
    }

    // Textarea selection: bring the selected suggestion to the top (browser clamps the last few).
    const id = lastFocusedSentenceIdRef.current
    const escapedId = id && (window.CSS?.escape ? window.CSS.escape(id) : id)
    const target = escapedId && container.querySelector(`[data-suggestion-id="${escapedId}"]`)

    container.scrollTop = target
      ? container.scrollTop +
        (target.getBoundingClientRect().top - container.getBoundingClientRect().top)
      : 0
  }, [isFocused, focusedSentenceId])

  const buildSentenceSelectHandler = ({ key, sentence, sentenceId }) =>
    onSentenceSelect
      ? (correctionRange, interactionType) => {
          if (interactionType === 'click' && !isFocused) {
            // Selecting from the list: remember its scroll position to restore on the way back.
            pendingListClickRef.current = true
            savedListScrollRef.current = messagesContainerRef.current?.scrollTop ?? 0
          }
          onSentenceSelect({
            correctedText: getCorrectedTextFromCorrectionEntry(correctionsByKey[key]),
            interactionType,
            originalText: correctionsByKey[key]?.text || sentence,
            sentence,
            sentenceId,
            ...(correctionRange || {}),
          })
        }
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

  // The pinned "bubble" for selected text: the word the user clicked or the passage they dragged
  // over — a few words or several sentences — in the same shape as a correction bubble so the
  // focused view reads the same either way. Nothing to click — no correction sits behind it — so
  // it carries no select handlers.
  const renderSelectedText = () => (
    <ChatBubble
      variant="hint"
      className="essay-writing-correction-bubble essay-writing-correction-bubble-selection"
      data-cy="essay-selected-text-bubble"
    >
      <Box className="essay-writing-correction-content">
        <span className="essay-writing-corrected-word essay-writing-selected-passage">
          {essayFocus?.focusedWord}
        </span>
      </Box>
    </ChatBubble>
  )

  const handleMessageSubmit = event => {
    event?.preventDefault()

    if (!currentMessage.trim()) return

    // Prefer the backend sentence id of the focused suggestion; fall back to the local id when the
    // backend hasn't returned one yet.
    const focusedBeSentenceId =
      (focusedSuggestion && correctionsByKey[focusedSuggestion.key]?.beSentenceId) || null

    dispatch(
      getEssayChatbotResponse({
        sessionId,
        message: currentMessage,
        originalText: essayFocus?.originalText || essayFocus?.focusedSentence || essayText,
        correctedText: essayFocus?.correctedText || '',
        sentenceId:
          focusedBeSentenceId ||
          essayFocus?.sentenceId ||
          essayFocus?.selection?.sentenceId ||
          null,
        focusedWord: essayFocus?.focusedWord || '',
        focusKey: activeFocusKey,
      }),
    )
    setCurrentMessage('')
  }

  // The conversation (bot/user messages) lives on both flip faces, but only the visible face pins the
  // scroll-to-latest ref so auto-scroll targets the face the user is actually looking at.
  // Every message is stamped with the focus key it was sent under, so each thread renders only its
  // own: '' is the general conversation on the suggestion-list face, and a suggestion's key is the
  // conversation belonging to that bubble alone.
  const renderConversationMessages = (focusKey, isActiveFace) => {
    const messages = essayMessages.filter(message => (message.focusKey ?? '') === focusKey)

    return messages.map((message, index) =>
      message.messageId === FOLLOW_UP_MESSAGE_ID && hasActiveSelection ? null : (
        <ChatBubble
          variant={message.type === 'user' ? 'user' : 'bot'}
          key={`${message.type}-${index}`}
          ref={isActiveFace && index === messages.length - 1 ? latestMessageRef : null}
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
        </ChatBubble>
      ),
    )
  }

  const renderWaitingSpinner = () =>
    isWaitingForEssayResponse ? (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 10px' }}>
        <Spinner inline />
      </div>
    ) : null

  return (
    <div className="chatbot essay-chatbot vita-chatbot">
      <div className="ai-assistant-header">
        <h3 className="ai-header-title">Vita - AI Assistant</h3>
      </div>

      <Swiper
        className="essay-chatbot-flip"
        effect="flip"
        modules={[EffectFlip]}
        allowTouchMove={false}
        initialSlide={isFocused ? 1 : 0}
        onSwiper={swiper => {
          swiperRef.current = swiper
        }}
      >
        {/* Front face: the full list of correction suggestions, then the conversation. */}
        <SwiperSlide className="essay-chatbot-face">
          <div className="chatbot-messages" ref={messagesContainerRef}>
            {correctionSuggestions.map(suggestion => (
              <div
                key={suggestion.sentenceId}
                className="essay-chatbot-suggestion-group"
                data-suggestion-id={suggestion.sentenceId}
              >
                {renderSuggestion(suggestion)}
              </div>
            ))}
            {renderConversationMessages('', !isFocused)}
            {!isFocused && renderWaitingSpinner()}
          </div>
        </SwiperSlide>

        {/* Back face: a back control and the selected bubble pinned on top, then its conversation. */}
        <SwiperSlide className="essay-chatbot-face">
          {isFocused && (
            <div className="essay-chatbot-focused-suggestion" data-cy="essay-chatbot-focused">
              <button
                type="button"
                className="essay-chatbot-back"
                data-cy="essay-chatbot-back"
                aria-label={intl.formatMessage({ id: 'Back' })}
                onClick={() => onClearFocus?.()}
              >
                <AppIcon src={images.flipBackCircle} size={36} />
              </button>
              {focusedTextSelection
                ? renderSelectedText()
                : renderSuggestion(focusedSuggestion, true)}
            </div>
          )}
          <div className="chatbot-messages">
            {focusedFeedbackHints.map((hint, index) => (
              <ChatBubble variant="comment" key={`focused-feedback-${index}`}>
                <SanitizedHTML html={hint} />
              </ChatBubble>
            ))}
            {renderConversationMessages(activeFocusKey, isFocused)}
            {isFocused && renderWaitingSpinner()}
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="chatbot-input-area">
        <ChatInput
          value={currentMessage}
          onChange={setCurrentMessage}
          onSubmit={handleMessageSubmit}
          placeholder={intl.formatMessage({ id: 'enter-question-to-chatbot' })}
          disabled={isWaitingForEssayResponse}
          name="essayChatbotInput"
        />
      </div>
    </div>
  )
}

export default EssayChatbot
