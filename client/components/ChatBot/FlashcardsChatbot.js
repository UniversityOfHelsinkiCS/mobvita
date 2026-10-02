import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useIntl, FormattedMessage } from 'react-intl'
import './Chatbot.scss'
import { sendFlashcardsDialogue, removeDialogue } from 'Utilities/redux/dialoguesReducer'
import {
  revealFlashcardHint,
  requestNewFlashcardDeck,
  setDeckCompleted,
} from 'Utilities/redux/flashcardReducer'
import Spinner from 'Components/Spinner'
import ChatBubble from 'Components/ui/ChatBubble'
import AppButton from 'Components/AppButton'
import ChatInput from 'Components/ui/ChatInput'
import { FlashcardStoryInfoText } from 'Components/Flashcards/FlashcardStoryInfo'
import BlueCardsTestEncouragement from 'Components/Encouragements/BlueCardsTestEncouragement'
import PracticeCompletedEncouragement from 'Components/Encouragements/PracticeCompletedEncouragement'
import { Speaker } from 'Components/DictionaryHelp/dictComponents'
import WordNestLauncher from 'Components/WordNestModal/WordNestLauncher'
import { DISABLED_BG, DISABLED_TEXT } from 'Components/AppButton'
import CustomTooltip from 'Components/CustomTooltip'
import { images, sanitizeHtml } from 'Utilities/common'
import 'Components/PracticeView/CombinedChatbot.scss'
import { colors } from 'Assets/mui_theme/designTokens'

// The green "Word Nest" pill used on the flashcard
const WORDNEST_PILL_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: colors.green,
  color: colors.ink,
  border: 'none',
  outline: 'none',
  boxShadow: 'none',
  borderRadius: 999,
  padding: '7px 16px',
  fontWeight: 600,
  fontSize: 14,
}

