import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, List } from 'semantic-ui-react'

import { getStoriesAction } from 'Utilities/redux/storiesReducer'

const StoryList = ({ stories, getStories }) => {
  if (!stories) return null

  return (
    <div style={{ paddingTop: '1em' }}>
      <Button color="purple" onClick={() => getStories()}>
        Get!
      </Button>
      <List>
        {stories.map(m => <List.Item key={m._id}><Link to={`/stories/${m._id}`}> {m.title}</Link></List.Item>)}
      </List>
    </div>
  )
}

const mapStateToProps = ({ stories }) => ({
  stories: stories.data,
})

const mapDispatchToProps = dispatch => ({
  getStories: () => dispatch(getStoriesAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(StoryList)
