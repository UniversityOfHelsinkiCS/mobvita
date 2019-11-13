import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Placeholder, Header, Card, Icon } from 'semantic-ui-react'
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

  const difficultyStars = story => {

    switch (story.difficulty) {
      case "high":
        return (
          <Fragment >
            <Icon name="star" size="small"></Icon>
            <Icon name="star" size="small"></Icon>
            <Icon name="star" size="small"></Icon>
          </Fragment>
        )

      case "average":
        return (
          <Fragment >
            <Icon name="star" size="small"></Icon>
            <Icon name="star" size="small"></Icon>
          </Fragment>
        )

      case "low":
        return (
          <Fragment >
            <Icon name="star" size="small"></Icon>
          </Fragment>
        )

      default:
        return "unknown story difficulty"
        break;
    }


  }

  return (

    <Card.Group >
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
                {difficultyStars(story)}
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