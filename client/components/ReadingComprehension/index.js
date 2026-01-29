import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider, Header, Segment, Select, Popup, Icon, Input } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import ReadingComprehensionQuestion from './ReadingComprehensionQuestion'
import { generateMcQuestionsAction, saveMcQuestionsAction } from 'Utilities/redux/readingComprehensionReducer'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { learningLanguageSelector, getTextStyle, skillLevels } from 'Utilities/common'
import './ReadingComprehension.css'

const ReadingComprehensionView = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const learningLanguage = useSelector(learningLanguageSelector)

  const { storyId } = match.params

  const { story, pending } = useSelector(({ stories }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
  }))

  const { generated, pending: mcPending, saved, error } = useSelector(state => {
    const slice = state.readingComprehension
    return (
      slice || {
        generated: [],
        pending: false,
        saved: false,
        error: false,
      }
    )
  })

  const [level, setLevel] = useState('B1')
  const [size, setSize] = useState(4)

  const [selected, setSelected] = useState(() => new Set())
  const [draftQuestions, setDraftQuestions] = useState(() => [])
  const [editing, setEditing] = useState(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    dispatch(getStoryAction(storyId, 'preview'))
  }, [dispatch, storyId])

  useEffect(() => {
    setSelected(new Set())
    setDraftQuestions(Array.isArray(generated) ? generated : [])
    setEditing(null)
    setEditValue('')
  }, [generated])

  const handleGenerate = () => {
    dispatch(
      generateMcQuestionsAction({
        storyId,
        level,
        size,
      })
    )
  }

  const toggleSelected = idx => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const selectedQuestions = useMemo(() => {
    if (!Array.isArray(draftQuestions) || selected.size === 0) return []
    return draftQuestions.filter((_, idx) => selected.has(idx))
  }, [draftQuestions, selected])

  const totalQuestions = Array.isArray(draftQuestions) ? draftQuestions.length : 0
  const selectedCount = selectedQuestions.length

  const handleSelectAll = () => {
    setSelected(new Set((draftQuestions || []).map((_, idx) => idx)))
  }

  const handleClearSelection = () => {
    setSelected(new Set())
  }

  const handleSave = () => {
    dispatch(
      saveMcQuestionsAction({
        storyId,
        questions: selectedQuestions,
      })
    )
  }

  const startEditChoice = (qIdx, cIdx, value) => {
    setEditing({ qIdx, cIdx })
    setEditValue(value ?? '')
  }

  const cancelEditChoice = () => {
    setEditing(null)
    setEditValue('')
  }

  const commitEditChoice = () => {
    if (!editing) return
    const { qIdx, cIdx } = editing

    setDraftQuestions(prev => {
      const next = [...prev]
      const q = next[qIdx]
      if (!q || !Array.isArray(q.choices)) return prev

      const newChoices = [...q.choices]
      newChoices[cIdx] = editValue
      next[qIdx] = { ...q, choices: newChoices }
      return next
    })

    cancelEditChoice()
  }

  const stop = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  if (pending || !story) return <Spinner fullHeight />

  const saveDisabled = mcPending || selectedCount === 0
  const saveTooltip = mcPending ? intl.formatMessage({ id: 'mc-generating' }) : ''

  const fieldStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    minWidth: 220,
  }

  const labelTextStyle = { minWidth: 46 }

  return (
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <div style={fieldStyle}>
              <span style={labelTextStyle}>{intl.formatMessage({ id: 'level' })}:</span>
              <Select
                value={level}
                options={skillLevels.map(cefr => ({ key: cefr, text: cefr, value: cefr }))}
                onChange={(_e, option) => setLevel(option.value)}
                style={{ width: 100 }}
              />
            </div>

            <div style={fieldStyle}>
              <span style={labelTextStyle}>{intl.formatMessage({ id: 'size' })}:</span>
              <Select
                value={size}
                options={[2, 3, 4, 5].map(s => ({ key: s, text: s, value: s }))}
                onChange={(_e, option) => setSize(option.value)}
                style={{ width: 100 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button primary onClick={handleGenerate} loading={mcPending} disabled={mcPending}>
                {intl.formatMessage({ id: 'generate' })}
              </Button>

              <Popup
                content={saveTooltip}
                disabled={!mcPending}
                position="top center"
                trigger={
                  <div style={{ display: 'inline-block' }}>
                    <Button secondary onClick={handleSave} disabled={saveDisabled}>
                      {intl.formatMessage({ id: 'save' })}
                      {selectedCount > 0 ? ` (${selectedCount})` : ''}
                    </Button>
                  </div>
                }
              />

              {totalQuestions > 0 && (
                <>
                  <Button
                    basic
                    size="small"
                    disabled={mcPending || totalQuestions === 0}
                    onClick={() => {
                      if (selected.size === totalQuestions) {
                        handleClearSelection()
                      } else {
                        handleSelectAll()
                      }
                    }}
                  >
                    {intl.formatMessage({ id: 'select-unselect-all' })}
                  </Button>
                </>
              )}

              {saved ? <span style={{ color: 'green' }}>{intl.formatMessage({ id: 'saved' })}</span> : null}
              {error ? <span style={{ color: 'crimson' }}>{intl.formatMessage({ id: 'error' })}</span> : null}
            </div>
          </div>
        </div>

        {(draftQuestions || []).map((q, qIdx) => (
          <ReadingComprehensionQuestion
            key={`${qIdx}-${q.question}`}
            title={q.question}
            selected={selected.has(qIdx)}
            onToggleSelect={() => toggleSelected(qIdx)}
          >
            <ul className="rc-question__options">
              {(q.choices || []).map((opt, cIdx) => {
                const isEditing = editing?.qIdx === qIdx && editing?.cIdx === cIdx
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
                          onClick={stop}
                          onMouseDown={stop}
                        />
                      ) : (
                        <span style={opt === q.answer ? { color: 'green', fontWeight: 'bold' } : { color: 'red' }}>
                          {opt}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }} onClick={stop} onMouseDown={stop}>
                      {isEditing ? (
                        <>
                          <Button
                            icon
                            size="mini"
                            onClick={e => {
                              stop(e)
                              commitEditChoice()
                            }}
                            disabled={(editValue || '').trim().length === 0}
                          >
                            <Icon name="check" />
                          </Button>
                          <Button
                            icon
                            size="mini"
                            onClick={e => {
                              stop(e)
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
                          onClick={e => {
                            stop(e)
                            startEditChoice(qIdx, cIdx, opt)
                          }}
                          onMouseDown={stop}
                        >
                          <Icon name="pencil" />
                        </Button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </ReadingComprehensionQuestion>
        ))}
      </section>
    </main>
  )
}

export default ReadingComprehensionView