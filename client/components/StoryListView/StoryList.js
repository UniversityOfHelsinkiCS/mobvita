import React, { useEffect, Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Placeholder, Header, Card, Icon, Dropdown } from 'semantic-ui-react'
import { sortBy } from 'lodash'

import { getStoriesAction } from 'Utilities/redux/storiesReducer'

const StoryList = ({ stories, getStories }) => {

  const [sorter, setSorter] = useState('date')
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

  const sortDropdownOptions = [
    { key: 'date', text: 'Date', value: 'date' },
    { key: 'title', text: 'Title', value: 'title' },
    { key: 'difficulty', text: 'Difficulty', value: 'difficulty' }
  ]

  const handleChange = (e, option) => {
    setSorter(option.value)
  }

  const difficultyStars = story => {

    switch (story.difficulty) {
      case "high":
        return (
          <Fragment >
            <Icon rotated='counterclockwise' name="play" size='large' style={{ color: 'black', cursor: 'default' }} />
          </Fragment>
        )

      case "average":
        return (
          <Fragment >
            <Icon name="square" size="large" style={{ color: 'blue', cursor: 'default' }} />
          </Fragment>
        )

      case "low":
        return (
          <Fragment >
            <Icon name="circle" size="large" style={{ color: 'green', cursor: 'default' }} />
          </Fragment>
        )

      default:
        return "unknown story difficulty"
    }


  }

  const sortedStories = sortBy(stories, [story => {
    if (sorter === 'difficulty') {
      switch (story.difficulty) {
        case 'high':
          return 3
        case 'average':
          return 2
        case 'low':
          return 1
        default:
          return 4
      }
    }
    return story[sorter]
  }])

  return (
    <Card.Group >
      <Dropdown selection options={sortDropdownOptions} style={{ margin: '10px' }} onChange={handleChange} />
      {sortedStories.map(story => (
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
      ))}
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