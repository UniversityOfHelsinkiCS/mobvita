import React, { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { setAnnotations } from 'Utilities/redux/annotationsReducer'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'

const PreviousSnippets = () => {
  const [annotationsInitialized, setAnnotationsInitialized] = useState(false)

  const { previousAnswers } = useSelector(({ practice }) => practice, shallowEqual)
  const focusedStory = useSelector(({ stories }) => stories.focused)
  const rawPrevious = useSelector(({ controlledPractice }) => controlledPractice.previous)
  const focusedSnippet = useSelector(({ controlledPractice }) => controlledPractice.focused)
  const previous = useMemo(() => (rawPrevious || []).filter(Boolean), [rawPrevious])
  const location = useLocation()
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const isEditor = location.pathname.includes('controlled-story-editor')

  useEffect(() => {
    if (isEditor && previous.length > 0 && !annotationsInitialized) {
      dispatch(setAnnotations(previous.flat(1)))
      setAnnotationsInitialized(true)
    }
  }, [previous])

  useEffect(() => {
    if (isEditor) {
      const updatedPrevious = focusedStory.paragraph.slice(0, previous.length)
      const previousWords = updatedPrevious.flat(1)
      dispatch(setAnnotations(previousWords))
    }
  }, [focusedStory])

  const previousSnippets = previous?.map((snippet, index) => (
    <TextWithFeedback key={index} snippet={snippet} answers={previousAnswers} />
  ))

  return (
    <div className="pt-nm" style={getTextStyle(learningLanguage)}>
      {previousSnippets}
    </div>
  )
}

export default PreviousSnippets
