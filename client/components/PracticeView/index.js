import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CurrentPractice from 'Components/PracticeView/CurrentPractice'

import { getStoryAction } from 'Utilities/redux/storiesReducer'
import DictionaryHelp from 'Components/DictionaryHelp'
import { learningLanguageSelector } from 'Utilities/common'

const PracticeView = ({ match }) => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()

  const { story } = useSelector(({ stories }) => ({ story: stories.focused }))
  useEffect(() => {
    dispatch(getStoryAction(learningLanguage, match.params.id))
  }, [learningLanguage])

  if (!story) return null

  return (
    <div style={{ paddingTop: '1em' }}>
      <CurrentPractice storyId={match.params.id} />
      <DictionaryHelp />
    </div>
  )
}


export default PracticeView
