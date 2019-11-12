import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import CurrentPractice from 'Components/PracticeView/CurrentPractice'
import { Divider, Header } from 'semantic-ui-react'

import { getStoryAction } from 'Utilities/redux/storiesReducer'
import ResetButton from 'Components/PracticeView/ResetButton'

const PracticeView = ({ match }) => {
  const dispatch = useDispatch()
  const { story } = useSelector(({ stories }) => ({ story: stories.focused }))
  useEffect(() => {
    dispatch(getStoryAction(match.params.id))
  }, [])

  if (!story) return null

  return (
    <div style={{ paddingTop: '1em' }}>
      <Link to="/stories">Go back to story list</Link>
      <Header>{story.title}</Header>
      <a href={story.url}>{story.url}</a>
      <Divider />
      <CurrentPractice storyId={match.params.id} />
      <ResetButton storyId={match.params.id} />
    </div>
  )
}


export default PracticeView
