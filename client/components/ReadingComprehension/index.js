import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { Box, Divider } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteIcon from '@mui/icons-material/Delete'
import { useIntl } from 'react-intl'
import Spinner from 'Components/Spinner'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppSelect from 'Components/ui/AppSelect'
import AppTabs from 'Components/ui/AppTabs'
import AppTextField from 'Components/ui/AppTextField'
import CustomTooltip from 'Components/CustomTooltip'
import { colors, font } from 'Assets/mui_theme/designTokens'
import HighlightedStoryText from 'Components/ReadingComprehension/HighlightedStoryText'
import ReadingComprehensionQuestion from './ReadingComprehensionQuestion'
import {
  generateMcQuestionsAction,
  regenerateOneMcQuestionAction,
  saveMcQuestionsAction,
  clearMcSavedAction,
  deleteMcQuestionsAction,
  clearMcDeletedAction,
  clearMcStateAction,
} from 'Utilities/redux/readingComprehensionReducer'
import {
  getAllStories,
  getStoryAction,
  getStoryReadingQuestionsAction,
} from 'Utilities/redux/storiesReducer'
import { learningLanguageSelector, getTextStyle, skillLevels, cefrNum2Cefr } from 'Utilities/common'
import './ReadingComprehension.css'

const signatureOf = q => {
  if (!q) return ''
  const question = q.question || ''
  const answer = q.answer || ''
  const choices = Array.isArray(q.choices) ? q.choices.join('||') : ''
  return `${question}__${choices}__${answer}`
}

const pickStoryQuestions = story => {
  if (!story) return []
  if (Array.isArray(story.questions)) return story.questions
  if (Array.isArray(story.q_and_a)) return story.q_and_a
  if (Array.isArray(story.reading_questions)) return story.reading_questions
  return []
}

const normalizeQuestion = q => {
  if (!q) return null
  if (q.question && (q.choices || q.answer)) {
    return {
      ...q,
      choices: Array.isArray(q.choices) ? q.choices : [],
    }
  }
  if (q.q) {
    return {
      ...q,
      question: q.q,
      answer: q.a,
      choices: Array.isArray(q.choices) ? q.choices : [],
      level: q.level,
    }
  }
  return null
}

const getStoryIdValue = story => {
  if (!story) return ''
  return String(story._id || story.id || story.story_id || story.storyid || '')
}

const normalizeStoryParagraphs = paragraph => {
  if (!Array.isArray(paragraph) || paragraph.length === 0) return []
  return Array.isArray(paragraph[0]) ? paragraph : [paragraph]
}

const paragraphToText = paragraph => {
  if (!Array.isArray(paragraph)) return ''
  return paragraph.map(token => token?.surface || '').join('')
}

const findAnswerParagraphIndex = (paragraphs, question) => {
  if (!Array.isArray(paragraphs) || paragraphs.length === 0 || !question) return -1

  const directParagraphIndex =
    question?.paragraph_index ??
    question?.paragraphIndex ??
    question?.answer_paragraph_index ??
    question?.answerParagraphIndex

  if (Number.isInteger(directParagraphIndex) && directParagraphIndex >= 0) {
    return Math.min(directParagraphIndex, paragraphs.length - 1)
  }

  const answer = String(question?.answer || '')
    .trim()
    .toLowerCase()
  if (!answer) return -1

  const paragraphTexts = paragraphs.map(paragraph => paragraphToText(paragraph).toLowerCase())
  return paragraphTexts.findIndex(text => text.includes(answer))
}

const getQuestionSentenceIds = (paragraphs, question) => {
  const rawSentenceIds =
    question?.sentence_ids ??
    question?.sentence_id ??
    question?.answer_sentence_ids ??
    question?.answer_sentence_id

  const directIds = (Array.isArray(rawSentenceIds) ? rawSentenceIds : [rawSentenceIds])
    .map(Number)
    .filter(Number.isFinite)

  if (directIds.length) return directIds

  const paragraphIdx = findAnswerParagraphIndex(paragraphs, question)
  if (paragraphIdx < 0) return []

  const tokens = Array.isArray(paragraphs[paragraphIdx]) ? paragraphs[paragraphIdx] : []
  return Array.from(
    new Set(tokens.map(token => Number(token?.sentence_id)).filter(Number.isFinite))
  )
}

