import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import TextWithFeedback from 'Components/PracticeView/TextWithFeedback'

const PracticeText = (props) => {
  const snippets = useSelector(({ snippets }) => snippets)
  const textComponent = useRef(null)
  const [previousHeight, setPreviousHeight] = useState(0)
  const practiceSnippet = useSelector(({ snippets }) => (
    snippets.focused && snippets.focused.practice_snippet), shallowEqual)

  useEffect(() => {
    if (textComponent.current) {
      setPreviousHeight(textComponent.current.clientHeight)
    }
  }, [practiceSnippet])

  if (snippets.pending || !practiceSnippet) {
    return (
      <div className="spinner-container" style={{ minHeight: previousHeight }}>
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  return (
    <div ref={textComponent}>
      <TextWithFeedback exercise snippet={practiceSnippet} {...props} />
    </div>
  )
}

export default PracticeText
