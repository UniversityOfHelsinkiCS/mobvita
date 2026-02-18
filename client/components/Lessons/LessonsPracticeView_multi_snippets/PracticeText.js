import React, { useRef, useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import Spinner from 'Components/Spinner'

const PracticeText = props => {
  const textComponent = useRef(null)
  const { focusing_snippets, pending } = useSelector(({ lessonExercises }) => lessonExercises, shallowEqual)

  if (!focusing_snippets || pending) {
    return (
      <div className="spinner-container" style={{ minHeight: 0 }}>
        <Spinner />
      </div>
    )
  }

  return (
    focusing_snippets.map((snippet, index) => (
      <div ref={textComponent}>
        <TextWithFeedback key={index} exercise snippet={snippet.sent} mode="practice" {...props} />
        {/* <Divider /> */}
      </div>
    ))
  )
}

export default PracticeText