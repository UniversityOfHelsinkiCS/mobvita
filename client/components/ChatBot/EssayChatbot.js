import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFlip } from 'swiper/modules'
import CorrectionSuggestionPopper from 'Components/EssayWritingView/CorrectionSuggestionPopper'
import {
  getCorrectedTextFromCorrectionEntry,
  getCorrectionGroups,
  getCorrectionGroupType,
} from 'Components/EssayWritingView/utils/correctionTokens'
import RobotIcon from 'Components/PracticeView/RobotIcon'
import SanitizedHTML from 'Components/SanitizedHTML'
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined'
import Spinner from 'Components/Spinner'
import { getEssayChatbotResponse } from 'Utilities/redux/chatbotReducer'
import { getWritingCorrectionWords } from 'Utilities/redux/writingCorrectionReducer'

import 'swiper/css'
import 'swiper/css/effect-flip'
import './Chatbot.scss'

const FOLLOW_UP_MESSAGE_ID = 'essay-chatbot-follow-up-question'

// When the panel flips to a focused suggestion it takes on that correction type's colour.
// Mirrors the $essay-bubble-*-bg-color values in EssayWritingView/EssayWritingStyles.scss.
const CORRECTION_TYPE_COLORS = {
  replacement: '#88cefb',
  multi: '#88cefb',
  insertion: '#92f294',
  deletion: '#f6b3b3',
}

// Strong version of each correction colour for the "back to list" arrow, so it stays readable on the
// tinted title bar and matches its hue (blue/green/red) instead of always being blue.
const CORRECTION_TYPE_ACCENT_COLORS = {
  replacement: '#0d6efd',
  multi: '#0d6efd',
  insertion: '#198754',
  deletion: '#dc3545',
}

// Blend a hex colour toward white (amount 0..1). Used to make the sidebar tint lighter than the
// full-strength title bar so the title's colour stays clearly visible against it.
const lightenColor = (hex, amount) => {
  const value = hex.replace('#', '')
  const channel = index => parseInt(value.slice(index, index + 2), 16)
  const mix = component => Math.round(component + (255 - component) * amount)
  return `rgb(${mix(channel(0))}, ${mix(channel(2))}, ${mix(channel(4))})`
}

const rangesMatch = (firstRange, secondRange) =>
  Boolean(firstRange) &&
  Boolean(secondRange) &&
  firstRange.startOffset === secondRange.startOffset &&
  firstRange.endOffset === secondRange.endOffset

// The correction type of the group the focused selection points at — drives the flipped colour.
const getFocusedCorrectionType = (correctionEntry, sentence, selection) => {
  if (!correctionEntry || !selection) return null
  const words = getWritingCorrectionWords(correctionEntry.corrections)
  const group = getCorrectionGroups(sentence, words).find(candidate =>
    rangesMatch(selection, candidate.range),
  )
  return group ? getCorrectionGroupType(group) : null
}

