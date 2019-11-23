import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button, Placeholder, Header, Card, Icon, Dropdown,
} from 'semantic-ui-react'

import { getStories } from 'Utilities/redux/storiesReducer'
import { FormattedMessage } from 'react-intl'

const StoryList = ({ language }) => {
  const [sorter, setSorter] = useState('date')
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()
  const { stories, pending } = useSelector(({ stories }) => ({ stories: stories.data, pending: stories.pending }))

  useEffect(() => {
    dispatch(getStories(language, {
      sort_by: sorter,
      order: sorter === 'title' ? 1 : -1, // Worked the best atm
      page,
      page_size: 15,
    }))
  }, [page, sorter])

  const adjustPage = direction => () => setPage(Math.max(page + direction, 0))

  if (pending) {
    return (
      <Placeholder>
        <Placeholder.Line />
      </Placeholder>
    )
  }

  if (!stories.length) return <FormattedMessage id="NO_STORIES" />

  const sortDropdownOptions = [
    { key: 'date', text: 'Date', value: 'date' },
    { key: 'title', text: 'Title', value: 'title' },
    { key: 'difficulty', text: 'Difficulty', value: 'difficulty' },
  ]

  const handleChange = (e, option) => {
    setSorter(option.value)
  }

  const icons = {
    high: <Icon name="diamond" size="large" style={{ color: 'red' }} />,
    average: <Icon name="angle double up" size="large" style={{ color: 'red' }} />,
    low: <Icon name="angle up" size="large" style={{ color: 'forestgreen' }} />,
    default: <Icon name="question" style={{ color: 'black' }} />,
  }

  const prevPageDisabled = false
  const nextPageDisabled = false

  return (
    <Card.Group>
      <div style={{ margin: '10px', marginLeft: 'auto' }}>
        <Dropdown selection value={sorter} options={sortDropdownOptions} onChange={handleChange} />
      </div>
      {stories.map((story) => {
        const difficultyIcon = icons[story.difficulty || 'default']
        const difficultyText = story.elo_score
        return (
          <Card fluid key={story._id} style={{ marginBottom: '5px', marginTop: '5px', backgroundColor: '#fafafa' }}>
            <Card.Content extra style={{ padding: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Header as="h4">{story.title}</Header>
                <span style={{ cursor: 'default', display: 'flex' }}>
                  <FormattedMessage id="DIFFICULTY" />
                  {difficultyIcon}
                  {difficultyText}
                </span>
              </div>
            </Card.Content>
            <Card.Content extra>
              <div>
                <Link to={`/stories/${language}/${story._id}/`}>
                  <Button color="teal" size="tiny">
                    Read
                  </Button>
                </Link>
                {' '}
                <Link to={`/stories/${language}/${story._id}/practice`}>
                  <Button color="teal" size="tiny">
                    Practice
                  </Button>
                </Link>
                {' '}
                <Link to={`/stories/${language}/${story._id}/compete`}>
                  <Button color="teal" size="tiny">
                    Compete
                  </Button>
                </Link>
              </div>
            </Card.Content>
          </Card>
        )
      })}
      <Button.Group color="teal" size="small" style={{ margin: '4px', marginLeft: 'auto' }}>
        <Button disabled={prevPageDisabled} onClick={adjustPage(-1)}><FormattedMessage id="PREV" /></Button>
        <Button.Or text={page + 1} />
        <Button disabled={nextPageDisabled} onClick={adjustPage(1)}><FormattedMessage id="NEXT" /></Button>
      </Button.Group>
    </Card.Group>
  )
}

export default StoryList
