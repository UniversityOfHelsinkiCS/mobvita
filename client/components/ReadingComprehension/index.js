import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider, Header, Segment, Icon, Select } from 'semantic-ui-react'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import ReadingComprehensionQuestion from './ReadingComprehensionQuestion'
import { generateMcQuestionsAction, saveMcQuestionsAction } from 'Utilities/redux/readingComprehensionReducer'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { learningLanguageSelector, getTextStyle, skillLevels } from 'Utilities/common'
import './ReadingComprehension.css'

const ReadingComprehensionView = ({ match }) => {
  const dispatch = useDispatch()
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

  // selected question indices
  const [selected, setSelected] = useState(() => new Set())

  useEffect(() => {
    dispatch(getStoryAction(storyId, 'preview'))
  }, [dispatch, storyId])

  // reset selection when new questions arrive
  useEffect(() => {
    setSelected(new Set())
  }, [generated])

  const previousQuestionTexts = useMemo(
    () => (Array.isArray(generated) ? generated.map(q => q.question).filter(Boolean) : []),
    [generated]
  )

  const handleGenerate = () => {
    dispatch(
      generateMcQuestionsAction({
        storyId,
        level,
        size,
        // Optional: preserve previous questions text but regenerate distractors
        // questions: previousQuestionTexts,
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
    if (!Array.isArray(generated) || selected.size === 0) return []
    return generated.filter((_, idx) => selected.has(idx))
  }, [generated, selected])

  const handleSave = () => {
    dispatch(
      saveMcQuestionsAction({
        storyId,
        questions: selectedQuestions,
      })
    )
  }

  if (pending || !story) return <Spinner fullHeight />

  return (
    <main className="reading-comp pt-lg auto gap-row-sm">
      <Segment className="reading-comp__story" style={getTextStyle(learningLanguage)}>
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

      <section className="reading-comp__questions">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <label>
            Level:{' '}
            <Select
              value={level}
              options={skillLevels.map(cefr=>({key: cefr, text: cefr, value: cefr}))}
              onChange={e => setLevel(e.target.value)}
              style={{ width: 80 }}
            />
          </label>

          <label>
            Size:{' '}
            {/* <input
              type="number"
              min={1}
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              style={{ width: 70 }}
            /> */}
            <Select
              value={size}
              options={[2,3,4,5].map(s => ({ key: s, text: s, value: s }))}
              onChange={e => setSize(e.target.value)}
              style={{ width: 70 }}
            />
          </label>

          <Button primary onClick={handleGenerate} loading={mcPending} disabled={mcPending} style={{ marginBottom: '0.5rem'}}>
            Generate
          </Button>

          <Button
            secondary
            onClick={handleSave}
            disabled={mcPending || selectedQuestions.length === 0}
            style={{ marginBottom: '0.5rem' }}
          >
            Save
          </Button>

          {saved ? <span style={{ color: 'green' }}>Saved</span> : null}
          {error ? <span style={{ color: 'crimson' }}>Error</span> : null}
        </div>

        {(generated || []).map((q, idx) => {
          return (
            <ReadingComprehensionQuestion
              key={`${idx}-${q.question}`}
              title={q.question}
              selected={selected.has(idx)}
              onToggleSelect={() => toggleSelected(idx)}
            >
              <ul className="rc-question__options">
                {q.choices.map((opt, i) => (
                  <li key={i} style={opt === q.answer ? {color: 'green', fontWeight: 'bold'}: {color: 'red'}}>
                    {opt}
                  </li>
                ))}
              </ul>
            </ReadingComprehensionQuestion>
          )
        })}
      </section>
    </main>
  )
}

export default ReadingComprehensionView