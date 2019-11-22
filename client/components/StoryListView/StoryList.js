import React, { useEffect, Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Placeholder, Header, Card, Icon, Dropdown } from 'semantic-ui-react'
import { sortBy } from 'lodash'

import { getStories } from 'Utilities/redux/storiesReducer'

const StoryList = () => {
  const [language, setLanguage] = useState('')
  const [sorter, setSorter] = useState('date')
  const dispatch = useDispatch()
  const { stories, pending } = useSelector(({ stories }) => ({ stories: stories.data, pending: stories.pending }))
  useEffect(() => {
    const currentLanguage = window.location.pathname.split('/')[2]
    if (stories.length === 0 || currentLanguage !== language) {
      dispatch(getStories(currentLanguage))
      setLanguage(currentLanguage)
    }
  }, [])

  if (stories.length === 0 || pending) {
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

  const difficultyStars = (story) => {

    const icons = {
      high: <Icon name="circle" size="large" style={{ color: 'red', cursor: 'default' }} />,
      average: <Icon name="circle" size="large" style={{ color: 'yellow', cursor: 'default' }} />,
      low: <Icon name="circle" size="large" style={{ color: 'green', cursor: 'default' }} />,
      default: <Icon name="question" size="large" style={{ color: 'black', cursor: 'default' }} />,
    }

    const icon = icons[story.difficulty || 'default']

    return (
      <Fragment>
        {icon}
      </Fragment>
    )
  }

  const sortedStories = sortBy(stories, [(story) => {
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
    <Card.Group>
      <Dropdown selection options={sortDropdownOptions} style={{ margin: '10px' }} onChange={handleChange} />
      {sortedStories.map(story => (
        <Card fluid key={story._id} style={{ margin: '2px' }}>
          <Card.Content extra style={{ padding: '10px' }}>
            <Header as="h4">{story.title}</Header>
          </Card.Content>
          <Card.Content extra>
            <div>
              <Link to={`/stories/${language}/${story._id}/`}>
                <Button size='tiny' primary>
                  Read
                </Button>
              </Link>
              <Link to={`/stories/${language}/${story._id}/snippet`}>
                <Button size='tiny' primary>
                  Practice
                </Button>
              </Link>
              {difficultyStars(story)}
            </div>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  )
}

export default StoryList
