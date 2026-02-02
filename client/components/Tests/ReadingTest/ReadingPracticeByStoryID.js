import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Segment, Button as SemanticButton } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { learningLanguageSelector, getTextStyle } from 'Utilities/common'

const pickQuestionsFromStory = story => {
  if (!story) return []
  if (Array.isArray(story.questions)) return story.questions
  if (Array.isArray(story.q_and_a)) return story.q_and_a
  if (Array.isArray(story.reading_questions)) return story.reading_questions
  return []
}

const normalizeQuestion = q => {
  if (!q) return null
  if (q.question && (q.choices || q.answer)) return q
  if (q.q) {
    return {
      question: q.q,
      answer: q.a,
      choices: Array.isArray(q.choices) ? q.choices : [],
    }
  }
  return q
}

const ReadingPracticeView = () => {
  const dispatch = useDispatch()
  const { id: storyId } = useParams()
  const learningLanguage = useSelector(learningLanguageSelector)

  const { story, pending } = useSelector(({ stories }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
  }))

  const questions = useMemo(() => {
    const raw = pickQuestionsFromStory(story)
    return raw.map(normalizeQuestion).filter(Boolean)
  }, [story])

  const [idx, setIdx] = useState(0)
  const current = questions[idx] || null
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!storyId) return
    dispatch(getStoryAction(storyId, 'preview'))
  }, [dispatch, storyId])

  useEffect(() => {
    setIdx(0)
    setSelectedChoice(null)
    setChecked(false)
  }, [storyId, questions.length])

  const total = questions.length

  const goNext = () => {
    if (!checked) return
    setChecked(false)
    setSelectedChoice(null)
    setIdx(prev => Math.min(prev + 1, Math.max(total - 1, 0)))
  }

  if (pending) return <Spinner fullHeight />
  if (!story) return null

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
        style={{
          ...getTextStyle(learningLanguage),
          flex: '3 1 600px',
          minWidth: 320,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 10 }}>{story.title}</div>

        {(story.paragraph || []).map((paragraph, i) => (
          <React.Fragment key={i}>
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
        style={{
          flex: '2 1 360px',
          minWidth: 320,
          width: '100%',
          alignSelf: 'flex-start',
        }}
      >
        <div style={{ position: 'sticky', top: 16 }}>
          <Segment style={{ borderRadius: 14, margin: 0 }}>
            <div style={{ maxHeight: 'calc(100vh - 32px)', overflowY: 'auto' }}>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>
                <FormattedMessage id="reading-practice" defaultMessage="reading-practice" />
              </div>

              {total === 0 ? (
                <div style={{ opacity: 0.85 }}>
                  <FormattedMessage id="no-questions" defaultMessage="No questions." />
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 10, fontSize: 12, opacity: 0.75 }}>
                    <FormattedMessage id="question" defaultMessage="Question" /> {idx + 1} / {total}
                  </div>

                  <div style={{ fontWeight: 700, marginBottom: 12 }}>{current?.question}</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(current?.choices || []).map((c, i) => {
                      const isSelected = selectedChoice === c
                      const isAnswer = c === current?.answer
                      const isWrongSelected = checked && isSelected && !isAnswer
                      const isCorrect = checked && isAnswer

                      let border = '1px solid rgba(0,0,0,0.18)'
                      let bg = '#fff'
                      let color = 'rgba(0,0,0,0.82)'

                      if (!checked && isSelected) {
                        border = '1px solid rgba(33, 133, 208, 0.9)'
                        bg = 'rgba(33, 133, 208, 0.08)'
                        color = 'rgba(0,0,0,0.95)'
                      }

                      if (isCorrect) {
                        border = '1px solid rgba(33, 186, 69, 0.9)'
                        bg = 'rgba(33, 186, 69, 0.12)'
                        color = 'rgba(0,0,0,0.95)'
                      }

                      if (isWrongSelected) {
                        border = '1px solid rgba(219, 40, 40, 0.9)'
                        bg = 'rgba(219, 40, 40, 0.10)'
                        color = 'rgba(0,0,0,0.95)'
                      }

                      return (
                        <SemanticButton
                          key={i}
                          fluid
                          disabled={checked}
                          onClick={() => {
                            if (checked) return
                            setSelectedChoice(c)
                          }}
                          style={{
                            textAlign: 'left',
                            justifyContent: 'flex-start',
                            borderRadius: 10,
                            padding: '12px 14px',
                            border,
                            backgroundColor: bg,
                            color,
                            boxShadow: 'none',
                            fontWeight: 500,
                            whiteSpace: 'normal',
                          }}
                        >
                          {c}
                        </SemanticButton>
                      )
                    })}
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                    <Button
                      className="btn-secondary"
                      onClick={() => setChecked(true)}
                      disabled={selectedChoice == null || checked}
                    >
                      <FormattedMessage id="check-answer" defaultMessage="Check Answers" />
                    </Button>

                    {/* LAST QUESTION → show Restart */}
                    {idx === total - 1 && checked ? (
                      <Button
                        variant="success"
                        onClick={() => {
                          setIdx(0)
                          setSelectedChoice(null)
                          setChecked(false)
                        }}
                      >
                        <FormattedMessage id="start-over" defaultMessage="Start over" />
                      </Button>
                    ) : (
                      <Button onClick={goNext} disabled={!checked || idx >= total - 1}>
                        <FormattedMessage id="next" defaultMessage="Next" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </Segment>
        </div>
      </section>
    </main>
  )
}

export default ReadingPracticeView