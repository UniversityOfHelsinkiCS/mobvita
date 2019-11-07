import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Input, Divider, Segment, Header } from 'semantic-ui-react'

import { getStoryAction } from 'Utilities/redux/storiesReducer'

const SingleStoryView = ({ match }) => {
  const dispatch = useDispatch()
  const { story } = useSelector(({ stories }) => ({ story: stories.focused }))
  useEffect(() => {
    dispatch(getStoryAction(match.params.id))
  }, [])
  if (!story) return 'No story (yet?)'

  const wordInputRandomizer = (word) => {

    if (Math.ceil(Math.random() * 4) === 4 && word.bases !== '') {
      return <Input key={word.ID} defaultValue={word.bases.split('|')[0]}></Input>
    }

    return word.surface
  }

  return (
    <div style={{ paddingTop: '1em' }}>
      <Link to={'/stories'}>Go back to home page</Link>
      <Header>{story.title}</Header>
      <a href={story.url}>{story.url}</a>
      {story.paragraph.map(paragraph => (
        <div key={paragraph[0].ID}>
          <Divider />
          <Segment>
            {paragraph.map(word => wordInputRandomizer(word))}
          </Segment>
        </div>
      ))}
    </div>
  )
}

export default SingleStoryView
