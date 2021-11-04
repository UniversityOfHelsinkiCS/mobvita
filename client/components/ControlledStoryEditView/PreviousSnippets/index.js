import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { setPrevious } from 'Utilities/redux/controlledPracticeReducer'
import { setAnnotations } from 'Utilities/redux/annotationsReducer'
import TextWithFeedback from 'Components/ControlledStoryEditView/TextWithFeedback'

const PreviousSnippets = () => {
  const [annotationsInitialized, setAnnotationsInitialized] = useState(false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { previousAnswers } = useSelector(({ practice }) => practice)

  const { focused: focusedStory } = useSelector(({ stories }) => stories)

  const { previous } = useSelector(({ controlledPractice }) => {
    const { focused: focusedSnippet, pending } = controlledPractice
    const previous = controlledPractice.previous.filter(Boolean)
    return { previous, focusedSnippet, pending }
  }, shallowEqual)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPrevious([]))
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

  const previousSnippets = previous?.map(snippet => (
    <TextWithFeedback snippet={snippet} answers={previousAnswers} />
  ))

  return (
    <div className="pt-nm" style={getTextStyle(learningLanguage)}>
      {previousSnippets}
    </div>
  )
}

export default PreviousSnippets
