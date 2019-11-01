import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getStoryAction } from 'Utilities/redux/storiesReducer'

const SingleStoryView = ({ match }) => {
  const dispatch = useDispatch()
  const { story } = useSelector(({ stories }) => ({ story: stories.focused }))
  useEffect(() => {
    dispatch(getStoryAction(match.params.id))
  }, [])
  if (!story) return 'No story (yet?)'

  return (
    <div style={{ paddingTop: '1em' }}>
      {story.paragraph.map(paragraph => (
        <p key={paragraph[0].ID}>
          {paragraph.map(word => word.surface)}
        </p>
      ))}
    </div>
  )
}

export default SingleStoryView