const ReadingComprehensionView = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { storyId } = match.params

  const { story, lastQuery, focusedPending, readingQuestions, readingQuestionsPending } = useSelector(({ stories }) => ({
    story: stories.focused,
    lastQuery: stories.lastQuery,
    focusedPending: stories.focusedPending,
    readingQuestions: stories.readingQuestions,
    readingQuestionsPending: stories.readingQuestionsPending,
  }), shallowEqual)

  const {
    generated,
    pending: mcPending,
    savePending,
    savedQuestions,
    saved,
    error,
    regenPendingByIndex,
    deleted,
    deletePending,
  } = useSelector(state => {
    const slice = state.readingComprehension
    return (
      slice || {
        generated: [],
        pending: false,
        savePending: false,
        savedQuestions: null,
        saved: false,
        error: false,
        regenPendingByIndex: {},
        deleted: false,
        deletePending: false,
      }
    )
  })

  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const [level, setLevel] = useState('B1')
  const [size, setSize] = useState(4)

  const hasInitializedStoryQuestionsRef = useRef(false)
  const hasSeenPendingCycleRef = useRef(false)

  const [storyQuestions, setStoryQuestions] = useState([])
  const [draftQuestions, setDraftQuestions] = useState([])

  const [selectedDraftIdx, setSelectedDraftIdx] = useState(null)

  const [editing, setEditing] = useState(null)
  const [editValue, setEditValue] = useState('')

  const [selectedStoryQuestionIdx, setSelectedStoryQuestionIdx] = useState(null)

  // confirmDelete: { open: boolean, idx: number|null, type: 'draft'|'saved'|null }
  const [confirmDelete, setConfirmDelete] = useState({ open: false, idx: null, type: null })

  const [regenLocalByIndex, setRegenLocalByIndex] = useState({})
  const [prevSignatures, setPrevSignatures] = useState({})

  useEffect(() => {
    dispatch(clearMcStateAction())
    setStoryQuestions([])
    hasSeenPendingCycleRef.current = false
    setDraftQuestions([])
    setSelectedDraftIdx(null)
    setEditing(null)
    setEditValue('')
    setRegenLocalByIndex({})
    setPrevSignatures({})

    dispatch(getStoryAction(storyId, 'preview'))
    dispatch(getStoryReadingQuestionsAction(storyId))
    hasInitializedStoryQuestionsRef.current = false

    return () => {
      dispatch(clearMcStateAction())
    }
  }, [dispatch, storyId])

  useEffect(() => {
    if (focusedPending) {
      hasSeenPendingCycleRef.current = true
    }
  }, [focusedPending])

  useEffect(() => {
    if (readingQuestionsPending || !readingQuestions) return

    const qs = pickStoryQuestions(readingQuestions).map(normalizeQuestion).filter(Boolean)

    setStoryQuestions(qs)
    hasInitializedStoryQuestionsRef.current = true
  }, [readingQuestions, readingQuestionsPending])

  useEffect(() => {
    if (focusedPending) return
    if (!story) return
    if (hasInitializedStoryQuestionsRef.current) return
    if (!hasSeenPendingCycleRef.current) return
    if (readingQuestionsPending || readingQuestions) return

    const focusedStoryId = getStoryIdValue(story)
    if (focusedStoryId && focusedStoryId !== String(storyId)) return

    const qs = pickStoryQuestions(story).map(normalizeQuestion).filter(Boolean)

    setStoryQuestions(qs)
    hasInitializedStoryQuestionsRef.current = true
  }, [story, focusedPending, storyId, readingQuestions, readingQuestionsPending])

  useEffect(() => {
    if (!saved) return

    if (Array.isArray(savedQuestions)) {
      const qs = savedQuestions.map(normalizeQuestion).filter(Boolean)
      setStoryQuestions(qs)
      hasInitializedStoryQuestionsRef.current = true
    } else {
      hasInitializedStoryQuestionsRef.current = false
    }

    dispatch(getStoryReadingQuestionsAction(storyId))
    dispatch(getStoryAction(storyId, 'preview'))
    dispatch(
      getAllStories(
        learningLanguage,
        lastQuery || {
          sort_by: 'date',
          order: -1,
        }
      )
    )

    const t = setTimeout(() => dispatch(clearMcSavedAction()), 3000)
    return () => clearTimeout(t)
  }, [saved, savedQuestions, dispatch, storyId, learningLanguage, lastQuery])

  useEffect(() => {
    if (!deleted) return
    dispatch(clearMcDeletedAction())
  }, [deleted, dispatch])

  useEffect(() => {
    if (!mcPending) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mcPending])

  useEffect(() => {
    const nextSigs = {}
    ;(draftQuestions || []).forEach((q, idx) => {
      nextSigs[idx] = signatureOf(q)
    })

    Object.keys(regenLocalByIndex || {}).forEach(k => {
      const idx = Number(k)
      if (!Number.isFinite(idx)) return
      if (!regenLocalByIndex[idx]) return
      if (!prevSignatures[idx] || !nextSigs[idx]) return

      if (prevSignatures[idx] !== nextSigs[idx]) {
        setRegenLocalByIndex(prev => {
          if (!prev?.[idx]) return prev
          const next = { ...prev }
          delete next[idx]
          return next
        })
      }
    })

    setPrevSignatures(nextSigs)
  }, [draftQuestions]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) setRegenLocalByIndex({})
  }, [error])

  const anyRegenerating = useMemo(() => {
    const local = regenLocalByIndex || {}
    const redux = regenPendingByIndex || {}
    return Object.keys(local).some(k => !!local[k]) || Object.keys(redux).some(k => !!redux[k])
  }, [regenLocalByIndex, regenPendingByIndex])

  const storyParagraphs = useMemo(() => normalizeStoryParagraphs(story?.paragraph), [story])

  const highlightedSentenceIds = useMemo(() => {
    if (activeTabIndex === 0) {
      if (selectedDraftIdx !== null && draftQuestions[selectedDraftIdx]) {
        return getQuestionSentenceIds(storyParagraphs, draftQuestions[selectedDraftIdx])
      }
      return []
    }
    if (activeTabIndex === 1) {
      if (selectedStoryQuestionIdx !== null && storyQuestions[selectedStoryQuestionIdx]) {
        return getQuestionSentenceIds(storyParagraphs, storyQuestions[selectedStoryQuestionIdx])
      }
      return []
    }
    return []
  }, [
    activeTabIndex,
    draftQuestions,
    selectedDraftIdx,
    storyQuestions,
    storyParagraphs,
    selectedStoryQuestionIdx,
  ])

  const disableTopActions = mcPending || anyRegenerating
  const disableSaveButton = disableTopActions || savePending

  const handleGenerate = () => {
    if (disableTopActions) return
    dispatch(generateMcQuestionsAction({ storyId, level, size }))
    setActiveTabIndex(0)
  }

  const selectDraft = idx => {
    setSelectedDraftIdx(prev => (prev === idx ? null : idx))
  }

  const saveAllDraftToStory = async () => {
    if (disableSaveButton || draftQuestions.length === 0) return

    const merged = [...storyQuestions, ...draftQuestions].map(q => ({ ...q, level: q.level }))

    dispatch(saveMcQuestionsAction({ storyId, questions: merged }))
    setStoryQuestions(merged)
    setDraftQuestions([])
    setSelectedDraftIdx(null)
    setEditing(null)
    setEditValue('')
  }

  const removeDraftQuestion = idx => {
    setDraftQuestions(prev => prev.filter((_, i) => i !== idx))
    if (selectedDraftIdx === idx) setSelectedDraftIdx(null)
    else if (selectedDraftIdx > idx) setSelectedDraftIdx(selectedDraftIdx - 1)
  }

  const startEditChoice = (list, qIdx, cIdx, value) => {
    setEditing({ list, qIdx, cIdx })
    setEditValue(value ?? '')
  }

  const cancelEditChoice = () => {
    setEditing(null)
    setEditValue('')
  }

  const commitEditChoice = () => {
    if (!editing) return
    const { list, qIdx, cIdx } = editing

    const updater = prev => {
      const next = [...prev]
      const q = next[qIdx]
      if (!q || !Array.isArray(q.choices)) return prev

      const oldChoice = q.choices[cIdx]
      const newChoices = [...q.choices]
      newChoices[cIdx] = editValue

      const isEditingCorrectAnswer = q.answer === oldChoice

      next[qIdx] = {
        ...q,
        choices: newChoices,
        ...(isEditingCorrectAnswer ? { answer: editValue } : {}),
      }

      return next
    }

    if (list === 'draft') {
      setDraftQuestions(updater)
    }

    if (list === 'story') {
      const nextStoryQuestions = updater(storyQuestions)
      setStoryQuestions(nextStoryQuestions)

      dispatch(saveMcQuestionsAction({ storyId, questions: nextStoryQuestions }))
    }

    cancelEditChoice()
  }

  useEffect(() => {
    const gen = (Array.isArray(generated) ? generated : []).map(normalizeQuestion).filter(Boolean)

    setDraftQuestions(gen)
    setSelectedDraftIdx(null)
    setEditing(null)
    setEditValue('')
    setRegenLocalByIndex({})
    const nextSigs = {}
    gen.forEach((q, idx) => {
      nextSigs[idx] = signatureOf(q)
    })
    setPrevSignatures(nextSigs)
  }, [generated])

  const handleRegenerateDraftOne = (qIdx, questionText) => {
    cancelEditChoice()

    setPrevSignatures(prev => ({
      ...prev,
      [qIdx]: signatureOf(draftQuestions?.[qIdx]),
    }))

    setRegenLocalByIndex(prev => ({ ...prev, [qIdx]: true }))

    dispatch(
      regenerateOneMcQuestionAction({
        storyId,
        level,
        question: questionText,
        index: qIdx,
      })
    )
  }

  const removeStoryQuestion = idx => {
    const q = storyQuestions?.[idx]
    const questionText = (q?.question || q?.q || '').trim()
    if (!questionText) return

    setStoryQuestions(prev => prev.filter((_, i) => i !== idx))
    dispatch(deleteMcQuestionsAction({ storyId, questions: [questionText] }))

    if (editing?.list === 'story') {
      if (editing.qIdx === idx) {
        setEditing(null)
        setEditValue('')
      } else if (editing.qIdx > idx) {
        setEditing({ ...editing, qIdx: editing.qIdx - 1 })
      }
    }
  }

  const stopPropagation = e => e.stopPropagation()
  const stopAll = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  if (focusedPending || !story)
    return (
      <Spinner fullHeight size={60} text={intl.formatMessage({ id: 'loading' })} textSize={20} />
    )

  const saveTooltip = mcPending
    ? intl.formatMessage({ id: 'mc-generating' })
    : anyRegenerating
    ? intl.formatMessage({ id: 'regenerating' })
    : ''

  const fieldStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    minWidth: 220,
  }

  const labelTextStyle = { minWidth: 46 }

  // Square, compact footprint for the icon-only buttons (the old `<Button icon size="mini"/>`).
  const iconButtonSx = { minWidth: 0, padding: '6px 10px' }

  const handleEditKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      if ((editValue || '').trim().length === 0) return
      commitEditChoice()
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      cancelEditChoice()
    }
  }

  const renderChoices = (list, q, qIdx, regenLoading = false) => (
    <ul
      className="rc-question__options"
      style={regenLoading ? { opacity: 0.6, pointerEvents: 'none' } : null}
    >
      {(q.choices || []).map((opt, cIdx) => {
        const isEditing = editing?.list === list && editing?.qIdx === qIdx && editing?.cIdx === cIdx
        return (
          <li
            key={cIdx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              justifyContent: 'space-between',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              {isEditing ? (
                <AppTextField
                  data-cy={`rc-choice-input-${list}-${qIdx}-${cIdx}`}
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  fullWidth
                  size="small"
                  onKeyDown={handleEditKeyDown}
                  onClick={stopPropagation}
                  onMouseDown={stopPropagation}
                  disabled={regenLoading}
                />
              ) : (
                <span
                  style={
                    opt === q.answer ? { color: 'green', fontWeight: 'bold' } : { color: 'red' }
                  }
                >
                  {opt}
                </span>
              )}
            </div>

            <div
              style={{ display: 'flex', gap: 6, flexShrink: 0 }}
              onClick={stopAll}
              onMouseDown={stopAll}
            >
              {isEditing ? (
                <>
                  <AppButton
                    size="sm"
                    sx={iconButtonSx}
                    data-cy={`rc-choice-save-${list}-${qIdx}-${cIdx}`}
                    disabled={regenLoading || (editValue || '').trim().length === 0}
                    onClick={e => {
                      stopAll(e)
                      commitEditChoice()
                    }}
                  >
                    <CheckIcon fontSize="small" />
                  </AppButton>
                  <AppButton
                    size="sm"
                    sx={iconButtonSx}
                    data-cy={`rc-choice-cancel-${list}-${qIdx}-${cIdx}`}
                    disabled={regenLoading}
                    onClick={e => {
                      stopAll(e)
                      cancelEditChoice()
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </AppButton>
                </>
              ) : (
                <AppButton
                  size="sm"
                  sx={iconButtonSx}
                  data-cy={`rc-choice-edit-${list}-${qIdx}-${cIdx}`}
                  disabled={regenLoading}
                  onClick={e => {
                    stopAll(e)
                    startEditChoice(list, qIdx, cIdx, opt)
                  }}
                  onMouseDown={stopAll}
                >
                  <EditIcon fontSize="small" />
                </AppButton>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )

  const panes = [
    {
      menuItem: {
        key: 'rc-tab-generate-questions',
        content: intl.formatMessage({ id: 'generate-new-questions' }),
        'data-cy': 'rc-tab-generate-questions',
      },
      render: () => (
        <div
          style={{
            padding: 0,
            margin: 0,
            border: 'none',
            boxShadow: 'none',
            background: 'transparent',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <div style={fieldStyle}>
                <span style={labelTextStyle}>{intl.formatMessage({ id: 'level' })}:</span>
                <span data-cy="rc-level-select" style={{ display: 'inline-flex' }}>
                  <AppSelect
                    variant="contrast-outline"
                    value={level}
                    options={skillLevels.map(cefr => ({ value: cefr, label: cefr }))}
                    onChange={setLevel}
                    minWidth={100}
                    disabled={disableSaveButton}
                  />
                </span>
              </div>

              <div style={fieldStyle}>
                <span style={labelTextStyle}>{intl.formatMessage({ id: 'size' })}:</span>
                <span data-cy="rc-size-select" style={{ display: 'inline-flex' }}>
                  <AppSelect
                    variant="contrast-outline"
                    value={size}
                    options={[1, 2, 3, 4, 5].map(s => ({ value: s, label: s }))}
                    onChange={setSize}
                    minWidth={100}
                    disabled={disableSaveButton}
                  />
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <AppButton
                  variant="primary"
                  data-cy="rc-generate-btn"
                  onClick={handleGenerate}
                  disabled={disableSaveButton}
                >
                  {intl.formatMessage({ id: 'generate' })}
                </AppButton>

                <CustomTooltip permanent title={saveTooltip} placement="top">
                  <div style={{ display: 'inline-block' }}>
                    <AppButton
                      variant="primary"
                      data-cy="rc-add-questions-to-story-btn"
                      onClick={saveAllDraftToStory}
                      disabled={disableSaveButton || draftQuestions.length === 0}
                    >
                      {intl.formatMessage({ id: 'add-questions-to-story' })}
                      {draftQuestions.length > 0 ? ` (${draftQuestions.length})` : ''}
                    </AppButton>
                  </div>
                </CustomTooltip>

                {saved ? (
                  <span data-cy="rc-saved-message" style={{ color: 'green' }}>
                    {intl.formatMessage({ id: 'saved' })}
                  </span>
                ) : null}
                {error ? (
                  <span data-cy="rc-error-message" style={{ color: 'crimson' }}>
                    {intl.formatMessage({ id: 'error' })}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {draftQuestions.length === 0 ? (
            <div></div>
          ) : (
            draftQuestions.map((q, qIdx) => {
              const regenLoading = !!regenLocalByIndex?.[qIdx] || !!regenPendingByIndex?.[qIdx]
              const disableThisQuestionActions = mcPending || regenLoading
              return (
                <ReadingComprehensionQuestion
                  key={`draft-${qIdx}-${q.question}`}
                  dataCy={`rc-question-draft-${qIdx}`}
                  titleDataCy={`rc-question-title-draft-${qIdx}`}
                  title={q.question}
                  selected={selectedDraftIdx === qIdx}
                  onToggleSelect={() => selectDraft(qIdx)}
                  cefr={q.level}
                  actions={
                    <>
                      <AppButton
                        variant="contrast-outline"
                        size="sm"
                        sx={iconButtonSx}
                        data-cy={`rc-regenerate-question-btn-${qIdx}`}
                        disabled={disableThisQuestionActions}
                        onClick={e => {
                          stopAll(e)
                          handleRegenerateDraftOne(qIdx, q.question)
                        }}
                        onMouseDown={stopAll}
                      >
                        {regenLoading ? (
                          <Spinner inline size={24} variant="secondary" />
                        ) : (
                          <RefreshIcon fontSize="small" />
                        )}
                      </AppButton>
                      <AppButton
                        variant="contrast-outline"
                        size="sm"
                        sx={iconButtonSx}
                        data-cy={`rc-delete-draft-question-btn-${qIdx}`}
                        style={{ padding: '9px' }}
                        disabled={disableThisQuestionActions}
                        onClick={e => {
                          stopAll(e)
                          setConfirmDelete({ open: true, idx: qIdx, type: 'draft' })
                        }}
                        onMouseDown={stopAll}
                      >
                        <DeleteIcon fontSize="small" />
                      </AppButton>
                    </>
                  }
                >
                  {renderChoices('draft', q, qIdx, regenLoading)}
                </ReadingComprehensionQuestion>
              )
            })
          )}
        </div>
      ),
    },
    {
      menuItem: {
        key: 'rc-tab-edit-saved-questions',
        content: intl.formatMessage({ id: 'edit-saved-questions' }),
        'data-cy': 'rc-tab-edit-saved-questions',
      },
      render: () => (
        <div
          style={{
            padding: 0,
            margin: 0,
            border: 'none',
            boxShadow: 'none',
            background: 'transparent',
          }}
        >
          {storyQuestions.length === 0 ? (
            <div data-cy="rc-no-saved-questions" style={{ opacity: 0.7 }}>
              {intl.formatMessage({ id: 'no-saved-questions' })}
            </div>
          ) : (
            storyQuestions.map((q, qIdx) => (
              <ReadingComprehensionQuestion
                key={`story-${qIdx}-${q.question}`}
                dataCy={`rc-question-story-${qIdx}`}
                titleDataCy={`rc-question-title-story-${qIdx}`}
                title={q.question}
                selected={selectedStoryQuestionIdx === qIdx}
                onToggleSelect={() =>
                  setSelectedStoryQuestionIdx(qIdx === selectedStoryQuestionIdx ? null : qIdx)
                }
                cefr={q.level}
                actions={
                  <AppButton
                    variant="contrast-outline"
                    size="sm"
                    sx={iconButtonSx}
                    data-cy={`rc-delete-saved-question-btn-${qIdx}`}
                    style={{ padding: '9px' }}
                    disabled={deletePending}
                    onClick={e => {
                      stopAll(e)
                      setConfirmDelete({ open: true, idx: qIdx, type: 'saved' })
                    }}
                    onMouseDown={stopAll}
                  >
                    <DeleteIcon fontSize="small" />
                  </AppButton>
                }
              >
                {renderChoices('story', q, qIdx, false)}
              </ReadingComprehensionQuestion>
            ))
          )}
        </div>
      ),
    },
  ]

  const tabs = panes.map((pane, index) => ({
    value: index,
    // AppTabs has no per-tab attribute slot, so the `data-cy` rides on the label node.
    label: <span data-cy={pane.menuItem['data-cy']}>{pane.menuItem.content}</span>,
  }))

  return (
    <>
      <AppDialog
        open={confirmDelete.open}
        onClose={(_e, reason) => {
          // Preserves the old `closeOnDimmerClick={false}`; Escape still closes (MUI default).
          if (reason === 'backdropClick') return
          setConfirmDelete({ open: false, idx: null, type: null })
        }}
        maxWidth="xs"
        data-cy="rc-delete-modal"
      >
        <div style={{ textAlign: 'center' }}>
          {intl.formatMessage({ id: 'confirm-delete-question' })}
        </div>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            background: 'transparent',
            mt: '1.5em',
          }}
        >
          <AppButton
            type="button"
            data-cy="rc-delete-modal-cancel"
            variant="contrast-outline"
            onClick={() => setConfirmDelete({ open: false, idx: null, type: null })}
            style={{ minWidth: 90 }}
          >
            {intl.formatMessage({ id: 'Cancel' })}
          </AppButton>
          <AppButton
            type="button"
            data-cy="rc-delete-modal-confirm"
            variant="danger"
            onClick={() => {
              if (typeof confirmDelete.idx === 'number') {
                if (confirmDelete.type === 'draft') removeDraftQuestion(confirmDelete.idx)
                else if (confirmDelete.type === 'saved') removeStoryQuestion(confirmDelete.idx)
              }
              setConfirmDelete({ open: false, idx: null, type: null })
            }}
            style={{ minWidth: 90 }}
          >
            {intl.formatMessage({ id: 'Delete' })}
          </AppButton>
        </Box>
      </AppDialog>
      {mcPending ? (
        <div className="rc-loading-overlay">
          <Spinner
            fullHeight
            size={60}
            text={intl.formatMessage({ id: 'regenerating' })}
            textSize={20}
          />
        </div>
      ) : null}

      <main
        className="reading-comp auto"
        style={{
          maxWidth: 1250,
          margin: '1.5em auto',
          width: '100%',
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <Box
          className="reading-comp__story"
          sx={{
            backgroundColor: colors.card,
            color: colors.ink,
            // Reading surface — the reading token, not the chrome one.
            fontFamily: font.content,
            border: `1px solid ${colors.border}`,
            borderRadius: '20px',
            padding: '1.25em',
          }}
          style={{
            ...getTextStyle(learningLanguage),
            flex: '3 1 600px',
            minWidth: 320,
          }}
        >
          <div
            className="reading-comp__title header-2"
            style={getTextStyle(learningLanguage, 'title')}
          >
            <span className="story-title">
              <span className="pr-sm">{story.title}</span>
            </span>
          </div>

          <Divider sx={{ my: '1em', borderColor: colors.border }} />

          <HighlightedStoryText
            paragraphs={storyParagraphs}
            highlightedSentenceIds={highlightedSentenceIds}
          />
        </Box>

        <section
          className="reading-comp__questions"
          style={{
            flex: '2 1 360px',
            minWidth: 320,
            width: '100%',
          }}
        >
          <Box
            sx={{
              backgroundColor: colors.card,
              color: colors.ink,
              // Sibling of the story Box, so it inherits no per-language face from getTextStyle();
              // `languageContent` follows the learner's script on its own.
              fontFamily: font.languageContent,
              border: `1px solid ${colors.border}`,
              borderRadius: '20px',
              padding: '1.25em',
            }}
          >
            <div className="rc-tabs" style={{ marginBottom: 12 }}>
              <AppTabs
                tabs={tabs}
                value={activeTabIndex}
                onChange={index => {
                  setActiveTabIndex(index)
                  setSelectedStoryQuestionIdx(null)
                  dispatch(clearMcSavedAction())
                }}
              />
            </div>
            {panes[activeTabIndex]?.render()}
          </Box>
        </section>
      </main>
    </>
  )
}

export default ReadingComprehensionView
