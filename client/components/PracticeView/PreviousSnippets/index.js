import React, { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { setPrevious, initializePrevious } from 'Utilities/redux/snippetsReducer'
import { setAnnotations } from 'Utilities/redux/annotationsReducer'
import TextWithFeedback from 'Components/PracticeView/TextWithFeedback'
import { useParams } from 'react-router-dom'

const PreviousSnippets = () => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const { previousAnswers } = useSelector(({ practice }) => practice)

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
    dispatch(initializePrevious(storyId))
  }, [])

  useEffect(() => {
    const updatedPrevious = focusedStory.paragraph.slice(0, previous.length)
    const previousWords = updatedPrevious.flat(1)
    dispatch(setAnnotations(previousWords))
    dispatch(setPrevious(updatedPrevious))
  }, [focusedStory])

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
