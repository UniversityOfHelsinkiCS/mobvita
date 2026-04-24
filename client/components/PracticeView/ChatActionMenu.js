import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { getContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import { 
  useLearningLanguage, 
  useDictionaryLanguage, 
  learningLanguageLocaleCodes,
  images 
} from 'Utilities/common'
import ChatActionMenuSuggestions from './ChatActionMenuSuggestions'

const ChatActionMenu = ({
  handleShowHint,
  hasHints,
  showAllHintsUsed,
  mode = 'chatbot',
  handleShowWordNest,
  showWordNestOption,
  lemma,
  wordNestChosenWord,
  setWordNestChosenWord,
  wordNestModalOpen,
  setWordNestModalOpen,
  storyWord,
  popupMessageId = 'explain-wordnest-modal',
  buttonStyle = { background: 'none' },
  dataCy = 'nest-button',
  showContextTranslation,
  setShowContextTranslation,
  predefinedChatbotRequests,
  validToChat
}) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const { currentAnswers, focusedWord: currentWord } = useSelector(({ practice }) => practice)
  const { messages, exerciseContext, isWaitingForResponse, isLoadingHistory } = useSelector(({ chatbot }) => chatbot)
  const { focused } = useSelector(({ snippets }) => snippets)
  const { session_id, storyid, chat_history } = useSelector(({ snippets }) => ({
        session_id: snippets.focused?.session_id,
        storyid: snippets.focused?.storyid,
        // chat_history: snippets.focused?.chat_history
        chat_history: snippets.focused_snippet_chat_history
    }));
  const translationState = useSelector(({ translation }) => translation)
  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()
  const { 
    message: hintMessage, // not in use! keep for compatibility
    hints, 
    listen,
    speak,
    requested_hints: requestedBEHints,
    ID: wordId,
    sentence_id,
    snippet_id, 
    surface,
  } = currentWord || {}

  const targetLangName = intl.formatMessage({ id: dictionaryLanguage, defaultMessage: dictionaryLanguage })

  const handleGetTranslation = () => {
    if (currentWord && currentWord.lemmas) {
      dispatch(setWords({
        surface: currentWord.surface,
        lemmas: currentWord.lemmas
      }))

      dispatch(getTranslationAction({
        learningLanguage,
        wordLemmas: currentWord.translation_lemmas || currentWord.lemmas,
        bases: currentWord.bases,
        dictionaryLanguage,
        storyId: currentWord.story_id,
        wordId: currentWord.ID,
        inflectionRef: currentWord.inflection_ref,
      }))
    }
    setOpen(false)
  }

  const handleSentenceTranslation = () => {
        setShowContextTranslation(true)
        let sentence = ''
        const safeSnippet = focused?.practice_snippet ? focused.practice_snippet : []
        console.log(focused)
        if (currentWord && currentWord.sentence_id) {
          sentence = safeSnippet
            .filter(s => currentWord.sentence_id - 1 <= s.sentence_id && s.sentence_id <= currentWord.sentence_id + 1)
            .map(t => t.surface)
            .join('')
            .replaceAll('\n', ' ')
            .trim()
        } else if (translationState.surfaceWord) {
                // Find the snippet entry with surface exactly matching surfaceWord
                const matchingSnippet = safeSnippet.find(s => s.surface.trim() === translationState.surfaceWord.trim())
                if (matchingSnippet) {
                  const sentenceId = matchingSnippet.sentence_id
                  sentence = safeSnippet
                    .filter(s => s.sentence_id === sentenceId)
                    .map(t => t.surface)
                    .join('')
                    .replaceAll('\n', ' ')
                    .trim()
                } else {
                  // fallback to simple include filter
                  sentence = safeSnippet
                    .filter(s => s.surface.includes(translationState.surfaceWord))
                    .map(t => t.surface)
                    .join('')
                    .replaceAll('\n', ' ')
                    .trim()
                }
              }

        if (sentence) {
          dispatch(getContextTranslation(
            sentence,
            learningLanguageLocaleCodes[learningLanguage],
            learningLanguageLocaleCodes[dictionaryLanguage]
          ))
        }

        setOpen(false)
      }

  const handleHintClick = () => {
    if (handleShowHint) handleShowHint()
    setOpen(false)
  }

  const handleFabClick = () => {
    setOpen(!open)
  }

  const handleWordNestClick = () => {
    if (lemma && typeof setWordNestChosenWord === 'function') {
      setWordNestChosenWord(lemma)
    }

    if (typeof setWordNestModalOpen === 'function') {
      setWordNestModalOpen(true)
    } else if (typeof handleShowWordNest === 'function') {
      handleShowWordNest()
    }

    setOpen(false)
  }

  if (!currentWord) return null

  return (
    <div className="chat-action-menu">
      {/* Trigger Button */}
      <button type="button" className="chat-action-trigger" onClick={handleFabClick}>
        <Icon name={open ? "close" : "ellipsis vertical"} />
      </button>

      {open && (
        <div className="chat-action-options">
          {mode === 'chatbot' && !showAllHintsUsed && currentWord?.hints?.length > 0 && (currentWord.requested_hints?.length || 0) < currentWord.hints.length && (
            <button type="button" className="chat-action-item" onClick={handleHintClick}>
              <div className="chat-action-icon" style={{ color: '#f2c03b' }}>
                <Icon name="lightbulb" />
              </div>
              <span className="chat-action-text">
                <FormattedMessage id="ask-for-a-hint" defaultMessage="Show Hint" />
              </span>
            </button>
          )}

          {mode === 'chatbot' && (showAllHintsUsed || !hasHints) && (
            <div className="chat-action-item">
              <div className="chat-action-icon" style={{ color: '#1890ff' }}>
                <Icon name="question circle outline" />
              </div>
              <span className="chat-action-text">
                <ChatActionMenuSuggestions
                predefinedChatbotRequests={predefinedChatbotRequests}
                disabled={!validToChat || isWaitingForResponse}
                onClose={() => setOpen(false)}
              />
              </span>
            </div>
          )}

          {showWordNestOption && (             
            <button
              type="button"
              className="chat-action-item"
              onClick={handleWordNestClick}>
              <div className="chat-action-icon">
                <img src={images.network} alt="network icon" width="32" />
              </div>
              <span className="chat-action-text">
                <FormattedMessage id="display-word-nest" defaultMessage="Word Nest" />
              </span>
            </button>              
          )}
                
          {mode === 'chatbot' && (
            <button type="button" className="chat-action-item" onClick={handleGetTranslation}>
              <div className="chat-action-icon" style={{ color: '#1890ff' }}>
                <Icon name="language" />
              </div>
              <span className="chat-action-text">
                <FormattedMessage id="translations-in" defaultMessage="Translation to" /> {targetLangName}
              </span>
            </button>
          )}
          {(
            <button type="button" className="chat-action-item" onClick={handleSentenceTranslation}>
              <div className="chat-action-icon" style={{ color: '#17a2b8' }}>
                <Icon name="book" />
              </div>
              <span className="chat-action-text">
                <FormattedMessage id="dictionaryhelp-show-context-translation" defaultMessage="Translate Sentence" />
              </span>
            </button>
          )}
        </div>
      )}      
    </div>
  )
}

export default ChatActionMenu