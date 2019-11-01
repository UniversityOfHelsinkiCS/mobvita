import React from 'react'
import { connect } from 'react-redux'
import { Button, List } from 'semantic-ui-react'

import { getStoriesAction } from 'Utilities/redux/storiesReducer'

const StoryComponent = ({ stories, getStories }) => {
  if (!stories) return null
  console.log(stories)
  return (
    <div style={{ paddingTop: '1em' }}>
      <Button color="purple" onClick={() => getStories()}>
        Get!
      </Button>
      <List>
        {stories.map(m => <List.Item key={m._id}>{m.title}</List.Item>)}
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

export default connect(mapStateToProps, mapDispatchToProps)(StoryComponent)