// The correction colour of the currently focused suggestion, resolved from the writingCorrection slice
// and the current essay focus. Exported so the parent can tint the sidebar frame to match the chatbot.
export const getEssayFocusAccentColor = (writingCorrection, essayFocus) => {
  const focusedSentenceId = essayFocus?.selection?.sentenceId
  if (!focusedSentenceId || !writingCorrection) return null
  const {
    correctionSuggestionSentenceIds = [],
    correctionSuggestionsBySentenceId = {},
    correctionsByKey = {},
  } = writingCorrection
  const suggestion = correctionSuggestionSentenceIds
    .map(sentenceId => correctionSuggestionsBySentenceId[sentenceId])
    .find(candidate => candidate && candidate.sentenceId === focusedSentenceId)
  if (!suggestion) return null
  const type = getFocusedCorrectionType(
    correctionsByKey[suggestion.key],
    suggestion.sentence,
    essayFocus.selection,
  )
  // Lighter than the title bar (which uses the full-strength CORRECTION_TYPE_COLORS) so the title stands out.
  return type ? lightenColor(CORRECTION_TYPE_COLORS[type], 0.6) : null
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
  // Where the current focus was entered from, and the list's scroll position when a list bubble was
  // pressed — so returning to the list restores that position (list) or jumps to the top (textarea).
  const savedListScrollRef = useRef(0)
  const pendingListClickRef = useRef(false)
  const focusOriginRef = useRef('textarea')
  const lastFocusedSentenceIdRef = useRef(null)
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
  // In the focused view the whole panel is tinted with the selected suggestion's correction colour.
  const focusedCorrectionType = isFocused
    ? getFocusedCorrectionType(
        correctionsByKey[focusedSuggestion.key],
        focusedSuggestion.sentence,
        essayFocus?.selection,
      )
    : null
  const focusedColor = focusedCorrectionType ? CORRECTION_TYPE_COLORS[focusedCorrectionType] : null
  const focusedAccentColor = focusedCorrectionType
    ? CORRECTION_TYPE_ACCENT_COLORS[focusedCorrectionType]
    : null

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [essayMessages.length, correctionSuggestions.length])

  // Flip to the focused face when a suggestion is selected, and back to the list otherwise.
  useEffect(() => {
    swiperRef.current?.slideTo(isFocused ? 1 : 0)
  }, [isFocused])

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

  const handleMessageSubmit = event => {
    event.preventDefault()

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
      }),
    )
    setCurrentMessage('')
  }

  // The conversation (bot/user messages) lives on both flip faces, but only the visible face pins the
  // scroll-to-latest ref so auto-scroll targets the face the user is actually looking at.
  const renderConversationMessages = isActiveFace =>
    essayMessages.map((message, index) =>
      message.messageId === FOLLOW_UP_MESSAGE_ID && hasActiveSelection ? null : (
        <div
          className={`message message-${message.type}`}
          key={`${message.type}-${index}`}
          ref={isActiveFace && index === essayMessages.length - 1 ? latestMessageRef : null}
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
    )

  const renderWaitingSpinner = () =>
    isWaitingForEssayResponse ? (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 10px' }}>
        <Spinner inline />
      </div>
    ) : null

  return (
    <div className="chatbot essay-chatbot">
      <div
        className="ai-assistant-header"
        style={focusedColor ? { background: focusedColor } : undefined}
      >
        {isFocused && (
          <button
            type="button"
            className="essay-chatbot-back"
            style={focusedAccentColor ? { color: focusedAccentColor } : undefined}
            onClick={() => onClearFocus?.()}
          >
            <ArrowCircleLeftOutlinedIcon sx={{ fontSize: '2.2rem' }} />
          </button>
        )}
        <RobotIcon className="ai-header-icon" size={24} />
        <h3 className="ai-header-title">
          <FormattedMessage id="chatbot-toggle-label" />
        </h3>
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
              <div key={suggestion.sentenceId} data-suggestion-id={suggestion.sentenceId}>
                {renderSuggestion(suggestion)}
              </div>
            ))}
            {renderConversationMessages(!isFocused)}
            {renderWaitingSpinner()}
          </div>
        </SwiperSlide>

        {/* Back face: the selected suggestion pinned on top, plus its feedback and the conversation. */}
        <SwiperSlide className="essay-chatbot-face">
          {isFocused && (
            <div className="essay-chatbot-focused-suggestion">
              {renderSuggestion(focusedSuggestion, true)}
            </div>
          )}
          <div className="chatbot-messages">
            {focusedFeedbackHints.map((hint, index) => (
              <div
                className="message message-bot"
                key={`focused-feedback-${index}`}
                style={{ display: 'block' }}
              >
                <SanitizedHTML html={hint} />
              </div>
            ))}
            {renderConversationMessages(isFocused)}
            {renderWaitingSpinner()}
          </div>
        </SwiperSlide>
      </Swiper>

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
