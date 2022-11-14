import React, { useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { setPrevious } from 'Utilities/redux/lessonSentencesReducer'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'

const PreviousSnippets = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { previous } = useSelector(({ lessonSentences }) => {
    const { focused: focusedSnippet, pending } = lessonSentences
    const previous = lessonSentences.previous.filter(Boolean)
    return { previous, focusedSnippet, pending }
  }, shallowEqual)
  const { previousAnswers } = useSelector(({ practice }) => practice)

  useEffect(() => {
    dispatch(setPrevious([]))
  }, [])

  if (previous?.length > 0 && previous[0].sent) {
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