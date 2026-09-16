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
import { WORDNEST_PILL_STYLE } from 'Components/Flashcards/Practice/Fillin/FlashcardBack'
import CustomTooltip from 'Components/CustomTooltip'
import { images, sanitizeHtml } from 'Utilities/common'
import 'Components/PracticeView/CombinedChatbot.scss'

/**
 * FlashcardsChatbot — the assistant on /flashcards. Started as a copy of GeneralChatbot and is
 * expected to diverge from it, so it is a component of its own rather than a mode of that one.
 *
 * Two seams are deliberately isolated:
 *   - `sendFlashcardsDialogue` (dialoguesReducer) is the only place the assistant-api agent is
 *     named, so pointing this at a flashcards agent is a route change there, not a change here.
 *   - `PREDEFINED_REQUEST_IDS` is where flashcard-specific canned prompts go; they render in the
 *     ChatInput burger menu.
 *
 * It differs from GeneralChatbot already in that it carries no "add a story" dock — that belongs
 * to the library, not to flashcards — and that it opens with the deck's story context as a hint
 * bubble, which used to be a floating card (and, on narrow screens, an ⓘ) on the page itself.
 *
 * `showBlueCardsPrompt` / `onDismissBlueCardsPrompt` come from the page, which owns the timing (it
 * is the one that hears back from the practice view). The prompt used to interrupt as a modal; here
 * the assistant raises it as a bot message you can ignore.
 *
 * The card being practised arrives through `flashcards.currentCard`, published by the deck (which
 * tracks its own position in local state). Its word, speaker and word-nest control are laid out
 * like CombinedChatbot's `.current-word` header, and its hints render as the same bulb-and-bubble
 * rows — they used to be a paged modal behind a "Hint" link on the card itself.
 */

// i18n ids for the burger-menu prompts. Each is sent verbatim as the user's message.
const PREDEFINED_REQUEST_IDS = [
  'chatbot-message-suggestion-next-steps',
  'chatbot-message-suggestion-performance',
]

const FlashcardsChatbot = ({ showBlueCardsPrompt = false, onDismissBlueCardsPrompt }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [currentMessage, setCurrentMessage] = useState('')

  // Scoped by URL, so each flashcards mode keeps its own thread. Swap for a constant (e.g.
  // 'flashcards') to carry one conversation across the tabs instead.
  const scope = useLocation().pathname
  const items = useSelector(({ dialogues }) => dialogues.items)
  const isWaitingForResponse = useSelector(({ dialogues }) => !!dialogues.pending[scope])
  const messages = items.filter(i => i.scope === scope && i.type === 'chatbot-message')

  // Which deck the user is practising, for the opening hint. Blue-card decks live in a different
  // slice from regular stories, hence the two lookups.
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

  // The card on screen, from the deck. `hint` is [{ hint }]; de-duplicated because the same hint can
  // be stored more than once for a lemma.
  const currentCard = useSelector(({ flashcards }) => flashcards.currentCard)
  const revealedHints = useSelector(({ flashcards }) => flashcards.revealedHints)
  const deckCompleted = useSelector(({ flashcards }) => flashcards.deckCompleted)
  const currentLemma = currentCard?.lemma
  const cardHints = [...new Set((currentCard?.hint || []).map(h => h.hint).filter(Boolean))]

  // Revealed one at a time and counted, as in the practice chatbot — the answer payload reports the
  // tally as `hints_shown`, so showing them all for free would change what an answer is worth.
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
  const predefinedChatbotRequests = PREDEFINED_REQUEST_IDS.map(msgId => ({
    msgId,
    func: sendFlashcardsDialogue(intl.formatMessage({ id: msgId }), scope),
  }))

  const scrollToLatestMessage = () =>
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    scrollToLatestMessage()
  }, [messages.length])

  const handleMessageSubmit = () => {
    if (currentMessage.trim() === '') return
    dispatch(sendFlashcardsDialogue(currentMessage, scope))
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
            buttonStyle={WORDNEST_PILL_STYLE}
            divStyle={{ display: 'inline-flex', flexShrink: 0 }}
          />
        </div>
      )}

      <div className="chatbot-messages">
        {showStoryHint && (
          <ChatBubble variant="hint">
            <FlashcardStoryInfoText
              title={title}
              type={type}
              numOfRewardableWords={numOfRewardableWords}
            />
          </ChatBubble>
        )}
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
        {showBlueCardsPrompt && (
          <ChatBubble variant="bot">
            <BlueCardsTestEncouragement layout="chat" setShow={onDismissBlueCardsPrompt} />
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
        {isWaitingForResponse && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 8px' }}>
            <Spinner inline />
          </div>
        )}
      </div>

      <div className="chatbot-footer">
        {cardHints.length > 0 && (
          // Same shape as the practice chatbot's hint row: the bulbs tally what is left, and both
          // they and the button ask for the next one.
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
                  size="sm"
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
          predefinedChatbotRequests={predefinedChatbotRequests}
        />
      </div>
    </div>
  )
}

export default FlashcardsChatbot
