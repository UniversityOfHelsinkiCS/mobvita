import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Placeholder, Container, Header, Card, Tab } from 'semantic-ui-react'
import { getStoriesAction } from 'Utilities/redux/storiesReducer'

const StoryList = ({ stories, getStories }) => {

  useEffect(() => {
    if (stories.length === 0) {
      getStories()
    }
  }, [])

  if (stories.length === 0) {
    return (
      <Placeholder>
        <Placeholder.Line />
      </Placeholder>

    )
  }

  return (

    <Card.Group>
      {stories.map(story => {

        return (
          <Card fluid key={story._id}>
            <Card.Content extra>
              <Header as="h3">{story.title}</Header>
            </Card.Content>
            <Card.Content extra>
              <div>
                <Link to={`/stories/${story._id}/`}><Button primary>Read</Button></Link>
                <Link to={`/stories/${story._id}/snippet`}><Button primary>Practice</Button></Link>
              </div>
            </Card.Content>
          </Card>
        )

      })}
    </Card.Group>
  )
}


const mapStateToProps = ({ stories }) => ({
  stories: stories.data,
})

const mapDispatchToProps = dispatch => ({
  getStories: () => dispatch(getStoriesAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(StoryList)