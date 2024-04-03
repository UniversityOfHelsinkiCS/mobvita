import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { setAnnotations } from 'Utilities/redux/annotationsReducer'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'

const PreviousSnippets = () => {
  const [annotationsInitialized, setAnnotationsInitialized] = useState(false)

  const { previousAnswers } = useSelector(({ practice }) => practice)
  const { focused: focusedStory } = useSelector(({ stories }) => stories)
  const { previous } = useSelector(({ controlledPractice }) => {
    const { focused: focusedSnippet, pending } = controlledPractice
    const previous = controlledPractice.previous.filter(Boolean)
    return { previous, focusedSnippet, pending }
  }, shallowEqual)

  const history = useHistory()
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const isEditor = history.location.pathname.includes('controlled-story-editor')

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
