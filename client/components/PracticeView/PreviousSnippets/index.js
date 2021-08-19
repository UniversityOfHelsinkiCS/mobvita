import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { setPrevious, initializePrevious } from 'Utilities/redux/snippetsReducer'
import { initializeAnnotations } from 'Utilities/redux/annotationsReducer'
import TextWithFeedback from 'Components/PracticeView/TextWithFeedback'
import { useParams } from 'react-router-dom'

const PreviousSnippets = () => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const [annotationsInitialized, setAnnotationsInitialized] = useState(false)
  const { previousAnswers } = useSelector(({ practice }) => practice)
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
    if (previous.length > 0 && !annotationsInitialized) {
      const annotationsInPreviousSnippets = previous
        .map(par => par)
        .flat(1)
        .filter(word => word.annotation)

      dispatch(initializeAnnotations(annotationsInPreviousSnippets))
      setAnnotationsInitialized(true)
    }
  }, [previous])

  const historySuccessfullyInitialized = annotationsInitialized && previous.length > 0

  const previousSnippets = historySuccessfullyInitialized
    ? previous?.map(snippet => (
        <TextWithFeedback snippet={snippet} answers={previousAnswers} mode="practice" />
      ))
    : null

  return (
    <div className="pt-nm" style={getTextStyle(learningLanguage)}>
      {previousSnippets}
    </div>
  )
}

export default PreviousSnippets
