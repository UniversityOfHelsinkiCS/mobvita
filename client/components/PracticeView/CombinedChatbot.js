import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import CustomTooltip from 'Components/CustomTooltip'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { isEmpty } from 'lodash'
import { Skeleton } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useIntl, FormattedMessage } from 'react-intl'
import ReactMarkdown from 'react-markdown'
import { lemmatizer } from 'lemmatizer'
import { useSelector, useDispatch } from 'react-redux'
import {
  getTranslationAction,
  setWords,
  changeTranslationStageAction,
  clearTranslationAction,
} from 'Utilities/redux/translationReducer'
import {
  incrementHintRequests,
  setReferences,
  setExplanation,
  setExample,
} from 'Utilities/redux/practiceReducer'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  useLearningLanguage,
  useDictionaryLanguage,
  flashcardColors,
  formatGreenFeedbackText,
  sanitizeHtml,
  composeExerciseContext,
  hiddenFeatures,
  getMode,
  images,
} from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'

import { Speaker } from 'Components/DictionaryHelp/dictComponents'
import WordNestModal from 'Components/WordNestModal'
import { recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'
import ChatActionMenu from './ChatActionMenu'
import NoteFormModal from './NoteFormModal'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import { useParams, useLocation } from 'react-router-dom'
import { addEditStoryAnnotation, removeStoryAnnotation } from 'Utilities/redux/storiesReducer'
import AppLemma from 'Components/ui/AppLemma'
import AppButton from 'Components/AppButton'
import { setFocusedWord, mcExerciseTouched } from 'Utilities/redux/practiceReducer'
import {
  getPracticeChatbotResponse,
  setConversationHistory,
  setCurrentContext,
} from 'Utilities/redux/chatbotReducer'
import { setSnippetChatHistory } from 'Utilities/redux/snippetsReducer'
import {
  setHelperSidebarOpen,
  toggleHelperSidebar,
  setHelperSidebarTab,
} from 'Utilities/redux/helperSidebarReducer'
import { clearNotes } from 'Utilities/redux/notesReducer'
import { getWordNestAction } from 'Utilities/redux/wordNestReducer'
import ChatbotSuggestions from 'Components/ChatBot/ChatbotSuggestions'
import ChatInput from 'Components/ui/ChatInput'
import ChatBubble from 'Components/ui/ChatBubble'
import Spinner from 'Components/Spinner'

import './CombinedChatbot.scss'
import AssistentSettings from './AssistentSettings'

const WordNotes = ({ notes, handleTooltipClick }) => {
  if (!notes.length) return null
  return (
    <>
      {notes.map((note, index) => {
        if (note.kind === 'no-topics') {
          return (
            <ChatBubble variant="note" key={index}>
              <FormattedMessage id="no-topics-available" />
            </ChatBubble>
          )
        }
        if (note.kind === 'topics') {
          return (
            <ChatBubble variant="note" key={index}>
              <FormattedMessage id="topics-header" />:
              {note.concepts?.length > 0 && (
                <ul>
                  {note.concepts.map((concept, i) => (
                    <li key={i}>
                      <span dangerouslySetInnerHTML={sanitizeHtml(concept)} />
                    </li>
                  ))}
                </ul>
              )}
            </ChatBubble>
          )
        }
        if (note.kind === 'your-answer') {
          return (
            <ChatBubble variant="note" key={index}>
              <FormattedMessage id="you-used" />
              :&nbsp;
              <span dangerouslySetInnerHTML={formatGreenFeedbackText(note.text)} />
            </ChatBubble>
          )
        }
        if (note.kind === 'mc') {
          return (
            <ChatBubble variant="note" key={index}>
              <span dangerouslySetInnerHTML={formatGreenFeedbackText(note.text)} />
              {note.choices?.length > 0 && (
                <ul>
                  {note.choices.map((choice, i) => (
                    <li key={i}>
                      <span dangerouslySetInnerHTML={formatGreenFeedbackText(choice)} />
                    </li>
                  ))}
                </ul>
              )}
            </ChatBubble>
          )
        }
        const showInfo =
          note.kind === 'hint' &&
          note.info &&
          (note.info.explanation?.length ||
            note.info.meta !== note.info.easy ||
            note.info.ref?.length)
        return (
          <ChatBubble variant="note" key={index}>
            <span dangerouslySetInnerHTML={formatGreenFeedbackText(note.text)} />
            {showInfo && (
              <InfoOutlinedIcon
                className="hint-info-icon"
                fontSize="small"
                style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
                onMouseDown={() => handleTooltipClick(note.info)}
                data-cy="chatbot-note-hint-info-icon"
              />
            )}
          </ChatBubble>
        )
      })}
    </>
  )
}

const UserNotes = ({ notes, onEdit, onDelete, busy }) => {
  if (!notes.length && !busy) return null
  return (
    <>
      {notes.map((note, index) => {
        const showHeader = note.isOwn || (!note.isOwn && !!note.username)
        return (
          <ChatBubble
            key={note.threadId || index}
            variant="controlled-note"
            onEdit={note.isOwn ? () => onEdit(note) : undefined}
            onRemove={note.isOwn ? () => onDelete(note) : undefined}
            editDataCy="chatbot-user-note-edit-icon"
            removeDataCy="chatbot-user-note-delete-icon"
          >
            {showHeader && !note.isOwn && (
              <div className="note-header">
                {!note.isOwn && note.username && (
                  <span className="note-author">{note.username}</span>
                )}
              </div>
            )}
            <div className="note-body">
              <span className="user-note-text">{note.text}</span>
              {note.isPublic && (
                <CustomTooltip title={<FormattedMessage id="public-note-checkbox" />}>
                  <span style={{ display: 'inline-flex' }}>
                    <PeopleIcon className="note-public-icon" fontSize="small" />
                  </span>
                </CustomTooltip>
              )}
            </div>
          </ChatBubble>
        )
      })}
      {busy && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px' }}>
          <Spinner inline />
        </div>
      )}
    </>
  )
}

