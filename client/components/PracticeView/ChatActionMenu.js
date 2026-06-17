import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { getContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import {
  addAnnotationCandidates,
  resetAnnotationCandidates,
  setAnnotationsVisibility,
} from 'Utilities/redux/annotationsReducer'
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
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const { currentAnswers, focusedWord: currentWord } = useSelector(({ practice }) => practice)
  const { messages, exerciseContext, isWaitingForResponse, isLoadingHistory } = useSelector(({ chatbot }) => chatbot)
    
  const focused = useSelector(state => state.snippets.focused)
  const session_id = useSelector(state => state.snippets.focused?.session_id)
  const storyid = useSelector(state => state.snippets.focused?.storyid)
  const chat_history = useSelector(state => state.snippets.focused_snippet_chat_history)

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

  const handleSentenceTranslation = () => {
        setShowContextTranslation(true)
        let sentence = ''
        const safeSnippet = focused?.practice_snippet ? focused.practice_snippet : []       
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

  const handleAddAnnotation = () => {
    if (currentWord) {
      dispatch(resetAnnotationCandidates())
      dispatch(addAnnotationCandidates(currentWord))
      dispatch(setAnnotationsVisibility(true))
    }
    setOpen(false)
  }

    const handleFabClick = () => {
    setOpen(!open)
  }

  useEffect(() => {
    if (!open) return
    const handleOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

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
    <div className="chat-action-menu" ref={rootRef}>
      {/* Trigger Button */}
      <button type="button" className="chat-action-trigger" onClick={handleFabClick} data-cy="chat-action-menu-popup">
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
              data-cy="nest-button"
              onClick={handleWordNestClick}>
              <div className="chat-action-icon">
                <img src={images.network} alt="network icon" width="32" />
              </div>
              <span className="chat-action-text">
                <FormattedMessage id="display-word-nest" defaultMessage="Word Nest" />
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
          {/* <button type="button" className="chat-action-item" onClick={handleAddAnnotation}>
            <div className="chat-action-icon" style={{ color: '#f2c03b' }}>
              <Icon name="sticky note outline" />
            </div>
            <span className="chat-action-text">
              <FormattedMessage id="add-annotation" defaultMessage="Add annotation" />
            </span>
          </button> */}
        </div>
      )}
    </div>
  )
}

export default ChatActionMenu