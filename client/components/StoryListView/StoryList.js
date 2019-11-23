import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button, Placeholder, Header, Card, Icon, Dropdown,
} from 'semantic-ui-react'
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
    { key: 'difficulty', text: 'Difficulty', value: 'difficulty' },
  ]

  const handleChange = (e, option) => {
    setSorter(option.value)
  }

  const icons = {
    high: <Icon name="circle" size="large" style={{ color: 'red' }} />,
    average: <Icon name="circle" size="large" style={{ color: 'yellow' }} />,
    low: <Icon name="circle" size="large" style={{ color: 'green' }} />,
    default: <Icon name="question" size="large" style={{ color: 'black' }} />,
  }

  const sortedStories = sortBy(stories, [(story) => {
    if (sorter === 'difficulty') {
      const array = {
        low: 1,
        average: 2,
        high: 3,
      }
      return array[story.difficulty] || 4
    }
    return story[sorter]
  }])

  return (
    <Card.Group>
      <div style={{ margin: '10px', marginLeft: 'auto' }}>
        <Dropdown selection value={sorter} options={sortDropdownOptions} onChange={handleChange} />
      </div>
      {sortedStories.map((story) => {
        const difficultyIcon = icons[story.difficulty || 'default']
        const difficultyText = story.elo_score
        return (
          <Card fluid key={story._id} style={{ marginBottom: '5px', marginTop: '5px' }}>
            <Card.Content extra style={{ padding: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Header as="h4">{story.title}</Header>
                <span style={{ cursor: 'default', display: 'flex' }}>
                  {difficultyIcon}
                  {difficultyText}
                </span>
              </div>
            </Card.Content>
            <Card.Content extra>
              <div>
                <Link to={`/stories/${language}/${story._id}/`}>
                  <Button size="tiny" primary>
                    Read
                  </Button>
                </Link>
                {' '}
                <Link to={`/stories/${language}/${story._id}/practice`}>
                  <Button size="tiny" primary>
                    Practice
                  </Button>
                </Link>
                {' '}
                <Link to={`/stories/${language}/${story._id}/compete`}>
                  <Button size="tiny" primary>
                    Compete
                  </Button>
                </Link>
              </div>
            </Card.Content>
          </Card>
        )
      })}
    </Card.Group>
  )
}

export default StoryList
