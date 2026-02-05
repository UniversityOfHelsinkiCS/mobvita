import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Divider,
  Header,
  Segment,
  Select,
  Popup,
  Icon,
  Input,
  Tab,
} from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import ReadingComprehensionQuestion from './ReadingComprehensionQuestion'
import {
  generateMcQuestionsAction,
  regenerateOneMcQuestionAction,
  saveMcQuestionsAction,
  clearMcSavedAction,
} from 'Utilities/redux/readingComprehensionReducer'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { learningLanguageSelector, getTextStyle, skillLevels } from 'Utilities/common'
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
      question: q.question,
      answer: q.answer,
      choices: Array.isArray(q.choices) ? q.choices : [],
    }
  }
  if (q.q) {
    return {
      question: q.q,
      answer: q.a,
      choices: Array.isArray(q.choices) ? q.choices : [],
    }
  }
  return null
}

const ReadingComprehensionView = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { storyId } = match.params

  const { story, pending } = useSelector(({ stories }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
  }))

  const {
    generated,
    pending: mcPending,
    saved,
    error,
    regenPendingByIndex,
  } = useSelector(state => {
    const slice = state.readingComprehension
    return (
      slice || {
        generated: [],
        pending: false,
        saved: false,
        error: false,
        regenPendingByIndex: {},
      }
    )
  })

  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const [level, setLevel] = useState('B1')
  const [size, setSize] = useState(4)

  const [storyQuestions, setStoryQuestions] = useState([])
  const [draftQuestions, setDraftQuestions] = useState([])

  const [selectedDraft, setSelectedDraft] = useState(() => new Set())

  const [editing, setEditing] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [suppressSavedIndicator, setSuppressSavedIndicator] = useState(false)

  const [regenLocalByIndex, setRegenLocalByIndex] = useState({})
  const [prevSignatures, setPrevSignatures] = useState({})

  useEffect(() => {
    dispatch(getStoryAction(storyId, 'preview'))
  }, [dispatch, storyId])

  useEffect(() => {
    const qs = pickStoryQuestions(story).map(normalizeQuestion).filter(Boolean)
    setStoryQuestions(qs)
  }, [storyId, story])

  useEffect(() => {
    if (!saved) return

    dispatch(getStoryAction(storyId, 'preview'))

    if (suppressSavedIndicator) {
      setSuppressSavedIndicator(false)
      dispatch(clearMcSavedAction())
      return
    }

    const t = setTimeout(() => dispatch(clearMcSavedAction()), 3000)
    return () => clearTimeout(t)
  }, [saved, dispatch, storyId, suppressSavedIndicator])

  useEffect(() => {
    if (!mcPending) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mcPending])

  useEffect(() => {
    const gen = (Array.isArray(generated) ? generated : []).map(normalizeQuestion).filter(Boolean)
    setDraftQuestions(gen)
    setSelectedDraft(new Set())
    setEditing(null)
    setEditValue('')
    setRegenLocalByIndex({})
    const nextSigs = {}
    gen.forEach((q, idx) => {
      nextSigs[idx] = signatureOf(q)
    })
    setPrevSignatures(nextSigs)
  }, [generated])

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

  const disableTopActions = mcPending || anyRegenerating

  const handleGenerate = () => {
    if (disableTopActions) return
    dispatch(generateMcQuestionsAction({ storyId, level, size }))
    setActiveTabIndex(0)
  }

  const toggleSelectedDraft = idx => {
    setSelectedDraft(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const selectedDraftQuestions = useMemo(() => {
    if (!Array.isArray(draftQuestions) || selectedDraft.size === 0) return []
    return draftQuestions.filter((_, idx) => selectedDraft.has(idx))
  }, [draftQuestions, selectedDraft])

  const totalDraft = draftQuestions.length
  const selectedCount = selectedDraftQuestions.length

  const selectAllDraft = () =>
    setSelectedDraft(new Set((draftQuestions || []).map((_, idx) => idx)))
  const clearDraftSelection = () => setSelectedDraft(new Set())

  const saveSelectedDraftToStory = async () => {
    if (disableTopActions || selectedCount === 0) return
    setSuppressSavedIndicator(false)

    const merged = [...storyQuestions, ...selectedDraftQuestions]

    dispatch(saveMcQuestionsAction({ storyId, questions: merged }))
    setStoryQuestions(merged)
    setDraftQuestions([])
    setSelectedDraft(new Set())
    setEditing(null)
    setEditValue('')
  }

  const saveStoryQuestions = () => {
    if (disableTopActions) return
    setSuppressSavedIndicator(false)
    dispatch(saveMcQuestionsAction({ storyId, questions: storyQuestions }))
  }

  const removeStoryQuestion = idx => {
    setSuppressSavedIndicator(true)

    const remainingStoryQuestions = storyQuestions.filter((_, i) => i !== idx)
    setStoryQuestions(remainingStoryQuestions)
    dispatch(saveMcQuestionsAction({ storyId, questions: remainingStoryQuestions }))

    if (editing?.list === 'story') {
      if (editing.qIdx === idx) {
        setEditing(null)
        setEditValue('')
      } else if (editing.qIdx > idx) {
        setEditing({ ...editing, qIdx: editing.qIdx - 1 })
      }
    }
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
      setSuppressSavedIndicator(false)

      const nextStoryQuestions = updater(storyQuestions)
      setStoryQuestions(nextStoryQuestions)
      dispatch(saveMcQuestionsAction({ storyId, questions: nextStoryQuestions }))
    }

    cancelEditChoice()
  }

  const handleRegenerateDraftOne = (qIdx, questionText) => {
    cancelEditChoice()

    setPrevSignatures(prev => ({
      ...prev,
      [qIdx]: signatureOf(draftQuestions?.[qIdx]),
    }))

    setRegenLocalByIndex(prev => ({ ...prev, [qIdx]: true }))

    dispatch(regenerateOneMcQuestionAction({ storyId, level, question: questionText, index: qIdx }))
  }

  const stopPropagation = e => e.stopPropagation()
  const stopAll = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  if (!story)
    return (
      <Spinner
        fullHeight
        size={60}
        variant="secondary"
        text="Loading story…"
        textSize={20}
        textVariant="secondary"
      />
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
                <Input
                  value={editValue}
                  onChange={(_e, data) => setEditValue(data.value)}
                  fluid
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
                  <Button
                    icon
                    size="mini"
                    disabled={regenLoading || (editValue || '').trim().length === 0}
                    onClick={e => {
                      stopAll(e)
                      commitEditChoice()
                    }}
                  >
                    <Icon name="check" />
                  </Button>
                  <Button
                    icon
                    size="mini"
                    disabled={regenLoading}
                    onClick={e => {
                      stopAll(e)
                      cancelEditChoice()
                    }}
                  >
                    <Icon name="close" />
                  </Button>
                </>
              ) : (
                <Button
                  icon
                  size="mini"
                  disabled={regenLoading}
                  onClick={e => {
                    stopAll(e)
                    startEditChoice(list, qIdx, cIdx, opt)
                  }}
                  onMouseDown={stopAll}
                >
                  <Icon name="pencil" />
                </Button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )

  const panes = [
    {
      menuItem: intl.formatMessage({ id: 'generate-new-questions' }),
      render: () => (
        <Tab.Pane
          attached={false}
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
                <Select
                  value={level}
                  options={skillLevels.map(cefr => ({ key: cefr, text: cefr, value: cefr }))}
                  onChange={(_e, option) => setLevel(option.value)}
                  style={{ width: 100 }}
                  disabled={disableTopActions}
                />
              </div>

              <div style={fieldStyle}>
                <span style={labelTextStyle}>{intl.formatMessage({ id: 'size' })}:</span>
                <Select
                  value={size}
                  options={[1, 2, 3, 4, 5].map(s => ({ key: s, text: s, value: s }))}
                  onChange={(_e, option) => setSize(option.value)}
                  style={{ width: 100 }}
                  disabled={disableTopActions}
                />
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
                <Button primary onClick={handleGenerate} disabled={disableTopActions}>
                  {intl.formatMessage({ id: 'generate' })}
                </Button>

                <Popup
                  content={saveTooltip}
                  disabled={!disableTopActions}
                  position="top center"
                  trigger={
                    <div style={{ display: 'inline-block' }}>
                      <Button
                        primary
                        onClick={saveSelectedDraftToStory}
                        disabled={disableTopActions || selectedCount === 0}
                      >
                        {intl.formatMessage({ id: 'add-questions-to-story' })}
                        {selectedCount > 0 ? ` (${selectedCount})` : ''}
                      </Button>
                    </div>
                  }
                />

                {totalDraft > 0 && (
                  <Button
                    basic
                    size="small"
                    disabled={disableTopActions}
                    onClick={() => {
                      if (selectedDraft.size === totalDraft) clearDraftSelection()
                      else selectAllDraft()
                    }}
                  >
                    {intl.formatMessage({ id: 'select-unselect-all' })}
                  </Button>
                )}

                {saved && !suppressSavedIndicator ? (
                  <span style={{ color: 'green' }}>{intl.formatMessage({ id: 'saved' })}</span>
                ) : null}
                {error ? (
                  <span style={{ color: 'crimson' }}>{intl.formatMessage({ id: 'error' })}</span>
                ) : null}
              </div>
            </div>
          </div>

          {draftQuestions.length === 0 ? (
            <div style={{ opacity: 0.7 }}>{intl.formatMessage({ id: 'no-draft-questions' })}</div>
          ) : (
            draftQuestions.map((q, qIdx) => {
              const regenLoading = !!regenLocalByIndex?.[qIdx] || !!regenPendingByIndex?.[qIdx]
              const disableThisQuestionActions = mcPending || regenLoading

              return (
                <ReadingComprehensionQuestion
                  key={`draft-${qIdx}-${q.question}`}
                  title={q.question}
                  selected={selectedDraft.has(qIdx)}
                  onToggleSelect={() => toggleSelectedDraft(qIdx)}
                  actions={
                    <Button
                      icon
                      basic
                      size="mini"
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
                        <Icon name="refresh" />
                      )}
                    </Button>
                  }
                >
                  {renderChoices('draft', q, qIdx, regenLoading)}
                </ReadingComprehensionQuestion>
              )
            })
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: intl.formatMessage({ id: 'edit-saved-questions' }),
      render: () => (
        <Tab.Pane
          attached={false}
          style={{
            padding: 0,
            margin: 0,
            border: 'none',
            boxShadow: 'none',
            background: 'transparent',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: 12,
            }}
          >
            {saved && !suppressSavedIndicator ? (
              <span style={{ color: 'green' }}>{intl.formatMessage({ id: 'saved' })}</span>
            ) : null}
            {error ? (
              <span style={{ color: 'crimson' }}>{intl.formatMessage({ id: 'error' })}</span>
            ) : null}
          </div>

          {storyQuestions.length === 0 ? (
            <div style={{ opacity: 0.7 }}>{intl.formatMessage({ id: 'no-saved-questions' })}</div>
          ) : (
            storyQuestions.map((q, qIdx) => (
              <ReadingComprehensionQuestion
                key={`story-${qIdx}-${q.question}`}
                title={q.question}
                selected={false}
                onToggleSelect={() => {}}
                actions={
                  <Button
                    icon
                    basic
                    size="mini"
                    onClick={e => {
                      stopAll(e)
                      removeStoryQuestion(qIdx)
                    }}
                    onMouseDown={stopAll}
                  >
                    <Icon name="trash" />
                  </Button>
                }
              >
                {renderChoices('story', q, qIdx, false)}
              </ReadingComprehensionQuestion>
            ))
          )}
        </Tab.Pane>
      ),
    },
  ]

  return (
    <>
      {mcPending ? (
        <div className="rc-loading-overlay">
          <Spinner
            fullHeight
            size={72}
            variant="secondary"
            text="Generating questions…"
            textSize={24}
            textVariant="secondary"
          />
        </div>
      ) : null}

      <main
        className="reading-comp pt-lg auto gap-row-sm"
        style={{
          maxWidth: 1250,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <Segment
          className="reading-comp__story"
          style={{
            ...getTextStyle(learningLanguage),
            flex: '3 1 600px',
            minWidth: 320,
          }}
        >
          <Header className="reading-comp__title" style={getTextStyle(learningLanguage, 'title')}>
            <span className="story-title">
              <span className="pr-sm">{story.title}</span>
            </span>
          </Header>

          <Divider />

          {story.paragraph.map((paragraph, index) => (
            <React.Fragment key={index}>
              <TextWithFeedback
                hideFeedback
                showDifficulty={false}
                mode="preview"
                snippet={paragraph}
                answers={null}
                focusedConcept={null}
                show_preview_exer={false}
              />
              <br />
              <br />
            </React.Fragment>
          ))}
        </Segment>

        <section
          className="reading-comp__questions"
          style={{
            flex: '2 1 360px',
            minWidth: 320,
            width: '100%',
          }}
        >
          <Segment style={{ borderRadius: 12 }}>
            <Tab
              menu={{ secondary: true, pointing: true }}
              panes={panes}
              activeIndex={activeTabIndex}
              onTabChange={(_e, data) => {
                setActiveTabIndex(data.activeIndex)
                dispatch(clearMcSavedAction())
              }}
            />
          </Segment>
        </section>
      </main>
    </>
  )
}

export default ReadingComprehensionView
