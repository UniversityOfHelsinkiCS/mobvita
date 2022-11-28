import React, { useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { useSelector, shallowEqual } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import { Divider } from 'semantic-ui-react'

const PracticeText = props => {
  const textComponent = useRef(null)
  const { lesson_exercises, pending } = useSelector(({ lessonExercises }) => lessonExercises, shallowEqual)
  // const { focused, pending } = useSelector(({ lessons }) => lessons, shallowEqual)
  
  const [previousHeight, setPreviousHeight] = useState(0)

  if (!lesson_exercises || pending) {
    return (
      <div className="spinner-container" style={{ minHeight: previousHeight }}>
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  return (
    lesson_exercises.map(sentence => (
      <div ref={textComponent}>
        <TextWithFeedback exercise snippet={sentence.sent} mode="practice" {...props} />
        <Divider />
      </div>
    ))
  )
}

export default PracticeText