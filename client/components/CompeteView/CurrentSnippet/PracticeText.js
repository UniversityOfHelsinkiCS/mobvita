import React, { useRef, useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import Spinner from 'Components/Spinner'

const PracticeText = props => {
  const snippets = useSelector(({ snippets }) => snippets)
  const textComponent = useRef(null)
  const [previousHeight, setPreviousHeight] = useState(0)
  const practiceSnippet = useSelector(
    ({ snippets }) => snippets.focused && snippets.focused.practice_snippet,
    shallowEqual
  )

  useEffect(() => {
    if (textComponent.current) {
      setPreviousHeight(textComponent.current.clientHeight)
    }
  }, [practiceSnippet])

  if (snippets.pending || !practiceSnippet) {
    return (
      <div className="spinner-container" style={{ minHeight: previousHeight }}>
        <Spinner inline />
      </div>
    )
  }

  return (
    <div ref={textComponent}>
      <TextWithFeedback exercise snippet={practiceSnippet} mode="compete" {...props} />
    </div>
  )
}

export default PracticeText
