import React, { useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { useSelector, shallowEqual } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import { Divider } from 'semantic-ui-react'

const PracticeText = props => {
  const textComponent = useRef(null)
  const { focusing_snippets, pending } = useSelector(({ lessonExercises }) => lessonExercises, shallowEqual)

  if (!focusing_snippets || pending) {
    return (
      <div className="spinner-container" style={{ minHeight: 0 }}>
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  return (
    focusing_snippets.map(snippet => (
      <div ref={textComponent}>
        <TextWithFeedback exercise snippet={snippet.sent} mode="practice" {...props} />
        {/* <Divider /> */}
      </div>
    ))
  )
}

export default PracticeText