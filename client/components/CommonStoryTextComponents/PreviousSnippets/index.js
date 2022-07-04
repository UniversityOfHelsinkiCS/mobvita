import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { setPrevious, initializePrevious } from 'Utilities/redux/snippetsReducer'
import { setAnnotations } from 'Utilities/redux/annotationsReducer'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import { useParams, useHistory } from 'react-router-dom'

const PreviousSnippets = () => {
  const [annotationsInitialized, setAnnotationsInitialized] = useState(false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { previousAnswers } = useSelector(({ practice }) => practice)
  const history = useHistory()
  const isControlledStory = history.location.pathname.includes('controlled-practice')
  const { focused: focusedStory } = useSelector(({ stories }) => stories)
  const { id: storyId } = useParams()
  const { previous } = useSelector(({ snippets }) => {
    const { focused: focusedSnippet, pending } = snippets
    const previous = snippets.previous.filter(Boolean)
    return { previous, focusedSnippet, pending }
  }, shallowEqual)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPrevious([]))
    dispatch(initializePrevious(storyId, isControlledStory))
  }, [])

  useEffect(() => {
    if (previous.length > 0 && !annotationsInitialized) {
      dispatch(setAnnotations(previous.flat(1)))
      dispatch(setPrevious(previous))
      setAnnotationsInitialized(true)
    }
  }, [previous])

  useEffect(() => {
    const updatedPrevious = focusedStory.paragraph.slice(0, previous.length)
    const previousWords = updatedPrevious.flat(1)
    dispatch(setAnnotations(previousWords))
    dispatch(setPrevious(updatedPrevious))
  }, [focusedStory])

  if (previous?.length > 0 && previous[0].practice_snippet) {
    return null
  }

  const previousSnippets = previous?.map(snippet => (
    <TextWithFeedback snippet={snippet} answers={previousAnswers} mode="practice" />
  ))

  return (
    <div className="pt-nm" style={getTextStyle(learningLanguage)}>
      {previousSnippets}
    </div>
  )
}

export default PreviousSnippets