const CombinedChatbot = ({ inWordNestModal, clue }) => {
  const dispatch = useDispatch()
  const intl = useIntl()

  const { focusedWord } = useSelector(({ practice }) => practice)

  const {
    attempt,
    currentAnswers,
    focusedWord: currentWord,
  } = useSelector(({ practice }) => practice)
  const { messages, isWaitingForResponse, isLoadingHistory } = useSelector(({ chatbot }) => chatbot)

  const translationState = useSelector(({ translation }) => translation)
  const { data: translationData } = useSelector(({ translation }) => translation)
  const translation = Array.isArray(translationData) ? translationData[0] : translationData
  const contextTranslationState = useSelector(({ contextTranslation }) => contextTranslation)
  const snippets = useSelector(({ snippets }) => snippets)
  const chat_history = snippets.focused_snippet_chat_history
  const storyFocused = useSelector(({ stories }) => stories.focused)
  const session_id =
    (snippets.focused && snippets.focused.session_id) ||
    snippets.sessionId ||
    snippets.session_id ||
    (storyFocused && storyFocused.session_id) ||
    null
  const storyid =
    (snippets.focused && snippets.focused.storyid) || translationState?.storyid || null

  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()

  const [validToChat, setValidToChat] = useState(false)
  const [eloScoreHearts, setEloScoreHearts] = useState([])
  const [spentHints, setSpentHints] = useState([])
  const [preHints, setPreHints] = useState([])
  const [filteredHintsList, setFilteredHintsList] = useState([])
  const [emptyHintsList, setEmptyHintsList] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [hintMessageIdx, setHintMessageIdx] = useState(0)
  const [predefinedChatbotRequests, setPredefinedChatbotRequests] = useState([])

  const [wordNestModalOpen, setWordNestModalOpen] = useState(false)
  const [wordNestChosenWord, setWordNestChosenWord] = useState('')
  // When opening WordNestModal, capture the current translation lemmas so we can restore
  // all translation cards (important for compound words).
  const [wordNestRestoreWord, setWordNestRestoreWord] = useState('')
  const [wordNestRestorePrefLemma, setWordNestRestorePrefLemma] = useState('')
  const [showContexTranslation, setShowContextTranslation] = useState(false)

  const wordNest = useSelector(({ wordNest }) => wordNest)
  const { data: words } = wordNest
  const { background } = flashcardColors
  const latestMessageRef = useRef(null)
  const { listen, speak } = currentWord || {}
  const isValidExercise = currentWord && Object.keys(currentWord).length > 0 && !listen && !speak
  const helperSidebarState = useSelector(({ helperSidebar }) => helperSidebar)
  const { activeTab: helperActiveTab, isOpen: helperIsOpen } = helperSidebarState || {}
  const notes = useSelector(({ notes }) => notes.items)
  const modalOpen = useSelector(({ practice }) =>
    Boolean(practice.references || practice.explanation),
  )

  // --- Word notes (reuse the story-annotation API) ---
  const { id: routeStoryId } = useParams()
  const noteMode = getMode()
  const noteUser = useSelector(({ user }) => user.data?.user)
  const myUid = noteUser?.oid
  const publicStory = storyFocused?.public ?? false

  const notePathname = useLocation().pathname
  const isGroupContext = notePathname.includes('group')
  const isLessonContext = notePathname.includes('lesson')
  const canMakePublic = isGroupContext && !!noteUser?.is_teacher
  const annotationPending = useSelector(({ stories }) => Boolean(stories.annotationPending))

  const noteWordId =
    helperActiveTab === 'exercise'
      ? (currentWord?.ID ?? null)
      : (translationState?.word_id ?? translationState?.wordId ?? null)
  const noteStoryId = storyid || routeStoryId || translationState?.storyid || null

  const wordToken = useMemo(
    () =>
      noteWordId != null
        ? storyFocused?.paragraph?.flat(1)?.find(w => w.ID === noteWordId)
        : undefined,
    [storyFocused, noteWordId],
  )
  const wordNotesList = useMemo(
    () =>
      (wordToken?.annotation || []).map(a => ({
        text: a.annotation,
        threadId: a.thread_id,
        isPublic: a.public,
        username: a.username,
        isOwn: a.uid === myUid,
        startId: wordToken.ID,
        endId: a.end_token_id,
      })),
    [wordToken, myUid],
  )
  const canAddNote = Boolean(noteWordId != null && noteStoryId && !isLessonContext)

  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [noteSaving, setNoteSaving] = useState(false)

  useEffect(() => {
    if (noteSaving && !annotationPending) {
      setNoteSaving(false)
      setNoteModalOpen(false)
      setEditingNote(null)
    }
  }, [annotationPending, noteSaving])

  const handleAddNote = () => {
    setEditingNote(null)
    setNoteModalOpen(true)
  }
  const handleEditNote = note => {
    setEditingNote(note)
    setNoteModalOpen(true)
  }
  const handleSubmitNote = (text, isPublic) => {
    if (!canAddNote) return
    const startId = editingNote ? editingNote.startId : noteWordId
    const endId = editingNote ? editingNote.endId : noteWordId
    setNoteSaving(true)
    dispatch(
      addEditStoryAnnotation(
        publicStory,
        isPublic,
        noteStoryId,
        startId,
        endId,
        text,
        noteMode,
        'None',
        '',
        editingNote?.threadId,
      ),
    )
  }
  const requestDeleteNote = note => {
    setNoteToDelete(note)
    setConfirmDeleteOpen(true)
  }
  const confirmDeleteNote = () => {
    if (!noteToDelete) return
    dispatch(
      removeStoryAnnotation(
        noteStoryId,
        noteToDelete.startId,
        noteToDelete.endId,
        noteMode,
        noteToDelete.threadId,
      ),
    )
    setNoteToDelete(null)
  }

  useEffect(() => {
    dispatch(setHelperSidebarOpen(true))
  }, [helperActiveTab, currentWord, translationState])

  useEffect(() => {
    dispatch(setHelperSidebarTab(null))
    dispatch(clearNotes())
  }, [dispatch, snippets.focused])

  useEffect(() => {
    dispatch(clearNotes())
  }, [dispatch, currentWord?.ID])

  useEffect(() => {
    if (inWordNestModal || wordNestModalOpen) return

    if (focusedWord && focusedWord.lemmas && learningLanguage) {
      dispatch(
        getWordNestAction({
          words: focusedWord.lemmas,
          language: learningLanguage,
        }),
      )
    }
  }, [focusedWord, dispatch, learningLanguage, inWordNestModal, wordNestModalOpen])

  useEffect(() => {
    if (inWordNestModal || wordNestModalOpen) return
    const lemmasForNest = Array.isArray(translationState?.data)
      ? translationState.data
          .map(t => t?.lemma)
          .filter(Boolean)
          .join('+')
      : translation?.lemma

    if (lemmasForNest && learningLanguage) {
      dispatch(
        getWordNestAction({
          words: lemmasForNest,
          language: learningLanguage,
        }),
      )
    }
  }, [
    translationState?.data,
    translation,
    dispatch,
    learningLanguage,
    inWordNestModal,
    wordNestModalOpen,
  ])

  useEffect(() => {
    const surface = translationState.surface || translationState.surfaceWord
    const exerciseSurface = currentWord?.surface || currentWord?.base

    if (isValidExercise) {
      setValidToChat(true)
    } else if (surface && surface !== exerciseSurface) {
      setValidToChat(false)
    }
  }, [translationState.surface, translationState.surfaceWord, currentWord, isValidExercise])

  useEffect(() => {
    const { listen, speak, hints, requested_hints: requestedBEHints } = currentWord || {}

    if (currentWord && Object.keys(currentWord).length && !listen && !speak) {
      let totalRequestedHints = []
      const { requestedHintsList } = currentAnswers[`${currentWord.ID}-${currentWord.id}`] || {}

      totalRequestedHints = requestedBEHints || []
      totalRequestedHints = totalRequestedHints.concat(
        (requestedHintsList || []).filter(hint => !totalRequestedHints.includes(hint)),
      )

      setEloScoreHearts(
        Array.from(
          { length: hints ? hints.filter(hint => !totalRequestedHints.includes(hint)).length : 0 },
          (_, i) => i + 1,
        ),
      )
      setSpentHints(
        Array.from({ length: requestedHintsList ? requestedHintsList.length : 0 }, (_, i) => i + 1),
      )

      if (attempt !== 0) {
        setFilteredHintsList(hints || [])
        setPreHints(totalRequestedHints)
      } else {
        setFilteredHintsList(
          hints?.filter(hint => !hints[0]?.message || hint.easy !== hints[0].message.easy),
        )
        setPreHints(totalRequestedHints)
      }
    } else {
      setEloScoreHearts([])
      setSpentHints([])
      setPreHints([])
      setFilteredHintsList([])
    }
  }, [currentWord, attempt])

  useEffect(() => {
    if (currentWord && Object.keys(currentWord).length) {
      const { ID: wordId } = currentWord
      let word_chat_history = []
      if (
        chat_history &&
        typeof wordId !== 'undefined' &&
        chat_history.hasOwnProperty(wordId.toString())
      ) {
        word_chat_history = chat_history[wordId.toString()]
      }
      dispatch(setConversationHistory(word_chat_history))
    }
  }, [currentWord, chat_history, dispatch])

  useEffect(() => {
    const wordId = translationState?.word_id || translationState?.wordId || null
    if (typeof wordId === 'undefined' || wordId === null) {
      // No translation word id — clear conversation
      dispatch(setConversationHistory([]))
      return
    }
    let word_chat_history = []
    if (chat_history && chat_history.hasOwnProperty(wordId.toString())) {
      word_chat_history = chat_history[wordId.toString()] || []
    }
    dispatch(setConversationHistory(word_chat_history))
  }, [translationState?.word_id, translationState?.surfaceWord, chat_history, dispatch])

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleKnowningClick = lemma => {
    const answerDetails = {
      correct: true,
      answer: null,
      exercise: 'knowing',
      hints_shown: 0,
      mode: 'trans',
      lemma,
    }
    dispatch(recordFlashcardAnswer(learningLanguage, dictionaryLanguage, answerDetails))
    dispatch(changeTranslationStageAction(lemma, learningLanguage, dictionaryLanguage, 4))
  }

  const handleNotKnowningClick = lemma => {
    const answerDetails = {
      correct: false,
      answer: null,
      exercise: 'knowing',
      hints_shown: 0,
      mode: 'trans',
      lemma,
    }
    dispatch(recordFlashcardAnswer(learningLanguage, dictionaryLanguage, answerDetails))
    dispatch(changeTranslationStageAction(lemma, learningLanguage, dictionaryLanguage, 0))
  }

  const handleHintRequest = newHintList => {
    const newRequestNum = preHints.length + 1
    const penalties = newHintList?.filter(hint => hint.penalty).map(hint => hint.penalty)
    dispatch(
      incrementHintRequests(
        `${currentWord.ID}-${currentWord.id}`,
        newRequestNum,
        newHintList,
        penalties,
      ),
    )
    setSpentHints(prev => [...prev, prev.length + 1])
    setEloScoreHearts(prev => prev.slice(0, -1))
    setHintMessageIdx(messages.length > 0 ? messages.length : 0)
  }

  const handleShowHint = () => {
    const { hints, requested_hints: requestedBEHints } = currentWord || {}
    let totalRequestedHints = requestedBEHints || []
    const { requestedHintsList } = currentAnswers[`${currentWord.ID}-${currentWord.id}`] || {}
    totalRequestedHints = totalRequestedHints.concat(
      (requestedHintsList || []).filter(hint => !totalRequestedHints.includes(hint)),
    )

    if (
      (!hints && !preHints) ||
      (filteredHintsList.length < 1 && preHints.length < 1) ||
      hints?.length < 1
    ) {
      setEmptyHintsList(true)
      handleHintRequest()
    } else {
      const newHintList = preHints.concat(
        filteredHintsList[preHints.length - (requestedBEHints || []).length],
      )
      setPreHints(newHintList)
      handleHintRequest(newHintList)
    }
  }

  const targetLangName = dictionaryLanguage
    ? intl.formatMessage({ id: dictionaryLanguage, defaultMessage: dictionaryLanguage })
    : ''

  const handleGetTranslation = () => {
    if (currentWord && currentWord.lemmas) {
      dispatch(
        setWords({
          surface: currentWord.surface,
          lemmas: currentWord.lemmas,
        }),
      )

      dispatch(
        getTranslationAction({
          learningLanguage,
          wordLemmas: currentWord.translation_lemmas || currentWord.lemmas,
          bases: currentWord.bases,
          dictionaryLanguage,
          storyId: currentWord.story_id,
          wordId: currentWord.ID,
          inflectionRef: currentWord.inflection_ref,
          prefLemma: currentWord.pref_lemma,
        }),
      )
    }
  }

  const handleTooltipClick = hint => {
    if (!hint) return

    if (hint.ref?.length) {
      dispatch(setReferences({ [hint.keyword || hint.easy]: hint.ref }))
    }

    if (hint.explanation?.length || hint.meta !== hint.easy) {
      dispatch(
        setExplanation({
          [hint.keyword || hint.easy]: (hint.easy === hint.meta && hint.explanation) || [
            hint.meta,
            ...(hint.explanation || []),
          ],
        }),
      )
    }

    if (hint.example?.length) {
      dispatch(setExample({ [hint.keyword || hint.easy]: hint.example }))
    }
  }

  const handleMessageSubmit = event => {
    event?.preventDefault()
    const source =
      helperActiveTab === 'exercise' && currentWord && Object.keys(currentWord).length > 0
        ? currentWord
        : translationState || {}

    const wordId = source.ID ?? source.word_id ?? null
    const sentence_id = source.sentence_id ?? null
    const snippet_id = source.snippet_id ?? null
    const choices = source.choices || []
    const wordHints = source.hints || []

    if ((!wordId || !snippet_id || !sentence_id) && currentMessage.trim() === '') {
      return
    }

    dispatch(
      getPracticeChatbotResponse(
        session_id,
        storyid,
        snippet_id,
        sentence_id,
        wordId,
        currentMessage.trim(),
        '',
        composeExerciseContext(snippets.focused?.practice_snippet || [], currentWord),
        (wordHints || []).map(hint => hint.easy),
      ),
    )
    setCurrentMessage('')
  }

  const hasHints = currentWord?.hints?.length > 0 && validToChat
  const showAllHintsUsed = eloScoreHearts.length === 0 && spentHints.length > 0

  const currentLemmas = currentWord?.lemmas?.split('|') || []
  const isCurrentWordTranslated =
    (translationState.surfaceWord || translationState.surface) === currentWord?.surface &&
    !translationState.pending &&
    translationState.data?.some(item => currentLemmas.includes(item.lemma))

  const getLemmaCandidates = lemmaOrLemmas => {
    if (!lemmaOrLemmas || typeof lemmaOrLemmas !== 'string') return []

    const raw = lemmaOrLemmas.trim()
    const split = raw
      .split('|')
      .map(l => l.trim())
      .filter(Boolean)

    // Some backends may key the response by the full string (e.g. "a|b"),
    // others by each lemma. Check both.
    return [...new Set([raw, ...split])]
  }

  const getNestListForLemma = lemma => {
    if (!lemma) return []
    // Word Nest buttons must be backed by data for this exact lemma. An array can
    // be stale data from a different modal context, so it must not enable a button.
    const nest = Array.isArray(words) ? undefined : words?.[lemma]
    return Array.isArray(nest) ? nest : []
  }

  const isWordNestAvailableForLemma = lemmaOrLemmas => {
    if (inWordNestModal || clue) return false
    if (!(learningLanguage === 'Russian' || learningLanguage === 'Finnish')) return false

    const candidates = getLemmaCandidates(lemmaOrLemmas)
    if (!candidates.length) return false

    return candidates.some(lemma => getNestListForLemma(lemma).length > 0)
  }

  const bestWordNestLemma = lemmaOrLemmas => {
    const candidates = getLemmaCandidates(lemmaOrLemmas)
    if (!candidates.length) return ''

    // Prefer one that we already have nest data for (so the action menu appears reliably)
    const withData = candidates.find(lemma => getNestListForLemma(lemma).length > 0)
    return withData || candidates[0]
  }

  const exerciseWordNestLemma = bestWordNestLemma(
    currentWord?.translation_lemmas || currentWord?.lemmas,
  )
  const dictionaryWordNestLemma = bestWordNestLemma(
    translation?.lemma || translationState.data?.[0]?.lemma || translationState.surfaceWord,
  )

  const showWordNestOption = isWordNestAvailableForLemma(exerciseWordNestLemma)
  const showWordNestOptionDictionary = isWordNestAvailableForLemma(dictionaryWordNestLemma)

  const computeWordNestRestoreWord = () => {
    // Prefer restoring from the currently displayed translation cards.
    const data = translationState?.data
    if (Array.isArray(data) && data.length > 0) {
      const joined = data
        .map(t => t?.lemma)
        .filter(Boolean)
        .join('+')
      if (joined) return joined
    }

    // Fall back to lemma strings stored in translation state / current word.
    return (
      translationState?.lemmas ||
      currentWord?.translation_lemmas ||
      currentWord?.lemmas ||
      translationState?.surfaceWord ||
      ''
    )
  }

  const openWordNest = lemma => {
    setWordNestRestoreWord(computeWordNestRestoreWord())
    setWordNestRestorePrefLemma(
      translationState?.data?.find(translated => translated?.preferred)?.lemma || '',
    )
    setWordNestChosenWord(lemma)
    setWordNestModalOpen(true)
  }

  const prevId = useRef(currentWord?.ID)
  const prevTransKey = useRef(translationState?.surfaceWord || translationState?.lemmas || '')

  useEffect(() => {
    const currentId = currentWord?.ID
    const transKey = translationState?.surfaceWord || translationState?.lemmas || ''
    const idChanged = typeof prevId.current !== 'undefined' && currentId !== prevId.current
    const transChanged =
      typeof prevTransKey.current !== 'undefined' && transKey !== prevTransKey.current
    if (idChanged || transChanged) {
      dispatch({ type: 'CLEAR_CONTEXT_TRANSLATION' })
      setShowContextTranslation(false)
    }
    prevId.current = currentId
    prevTransKey.current = transKey
  }, [currentWord?.ID, translationState.surfaceWord, translationState.lemmas, dispatch])

  useEffect(() => {
    if (currentWord && Object.keys(currentWord).length) {
      const { users_answer } = currentAnswers[`${currentWord.ID}-${currentWord.id}`] || {}

      const predefinedChatbotMsg = [
        'chatbot-message-suggestion-answer-wrong-reason',
        'chatbot-message-suggestion-analyze-context',
      ]

      const requests = predefinedChatbotMsg.map(id => ({
        msgId: id,
        func: getPracticeChatbotResponse(
          session_id,
          storyid,
          currentWord.snippet_id,
          currentWord.sentence_id,
          currentWord.ID,
          intl.formatMessage({ id }).trim(),
          users_answer?.trim() || '',
          composeExerciseContext(snippets.focused?.practice_snippet || [], currentWord),
          (currentWord.hints || []).map(hint => hint.easy),
        ),
      }))

      setPredefinedChatbotRequests(requests)
    } else {
      setPredefinedChatbotRequests([])
    }
  }, [currentWord, currentAnswers, session_id, storyid, intl])

  const glossCheckLanguage = ['English']

  const highlightTarget = translation => {
    if (
      !translation ||
      !translation['source-segments'] ||
      !translation['target-segments'] ||
      !translation['alignment']
    )
      return ''
    const surface = translationState.surfaceWord || currentWord?.surface || ''

    const translated_glosses = (translationState.data || [])
      .map(t => t.glosses || [])
      .flat()
      .map(g => g.toLowerCase())
    const glosses = glossCheckLanguage.includes(dictionaryLanguage)
      ? [
          ...translated_glosses,
          ...translated_glosses
            .map(
              gloss =>
                (gloss.includes(' ') && [
                  gloss,
                  ...gloss.split(' '),
                  ...gloss.split(' ').map(g => lemmatizer(g)),
                ]) || [lemmatizer(gloss)],
            )
            .flat(),
        ]
      : [
          ...translated_glosses,
          ...translated_glosses
            .filter(gloss => gloss.includes(' '))
            .map(gloss => gloss.split(' '))
            .flat(),
        ]

    const glossCheck = p =>
      !glossCheckLanguage.includes(dictionaryLanguage) ||
      glosses.includes(p.trim().toLowerCase()) ||
      glosses.includes(lemmatizer(p.trim().toLowerCase()))

    const targetSents = []
    const targetSentIds = new Set()

    for (let sentId in translation['source-segments']) {
      const sourceIds = []
      let target = ''
      let p = ''
      let q = []

      const srcSegments = translation['source-segments'][sentId]
      for (let s in srcSegments) {
        const segment = srcSegments[s]
        if (!segment) continue
        const first = segment[0]
        if (
          first === '▁' ||
          (typeof first === 'string' && first.toLowerCase() === first.toUpperCase())
        ) {
          if (p.length && p === surface) sourceIds.push(...q)
          p = segment.replace('▁', '')
          q = [s]
        } else {
          p += segment
          q.push(s)
        }
      }
      if (p.length && p === surface) sourceIds.push(...q)

      // get target ids
      let targetIds = []
      try {
        targetIds = sourceIds
          .map(s => translation['alignment'][sentId] && translation['alignment'][sentId][s])
          .flat()
          .filter(x => typeof x !== 'undefined')
      } catch (e) {
        targetIds = []
      }

      // build target string
      p = ''
      q = []
      const tgtSegments = translation['target-segments'][sentId]
      for (let s in tgtSegments) {
        const segment = tgtSegments[s]
        if (!segment) continue
        const first = segment[0]
        if (
          first === '▁' ||
          (typeof first === 'string' && first.toLowerCase() === first.toUpperCase())
        ) {
          if (p.trim().length && targetIds.filter(x => q.includes(x)).length && glossCheck(p)) {
            target += '<b>' + p + '</b>'
            targetSentIds.add(sentId)
          } else target += p
          p = segment.replace('▁', ' ')
          q = [s]
        } else {
          p += segment
          q.push(s)
        }
      }

      if (p.length && targetIds.filter(x => q.includes(x)).length && glossCheck(p)) {
        target += '<b>' + p + '</b>'
        targetSentIds.add(sentId)
      } else target += p

      targetSents.push(target.trim())
    }

    if (targetSentIds.size) {
      return [...targetSentIds]
        .sort()
        .map(sentId => targetSents[sentId])
        .join(' ')
    }
    return targetSents.join(' ')
  }

  const renderContextTranslationContent = () => {
    const d = contextTranslationState.data
    if (!d) return null
    const renderHtml = html => (
      <ChatBubble variant="note">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </ChatBubble>
    )

    if (typeof d === 'string') return renderHtml(d)
    // Prefer alignment-based highlight when available
    if (d['alignment'] && d['source-segments'] && d['target-segments']) {
      const html = highlightTarget(d)
      return renderHtml(html)
    }
    if (d.translation) return renderHtml(d.translation)
    if (d['target-sentences'])
      return (
        <ChatBubble variant="note">
          {d['target-sentences'].map((s, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: s }} />
          ))}
        </ChatBubble>
      )
    return (
      <ChatBubble variant="note">
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(d, null, 2)}</pre>
      </ChatBubble>
    )
  }

  return (
    <div className="combined-chatbot">
      {(learningLanguage === 'Russian' || learningLanguage === 'Finnish') && (
        <WordNestModal
          wordToCheck={wordNestChosenWord}
          setWordToCheck={setWordNestChosenWord}
          open={wordNestModalOpen}
          setOpen={setWordNestModalOpen}
          storyWord={
            wordNestRestoreWord ||
            translationState.lemmas ||
            translationState.surfaceWord ||
            currentWord?.lemmas ||
            currentWord?.surface
          }
          prefLemma={wordNestRestorePrefLemma}
        />
      )}

      <NoteFormModal
        open={noteModalOpen}
        onClose={() => {
          setNoteModalOpen(false)
          setEditingNote(null)
        }}
        onSubmit={handleSubmitNote}
        initialText={editingNote?.text || ''}
        initialPublic={editingNote?.isPublic || false}
        isEdit={Boolean(editingNote)}
        loading={noteSaving}
        canMakePublic={canMakePublic}
      />
      <ConfirmationWarning
        open={confirmDeleteOpen}
        setOpen={setConfirmDeleteOpen}
        action={confirmDeleteNote}
      >
        <FormattedMessage id="annotation-remove-confirm" />
      </ConfirmationWarning>

      <div className="ai-assistant-header">
        <h3 className="ai-header-title">Vita - AI Assistant</h3>
        <AssistentSettings className="settings-icon" />
      </div>

      {currentWord &&
        isEmpty(currentWord) &&
        translationState &&
        isEmpty(translationState.data) &&
        isEmpty(translationState.surfaceWord) && (
          <div className="first-message">
            <ChatBubble variant="bot" data-cy="dictionary-info">
              <FormattedMessage id="chatbox-initial-instruction" />
            </ChatBubble>
          </div>
        )}
      {/* Exercise block */}
      {helperActiveTab === 'exercise' && (
        <div className="chatbot-content">
          <div className="chatbot-header">
            <div>
              <CustomTooltip
                title={
                  <span style={{ whiteSpace: 'nowrap' }}>
                    <FormattedMessage id="translation-to" defaultMessage="Translation to" />{' '}
                    {targetLangName}
                  </span>
                }
                placement="top"
                permanent
              >
                <button
                  type="button"
                  className="translation-button"
                  onClick={handleGetTranslation}
                  data-cy="chatbot-translation-button"
                >
                  {/* Green circular translate icon — same as the story-title translate button. */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '1.7rem',
                      height: '1.7rem',
                      borderRadius: '50%',
                      backgroundColor: colors.green,
                    }}
                  >
                    <img
                      src={images.translate}
                      alt=""
                      style={{ width: '1rem', height: '1rem', display: 'block' }}
                    />
                  </span>
                </button>
              </CustomTooltip>
            </div>
            <div style={{ flex: 1 }}>
              <h4 className="current-word">
                {currentWord.choices?.length ? currentWord.choices.join('/') : currentWord.base}
              </h4>
            </div>
            <div>
              <ChatActionMenu
                handleShowHint={handleShowHint}
                onAddNote={canAddNote ? handleAddNote : undefined}
                hasHints={hasHints}
                showAllHintsUsed={showAllHintsUsed}
                handleShowWordNest={() => openWordNest(exerciseWordNestLemma)}
                showWordNestOption={showWordNestOption}
                lemma={exerciseWordNestLemma}
                wordNestChosenWord={wordNestChosenWord}
                setWordNestChosenWord={setWordNestChosenWord}
                wordNestModalOpen={wordNestModalOpen}
                setWordNestModalOpen={setWordNestModalOpen}
                storyWord={translationState.surfaceWord || currentWord?.surface}
                popupMessageId="explain-wordnest-modal"
                setShowContextTranslation={setShowContextTranslation}
                showContexTranslation={showContexTranslation}
                predefinedChatbotRequests={predefinedChatbotRequests}
                validToChat={validToChat}
              />
            </div>
          </div>

          <div className="chatbot-messages-container">
            {isLoadingHistory ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Spinner inline />
              </div>
            ) : (
              <>
                {!isEmpty(currentWord.frozen_messages) && (
                  <ChatBubble
                    variant="hint"
                    className="message-hint"
                    data-cy="chatbot-frozen-hint-message"
                  >
                    <div className="hint-item">
                      <img src={images.bulb} className="hint-bulb" alt="" width="20" height="20" />
                      <span
                        dangerouslySetInnerHTML={formatGreenFeedbackText(
                          currentWord.frozen_messages[0],
                        )}
                      />
                    </div>
                  </ChatBubble>
                )}

                {messages.length === 0 && spentHints.length === 0 && !emptyHintsList && (
                  <div className="message message-bot" data-cy="chatbot-action-menu-instruction">
                    <FormattedMessage
                      id="click-to-action-menu"
                      defaultMessage="{icon} Click the menu for more options"
                      values={{
                        icon: <MoreVertIcon fontSize="small" style={{ verticalAlign: 'middle' }} />,
                      }}
                    />
                  </div>
                )}
                {isCurrentWordTranslated && (
                  <>
                    {translationState.pending ? (
                      <div className="message message-bot">
                        <span className="loading-text">Loading translation...</span>
                      </div>
                    ) : (
                      translationState.data?.map((translated, idx) => (
                        <AppLemma
                          key={translated.URL || translated.lemma || idx}
                          lemma={translated.lemma}
                          lemmaHref={translated.user_URL}
                          translations={translated.glosses}
                          speaker={<Speaker word={translated.lemma} />}
                          onKnow={
                            translated.preferred
                              ? () => handleKnowningClick(translated.lemma)
                              : undefined
                          }
                          onDontKnow={
                            translated.preferred
                              ? () => handleNotKnowningClick(translated.lemma)
                              : undefined
                          }
                          dictionaryHref={translated.ref?.url || translated.user_URL}
                          showInflactionLink={translationState.data.length < 3 || idx > 0}
                          onWordNest={
                            isWordNestAvailableForLemma(translated.lemma)
                              ? () => openWordNest(bestWordNestLemma(translated.lemma))
                              : undefined
                          }
                          background={
                            translated.stage !== undefined
                              ? `${flashcardColors.background[translated.stage]}4D`
                              : undefined
                          }
                          style={{ marginBottom: '8px' }}
                        />
                      ))
                    )}
                  </>
                )}
                {(showContexTranslation || contextTranslationState.visible) && (
                  <div className="context-translation-box">
                    {contextTranslationState.pending ? (
                      <Spinner inline />
                    ) : contextTranslationState.data ? (
                      renderContextTranslationContent()
                    ) : window?.location?.hostname === 'localhost' ||
                      window?.location?.hostname === '127.0.0.1' ? (
                      <ChatBubble variant="note">
                        <p>
                          {contextTranslationState.lastTrans || translationState.surfaceWord || ''}
                        </p>
                      </ChatBubble>
                    ) : null}
                  </div>
                )}

                {hintMessageIdx === 0 && (spentHints.length > 0 || emptyHintsList) && (
                  <>
                    {currentWord.hint2penalty && attempt === 0 && (
                      <ChatBubble
                        variant="hint"
                        className="message-hint"
                        data-cy="chatbot-hint2penalty-message"
                      >
                        <div className="hint-item">
                          <img
                            src={images.bulb}
                            className="hint-bulb"
                            alt=""
                            width="20"
                            height="20"
                          />
                          <span
                            dangerouslySetInnerHTML={formatGreenFeedbackText(
                              currentWord.hint2penalty.easy,
                            )}
                          />
                          {(currentWord.hint2penalty.ref?.length ||
                            currentWord.hint2penalty.explanation?.length) && (
                            <InfoOutlinedIcon
                              fontSize="small"
                              className="hint-info-icon"
                              onMouseDown={() => handleTooltipClick(currentWord.hint2penalty)}
                              data-cy="chatbot-hint2penalty-info-icon"
                            />
                          )}
                        </div>
                      </ChatBubble>
                    )}

                    {preHints?.map((hint, index) => (
                      <ChatBubble
                        key={index}
                        variant="hint"
                        className="message-hint"
                        data-cy="chatbot-hint-message"
                      >
                        <div className="hint-item">
                          <img
                            src={images.bulb}
                            className="hint-bulb"
                            alt=""
                            width="20"
                            height="20"
                          />
                          <span dangerouslySetInnerHTML={formatGreenFeedbackText(hint.easy)} />
                          {(hint.ref?.length ||
                            hint.explanation?.length ||
                            hint.meta !== hint.easy) && (
                            <InfoOutlinedIcon
                              fontSize="small"
                              className="hint-info-icon"
                              onMouseDown={() => handleTooltipClick(hint)}
                              data-cy="chatbot-hint-info-icon"
                            />
                          )}
                        </div>
                      </ChatBubble>
                    ))}
                  </>
                )}

                {/* Chat Messages */}
                {messages.map((message, index) => (
                  <ChatBubble
                    ref={index === messages.length - 1 ? latestMessageRef : null}
                    key={index}
                    variant={message.type === 'user' ? 'user' : 'bot'}
                  >
                    {message.text ? (
                      <ReactMarkdown children={message.text} />
                    ) : (
                      <FormattedMessage id="Error rendering message" />
                    )}
                  </ChatBubble>
                ))}

                {/* Hint Messages (after first attempt) */}
                {hintMessageIdx > 0 && (spentHints.length > 0 || emptyHintsList) && (
                  <>
                    {currentWord.hint2penalty && attempt === 0 && (
                      <ChatBubble
                        variant="hint"
                        className="message-hint"
                        data-cy="chatbot-hint2penalty-message-after-chat"
                      >
                        <div className="hint-item">
                          <img
                            src={images.bulb}
                            className="hint-bulb"
                            alt=""
                            width="20"
                            height="20"
                          />
                          <span
                            dangerouslySetInnerHTML={formatGreenFeedbackText(
                              currentWord.hint2penalty.easy,
                            )}
                          />
                          {(currentWord.hint2penalty.ref?.length ||
                            currentWord.hint2penalty.explanation?.length) && (
                            <InfoOutlinedIcon
                              fontSize="small"
                              className="hint-info-icon"
                              onMouseDown={() => handleTooltipClick(currentWord.hint2penalty)}
                              data-cy="chatbot-hint2penalty-info-icon-after-chat"
                            />
                          )}
                        </div>
                      </ChatBubble>
                    )}
                    {preHints?.map((hint, index) => (
                      <ChatBubble
                        key={index}
                        variant="hint"
                        className="message-hint"
                        data-cy="chatbot-hint-message-after-chat"
                      >
                        <div className="hint-item">
                          <img
                            src={images.bulb}
                            className="hint-bulb"
                            alt=""
                            width="20"
                            height="20"
                          />
                          <span dangerouslySetInnerHTML={formatGreenFeedbackText(hint.easy)} />
                          {(hint.ref?.length ||
                            hint.explanation?.length ||
                            hint.meta !== hint.easy) && (
                            <InfoOutlinedIcon
                              fontSize="small"
                              className="hint-info-icon"
                              onMouseDown={() => handleTooltipClick(hint)}
                              data-cy="chatbot-hint-info-icon-after-chat"
                            />
                          )}
                        </div>
                      </ChatBubble>
                    ))}
                  </>
                )}

                {isWaitingForResponse && (
                  <div className="message message-bot">
                    <Spinner inline />
                  </div>
                )}
              </>
            )}
            <UserNotes
              notes={wordNotesList}
              onEdit={handleEditNote}
              onDelete={requestDeleteNote}
              busy={annotationPending && !noteModalOpen}
            />
          </div>
          <div className="chatbot-input-area">
            {showAllHintsUsed || !hasHints ? (
              <>
                <ChatInput
                  value={currentMessage}
                  onChange={setCurrentMessage}
                  onSubmit={handleMessageSubmit}
                  placeholder={intl.formatMessage({ id: 'enter-question-to-chatbot' })}
                  disabled={!validToChat || isWaitingForResponse}
                />
                <ChatbotSuggestions
                  predefinedChatbotRequests={[]}
                  disabled={!validToChat || isWaitingForResponse}
                />
              </>
            ) : (
              <div className="hint-request-container">
                <CustomTooltip
                  title={
                    <span style={{ whiteSpace: 'nowrap' }}>
                      <FormattedMessage
                        id="you-have-N-hints-left"
                        defaultMessage="You have {count} hints left."
                        values={{ count: eloScoreHearts.length }}
                      />
                    </span>
                  }
                  placement="top"
                  permanent
                >
                  <div
                    className="bulbs-container"
                    onClick={showAllHintsUsed ? undefined : handleShowHint}
                    style={{ cursor: showAllHintsUsed ? 'default' : 'pointer' }}
                    role="button"
                    tabIndex={0}
                    data-cy="chatbot-hint-bulbs"
                    onKeyDown={e => {
                      if ((e.key === 'Enter' || e.key === ' ') && !showAllHintsUsed) {
                        e.preventDefault()
                        handleShowHint()
                      }
                    }}
                  >
                    {eloScoreHearts.map(heart => (
                      <img
                        key={`lit-${heart}`}
                        src={images.bulb}
                        alt=""
                        width="22"
                        height="22"
                        style={{ display: 'block' }}
                      />
                    ))}
                    {spentHints.map(hint => (
                      <img
                        key={`spent-${hint}`}
                        src={images.bulbEmpty}
                        alt=""
                        width="22"
                        height="22"
                        style={{ display: 'block' }}
                      />
                    ))}
                  </div>
                </CustomTooltip>
                <CustomTooltip
                  title={
                    <span style={{ whiteSpace: 'nowrap' }}>
                      <FormattedMessage
                        id="you-have-N-hints-left"
                        defaultMessage="You have {count} hints left."
                        values={{ count: eloScoreHearts.length }}
                      />
                    </span>
                  }
                  placement="top"
                  permanent
                >
                  <span style={{ display: 'inline-flex' }}>
                    <AppButton
                      variant="primary"
                      size="sm"
                      disabled={showAllHintsUsed}
                      onClick={showAllHintsUsed ? undefined : handleShowHint}
                      data-cy="chatbot-show-hint-text"
                    >
                      <FormattedMessage id="ask-for-a-hint" defaultMessage="Show Hint" />
                    </AppButton>
                  </span>
                </CustomTooltip>
              </div>
            )}
          </div>
        </div>
      )}

      {helperActiveTab === 'translation' && (
        <div className="dictionary-content" data-cy="dictionary-help">
          {translationState.pending ? (
            <div style={{ padding: '1em' }}>
              <div className="flex space-between" style={{ marginBottom: '1em' }}>
                <div style={{ height: '10px', width: '80px' }}>
                  <Skeleton variant="text" />
                </div>
              </div>
              {[1, 2, 3].map(line => (
                <div key={line} style={{ marginBottom: '1em' }}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="50%" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {translationState.surfaceWord && (
                <div
                  className="chatbot-header"
                  style={{
                    marginBottom: '1em',
                    paddingBottom: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <h4
                    className="current-word"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1,
                      minWidth: 0,
                      width: 'auto',
                    }}
                  >
                    {translationState.surfaceWord &&
                      translationState.surfaceWord !== translationState.data?.[0]?.lemma && (
                        <CustomTooltip
                          title={<FormattedHTMLMessage id="explain-speaker-surface" />}
                        >
                          <span style={{ display: 'inline-flex', flexShrink: 0 }}>
                            <Speaker word={translationState.surfaceWord} />
                          </span>
                        </CustomTooltip>
                      )}
                    <span
                      style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {translationState.maskSymbol || translationState.surfaceWord}
                    </span>
                  </h4>
                  <ChatActionMenu
                    mode="dictionary"
                    onAddNote={canAddNote ? handleAddNote : undefined}
                    handleShowWordNest={() => openWordNest(dictionaryWordNestLemma)}
                    showWordNestOption={showWordNestOptionDictionary}
                    lemma={dictionaryWordNestLemma}
                    wordNestChosenWord={wordNestChosenWord}
                    setWordNestChosenWord={setWordNestChosenWord}
                    wordNestModalOpen={wordNestModalOpen}
                    setWordNestModalOpen={setWordNestModalOpen}
                    storyWord={translationState.surfaceWord || currentWord?.surface}
                    popupMessageId="explain-wordnest-modal"
                    buttonStyle={{ background: 'none', marginTop: '0.5rem' }}
                    setShowContextTranslation={setShowContextTranslation}
                  />
                </div>
              )}
              <div className="inline-translation" data-cy="translations">
                {/* Translation Results */}

                {translationState.data && translationState.data.length > 0 ? (
                  translationState.data.map((translated, idx) => (
                    <AppLemma
                      key={translated.URL || translated.lemma || idx}
                      lemma={translated.lemma}
                      lemmaHref={translated.user_URL}
                      translations={translated.glosses}
                      speaker={<Speaker word={translated.lemma} />}
                      onKnow={
                        translated.preferred
                          ? () => handleKnowningClick(translated.lemma)
                          : undefined
                      }
                      onDontKnow={
                        translated.preferred
                          ? () => handleNotKnowningClick(translated.lemma)
                          : undefined
                      }
                      dictionaryHref={translated.ref?.url || translated.user_URL}
                      showInflactionLink={translationState.data.length < 3 || idx > 0}
                      onWordNest={
                        isWordNestAvailableForLemma(translated.lemma)
                          ? () => openWordNest(bestWordNestLemma(translated.lemma))
                          : undefined
                      }
                      background={
                        translated.stage !== undefined
                          ? `${flashcardColors.background[translated.stage]}4D`
                          : undefined
                      }
                      style={{ marginBottom: '8px' }}
                    />
                  ))
                ) : (
                  <p className="no-translation-text" data-cy="chatbot-no-translation-text"></p>
                )}
              </div>
              <div className="chatbot-messages-container">
                <WordNotes notes={notes} handleTooltipClick={handleTooltipClick} />
                <UserNotes
                  notes={wordNotesList}
                  onEdit={handleEditNote}
                  onDelete={requestDeleteNote}
                  busy={annotationPending && !noteModalOpen}
                />
                {isLoadingHistory ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <Spinner inline />
                  </div>
                ) : (
                  <>
                    {/* Chat Messages */}
                    {messages.map((message, index) => (
                      <ChatBubble
                        ref={index === messages.length - 1 ? latestMessageRef : null}
                        key={index}
                        variant={message.type === 'user' ? 'user' : 'bot'}
                      >
                        {message.text ? (
                          <ReactMarkdown children={message.text} />
                        ) : (
                          <FormattedMessage id="Error rendering message" />
                        )}
                      </ChatBubble>
                    ))}

                    {isWaitingForResponse && (
                      <div className="message message-bot">
                        <Spinner inline />
                      </div>
                    )}
                  </>
                )}
                {(showContexTranslation || contextTranslationState.visible) && (
                  <div className="context-translation-box">
                    {contextTranslationState.pending ? (
                      <Spinner inline />
                    ) : contextTranslationState.data ? (
                      renderContextTranslationContent()
                    ) : window?.location?.hostname === 'localhost' ||
                      window?.location?.hostname === '127.0.0.1' ? (
                      <ChatBubble variant="note">
                        <p>
                          {contextTranslationState.lastTrans || translationState.surfaceWord || ''}
                        </p>
                      </ChatBubble>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="chatbot-input-area">
                {typeof helperActiveTab !== 'undefined' && (
                  <>
                    <ChatInput
                      value={currentMessage}
                      onChange={setCurrentMessage}
                      onSubmit={handleMessageSubmit}
                      placeholder={intl.formatMessage({ id: 'enter-question-to-chatbot' })}
                      disabled={isWaitingForResponse}
                    />
                    <ChatbotSuggestions
                      predefinedChatbotRequests={[]}
                      disabled={!validToChat || isWaitingForResponse}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CombinedChatbot
