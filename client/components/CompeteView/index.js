import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import CurrentSnippet from 'Components/CompeteView/CurrentSnippet'
import { Divider, Header } from 'semantic-ui-react'

import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { getOpponent, competitionStartNow } from 'Utilities/redux/competitionReducer'

import DictionaryHelp from 'Components/DictionaryHelp'

const CompeteView = ({ match }) => {
  const [language, setLanguage] = useState('')
  const dispatch = useDispatch()
  const storyId = match.params.id
  const { story, startTime } = useSelector(({ stories, compete }) => ({ story: stories.focused, startTime: compete.startTime }))
  useEffect(() => {
    const currentLanguage = window.location.pathname.split('/')[2]
    setLanguage(currentLanguage)
    dispatch(getStoryAction(currentLanguage, storyId))
  }, [])

  const initializeCompetition = async () => {
    await dispatch(getOpponent(storyId))
    await dispatch(competitionStartNow())
  }

  useEffect(() => { initializeCompetition() }, [])

  if (!story || !startTime) return null

  return (
    <div style={{ paddingTop: '1em' }}>
      <Link to={`/stories/${language}`}>Go back to story list</Link>
      <Header>{story.title}</Header>
      {story.url ? <a href={story.url}>Link to the source</a> : null}
      <Divider />
      <CurrentSnippet storyId={match.params.id} />
      <DictionaryHelp />
    </div>
  )
}

export default CompeteView
