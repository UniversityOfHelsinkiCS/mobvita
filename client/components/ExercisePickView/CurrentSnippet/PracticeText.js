import React, { useRef, useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import TextWithFeedback from 'Components/ExercisePickView/TextWithFeedback'

const PracticeText = props => {
  const snippets = useSelector(({ snippets }) => snippets)
  const exercisePick = useSelector(({ exercisePick }) => exercisePick)
  const textComponent = useRef(null)
  const [previousHeight, setPreviousHeight] = useState(0)

  const practiceSnippet = useSelector(
    ({ exercisePick }) => exercisePick.focused && exercisePick.focused.practice_snippet,
    shallowEqual
  )

  useEffect(() => {
    if (textComponent.current) {
      setPreviousHeight(textComponent.current.clientHeight)
    }
  }, [practiceSnippet])

  if (snippets.pending || !practiceSnippet || snippets.answersPending || exercisePick.pending) {
    return (
      <div className="spinner-container" style={{ minHeight: previousHeight }}>
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  return (
    <div ref={textComponent}>
      <TextWithFeedback exercise snippet={practiceSnippet} mode="practice" {...props} />
    </div>
  )
}

export default PracticeText