const FlashcardsChatbot = ({ showBlueCardsPrompt = false, onDismissBlueCardsPrompt }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const scope = useLocation().pathname
  const [currentMessage, setCurrentMessage] = useState('')
  const items = useSelector(({ dialogues }) => dialogues.items)
  const isWaitingForResponse = useSelector(({ dialogues }) => !!dialogues.pending[scope])
  const messages = items.filter(i => i.scope === scope && i.type === 'chatbot-message')
  const { mode, type, storyId } = useParams()
  const blueCardStory = useSelector(({ flashcards }) =>
    flashcards.storyBlueCards?.find(story => story.story_id === storyId)
  )
  const regularStory = useSelector(({ stories }) =>
    stories.data?.find(story => story._id === storyId)
  )
  const selectedStory = type === 'test' ? blueCardStory : regularStory
  const { num_of_rewardable_words: numOfRewardableWords, title } = selectedStory || {}
  const showStoryHint =
    mode !== 'list' && mode !== 'new' && (type === 'story' || type === 'test') && Boolean(title)

  const currentCard = useSelector(({ flashcards }) => flashcards.currentCard)
  const revealedHints = useSelector(({ flashcards }) => flashcards.revealedHints)
  const deckCompleted = useSelector(({ flashcards }) => flashcards.deckCompleted)
  const currentCardAnswered = useSelector(({ flashcards }) => flashcards.currentCardAnswered)
  const sessionId = useSelector(({ flashcards }) => flashcards.sessionId)
  const currentLemma = currentCard?.lemma
  const cardGlosses = currentCard?.glosses
  const cardTranslations = Array.isArray(cardGlosses)
    ? [...new Set(cardGlosses)]
    : [cardGlosses].filter(Boolean)
  const cardHints = [...new Set((currentCard?.hint || []).map(h => h.hint).filter(Boolean))]
  const shownHints = cardHints.filter((hint, index) => revealedHints.includes(index))
  const nextHintIndex = cardHints.findIndex((hint, index) => !revealedHints.includes(index))
  const hasHintToShow = nextHintIndex !== -1
  const showNextHint = () => dispatch(revealFlashcardHint(nextHintIndex))
  const hintsLeftLabel = (
    <span style={{ whiteSpace: 'nowrap' }}>
      <FormattedMessage
        id="you-have-N-hints-left"
        defaultMessage="You have {count} hints left."
        values={{ count: cardHints.length - revealedHints.length }}
      />
    </span>
  )

  const latestMessageRef = useRef(null)
  const messagesEndRef = useRef(null)
  const scrollToLatestMessage = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    scrollToLatestMessage()
  }, [messages.length, shownHints.length, deckCompleted])

  // Only once the card has been answered or flipped: the vocabulary agent explains the word, so
  // before that it would hand over the answer. Until then the question goes to the general agent,
  // which has no card context — see sendFlashcardsDialogue.
  const vocabularyContext = currentCardAnswered
    ? {
        word: currentLemma,
        sessionId,
        translations: cardTranslations,
        examples: cardHints,
        nests: [],
      }
    : {}

  const handleMessageSubmit = () => {
    if (currentMessage.trim() === '') return
    dispatch(sendFlashcardsDialogue(currentMessage, scope, vocabularyContext))
    setCurrentMessage('')
  }

  return (
    <div className="chatbot vita-chatbot">
      <div className="ai-assistant-header">
        <h3 className="ai-header-title">Vita - AI Assistant</h3>
      </div>

      {currentLemma && (
        <div className="flashcard-assistant-word">
          <h4 className="current-word">
            <CustomTooltip title={<FormattedMessage id="explain-speaker-surface" />}>
              <span style={{ display: 'inline-flex', flexShrink: 0 }}>
                <Speaker word={currentLemma} />
              </span>
            </CustomTooltip>
            <span className="flashcard-assistant-word-text">{currentLemma}</span>
          </h4>
          <WordNestLauncher
            lemma={currentLemma}
            icon={images.wordnest}
            disabled={!currentCardAnswered}
            buttonStyle={
              currentCardAnswered
                ? WORDNEST_PILL_STYLE
                : {
                    ...WORDNEST_PILL_STYLE,
                    backgroundColor: DISABLED_BG,
                    color: DISABLED_TEXT,
                    '&.Mui-disabled': {
                      backgroundColor: DISABLED_BG,
                      color: DISABLED_TEXT,
                      border: 'none',
                    },
                  }
            }
            divStyle={{ display: 'inline-flex', flexShrink: 0 }}
          />
        </div>
      )}

      <div className="chatbot-messages">
        {showBlueCardsPrompt && (
          <ChatBubble variant="bot">
            <BlueCardsTestEncouragement layout="chat" setShow={onDismissBlueCardsPrompt} />
          </ChatBubble>
        )}
        {showStoryHint && (
          <ChatBubble variant="hint">
            <FlashcardStoryInfoText
              title={title}
              type={type}
              numOfRewardableWords={numOfRewardableWords}
            />
          </ChatBubble>
        )}
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
        {shownHints.map(hint => (
          <ChatBubble key={hint} variant="hint" className="message-hint" data-cy="flashcard-hint">
            <div className="hint-item">
              <img src={images.bulb} className="hint-bulb" alt="" width="20" height="20" />
              <span dangerouslySetInnerHTML={sanitizeHtml(hint)} />
            </div>
          </ChatBubble>
        ))}
        {deckCompleted && (
          <ChatBubble variant="bot">
            <PracticeCompletedEncouragement
              layout="chat"
              practiceType="flashcard"
              setShow={() => dispatch(setDeckCompleted(false))}
              continueAction={() => dispatch(requestNewFlashcardDeck())}
            />
          </ChatBubble>
        )}
        {isWaitingForResponse && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 8px' }}>
            <Spinner inline />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-footer">
        {cardHints.length > 0 && (
          <div className="hint-request-container" style={{ marginBottom: '8px' }}>
            <CustomTooltip title={hintsLeftLabel} placement="top" permanent>
              <div
                className="bulbs-container"
                onClick={hasHintToShow ? showNextHint : undefined}
                style={{ cursor: hasHintToShow ? 'pointer' : 'default' }}
                role="button"
                tabIndex={0}
                data-cy="flashcard-hint-bulbs"
                onKeyDown={e => {
                  if ((e.key === 'Enter' || e.key === ' ') && hasHintToShow) {
                    e.preventDefault()
                    showNextHint()
                  }
                }}
              >
                {cardHints.map((hint, index) => (
                  <img
                    key={hint}
                    src={revealedHints.includes(index) ? images.bulbEmpty : images.bulb}
                    alt=""
                    width="22"
                    height="22"
                    style={{ display: 'block' }}
                  />
                ))}
              </div>
            </CustomTooltip>
            <CustomTooltip title={hintsLeftLabel} placement="top" permanent>
              <span style={{ display: 'inline-flex' }}>
                <AppButton
                  variant="primary"                  
                  disabled={!hasHintToShow}
                  onClick={hasHintToShow ? showNextHint : undefined}
                  data-cy="flashcard-hint-button"
                >
                  <FormattedMessage id="ask-for-a-hint" defaultMessage="Show Hint" />
                </AppButton>
              </span>
            </CustomTooltip>
          </div>
        )}
        {messages.length === 0 && (
          <p className="chatbot-intro">
            <FormattedMessage id="general-chatbot-init-mess" values={{ language: intl.locale }} />
          </p>
        )}
        <ChatInput
          value={currentMessage}
          onChange={setCurrentMessage}
          onSubmit={handleMessageSubmit}
          placeholder={intl.formatMessage({ id: 'enter-question-to-chatbot' })}
          disabled={isWaitingForResponse}
        />
      </div>
    </div>
  )
}

export default FlashcardsChatbot
