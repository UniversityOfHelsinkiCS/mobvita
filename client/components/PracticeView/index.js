import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CurrentPractice from 'Components/PracticeView/CurrentPractice'
import { Divider, Header } from 'semantic-ui-react'

import { getStoryAction } from 'Utilities/redux/storiesReducer'
import DictionaryHelp from 'Components/DictionaryHelp'

const PracticeView = ({ match }) => {
  const [language, setLanguage] = useState('')
  const dispatch = useDispatch()
  const { story } = useSelector(({ stories }) => ({ story: stories.focused }))
  useEffect(() => {
    const currentLanguage = window.location.pathname.split('/')[2]
    setLanguage(currentLanguage)
    dispatch(getStoryAction(currentLanguage, match.params.id))
  }, [])

  if (!story) return null

  return (
    <div style={{ paddingTop: '1em' }}>
      <Header>{story.title}</Header>
      {story.url ? <a href={story.url}>Link to the source</a> : null}
      <Divider />
      <CurrentPractice storyId={match.params.id} />
      <DictionaryHelp />
    </div>
  )
}


export default PracticeView
