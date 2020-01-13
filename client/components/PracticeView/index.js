import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CurrentPractice from 'Components/PracticeView/CurrentPractice'
import { Divider, Header } from 'semantic-ui-react'

import { getStoryAction } from 'Utilities/redux/storiesReducer'
import DictionaryHelp from 'Components/DictionaryHelp'
import { setLearningLanguage } from 'Utilities/redux/languageReducer'

const PracticeView = ({ match }) => {
  const { language } = match.params
  const dispatch = useDispatch()

  const { story } = useSelector(({ stories }) => ({ story: stories.focused }))
  useEffect(() => {
    dispatch(getStoryAction(language, match.params.id))
    dispatch(setLearningLanguage(language))
  }, [language])

  if (!story) return null

  return (
    <div style={{ paddingTop: '1em' }}>
      <CurrentPractice storyId={match.params.id} />
      <DictionaryHelp />
    </div>
  )
}


export default PracticeView
