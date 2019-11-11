import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Divider, Segment, Header, Button } from 'semantic-ui-react'

import { getStoryAction } from 'Utilities/redux/storiesReducer'

const SingleStoryView = ({ match }) => {
  const dispatch = useDispatch()
  const { story } = useSelector(({ stories }) => ({ story: stories.focused }))
  useEffect(() => {
    dispatch(getStoryAction(match.params.id))
  }, [])
  if (!story) return 'No story (yet?)'

  const handleClick = (word) => {
    window.responsiveVoice.speak(word, 'Finnish Female')
  }

  const wordVoice = (word) => {
    if (word.bases) {
      return <span key={word.ID} onClick={e => handleClick(word.surface)}>{word.surface}</span>
    }
    return word.surface
  }

  return (
    <div style={{ paddingTop: '1em' }}>
      <Link to={'/stories'}>Back to storylist</Link>

      <Header>{story.title}</Header>
      <a href={story.url}>{story.url}</a>
      {story.paragraph.map(paragraph => (
        <div key={paragraph[0].ID}>
          <Divider />
          <Segment>
            {paragraph.map(word => wordVoice(word))}
          </Segment>
        </div>
      ))}
    </div>
  )
}

export default SingleStoryView
