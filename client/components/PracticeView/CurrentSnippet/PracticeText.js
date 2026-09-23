import React, { useRef, useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import Spinner from 'Components/Spinner'

const PracticeText = props => {
  const snippets = useSelector(({ snippets }) => snippets)
  // The backend sends the chunk / pattern markup with the snippet itself, but it only becomes
  // feedback once the learner has checked: before the first check it would give the answers away.
  const checked = useSelector(({ practice }) => practice.attempt > 0)
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
        <Spinner inline size={60} />
      </div>
    )
  }

  if (snippets?.focused?.practice_snippet?.length > 0) {
    return (
      <div ref={textComponent}>
        <TextWithFeedback
          exercise
          snippet={practiceSnippet}
          mode="practice"
          {...props}
          showMarkup={checked}
        />
      </div>
    )
  } else {
    return (
      <FormattedMessage id="no-available-exercise" />
    )
  }
}

export default PracticeText
