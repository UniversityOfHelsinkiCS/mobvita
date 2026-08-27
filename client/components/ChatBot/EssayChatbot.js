import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFlip } from 'swiper/modules'
import CorrectionSuggestionPopper from 'Components/EssayWritingView/CorrectionSuggestionPopper'
import {
  getCorrectedTextFromCorrectionEntry,
  getCorrectionGroups,
  getCorrectionGroupType,
} from 'Components/EssayWritingView/utils/correctionTokens'
import SanitizedHTML from 'Components/SanitizedHTML'
import ChatInput from 'Components/ui/ChatInput'
import ChatBubble, { CORRECTION_COLORS } from 'Components/ui/ChatBubble'
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined'
import Spinner from 'Components/Spinner'
import { getEssayChatbotResponse } from 'Utilities/redux/chatbotReducer'
import { getWritingCorrectionWords } from 'Utilities/redux/writingCorrectionReducer'

import 'swiper/css'
import 'swiper/css/effect-flip'
import './Chatbot.scss'

const FOLLOW_UP_MESSAGE_ID = 'essay-chatbot-follow-up-question'

// The title bar of the flipped panel takes the selected bubble's own colour, so the two read as the
// same thing. Read straight from the bubble colours instead of copied: the three maps below used to
// hold their own hexes and had silently drifted out of step with the bubbles.
const CORRECTION_TYPE_COLORS = {
  replacement: CORRECTION_COLORS.replacement,
  multi: CORRECTION_COLORS.replacement,
  insertion: CORRECTION_COLORS.insertion,
  deletion: CORRECTION_COLORS.deletion,
}

// The conversation and the pinned suggestion sit on a light wash of the same hue — the title colour
// at L94, so it reads as the same colour family without competing with the message bubbles on it.
const CORRECTION_TYPE_BG_COLORS = {
  replacement: '#E9F3F6',
  multi: '#E9F3F6',
  insertion: '#F2F7E8',
  deletion: '#FFEBE0',
}

// The "back to list" arrow, in the same hue as its title bar. Each is the lightest shade of that hue
// that still clears 4.5:1 against the bar it sits on, so the arrow stays legible on all three.
const CORRECTION_TYPE_ACCENT_COLORS = {
  replacement: '#196480',
  multi: '#196480',
  insertion: '#496B0F',
  deletion: '#AE4109',
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

// A stable id for one correction bubble (sentence + range), used to keep a separate conversation
// thread per bubble. The empty string is the "general" thread shown in the list view.
const buildFocusKey = selection => {
  if (!selection) return ''
  const { sentenceId = '', startOffset = '', endOffset = '' } = selection
  return `${sentenceId}::${startOffset}::${endOffset}`
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
  const correctionKeys = correctionSuggestions.map(suggestion => suggestion.key).join('|')

  // When a suggestion is selected the panel switches from the full list to a focused view: just that
  // one suggestion pinned on top, with the conversation below it.
  const focusedSentenceId = essayFocus?.selection?.sentenceId
  const focusedSuggestion =
    (focusedSentenceId &&
      correctionSuggestions.find(suggestion => suggestion.sentenceId === focusedSentenceId)) ||
    null
  const isFocused = Boolean(focusedSuggestion)
  // Each bubble has its own conversation thread; the list view uses the general ('') thread.
  const activeFocusKey = isFocused ? buildFocusKey(essayFocus?.selection) : ''
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
  const focusedBgColor = focusedCorrectionType ? CORRECTION_TYPE_BG_COLORS[focusedCorrectionType] : null
  const focusedAccentColor = focusedCorrectionType
    ? CORRECTION_TYPE_ACCENT_COLORS[focusedCorrectionType]
    : null

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

  useEffect(() => {
    if (!isFocused) {
      focusedCorrectionRef.current = { correctionKeys: null, focusKey: '' }
      return
    }

    const tracked = focusedCorrectionRef.current

    if (tracked.focusKey !== activeFocusKey) {
      focusedCorrectionRef.current = { correctionKeys, focusKey: activeFocusKey }
      return
    }

    if (tracked.correctionKeys !== correctionKeys) onClearFocus?.()
  }, [activeFocusKey, correctionKeys, isFocused])

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

        {/* Back face: the selected suggestion pinned on top, plus its feedback and the conversation.
            Both areas take the focused suggestion's correction colour so the view matches its bubble. */}
        <SwiperSlide className="essay-chatbot-face">
          {isFocused && (
            <div
              className="essay-chatbot-focused-suggestion"
              style={focusedBgColor ? { background: focusedBgColor } : undefined}
            >
              {renderSuggestion(focusedSuggestion, true)}
            </div>
          )}
          <div
            className="chatbot-messages"
            style={focusedBgColor ? { background: focusedBgColor } : undefined}
          >
            {focusedFeedbackHints.map((hint, index) => (
              <ChatBubble variant="bot" key={`focused-feedback-${index}`}>
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
