import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button, Placeholder, Header, Card, Icon, Dropdown, Segment
} from 'semantic-ui-react'
import { sortBy } from 'lodash'

import { getStories } from 'Utilities/redux/storiesReducer'
import { FormattedMessage } from 'react-intl'

const StoryList = ({ match }) => {
  const { language } = match.params
  const [sorter, setSorter] = useState('date')
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()
  const { stories, pending } = useSelector(({ stories }) => ({ stories: stories.data, pending: stories.pending }))

  useEffect(() => {
    dispatch(getStories(language, {
      sort_by: sorter,
      order: 1, // or -1
      page,
      page_size: 15,
    }))
  }, [page])

  const adjustPage = direction => () => setPage(page + direction)

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

  const prevPageDisabled = false
  const nextPageDisabled = false

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
      <Button.Group size="large">
        <Button disabled={prevPageDisabled} onClick={adjustPage(-1)}><FormattedMessage id="PREV" /></Button>
        <Button.Or text={page} />
        <Button disabled={nextPageDisabled} onClick={adjustPage(1)}><FormattedMessage id="NEXT" /></Button>
      </Button.Group>
    </Card.Group>
  )
}

export default StoryList
