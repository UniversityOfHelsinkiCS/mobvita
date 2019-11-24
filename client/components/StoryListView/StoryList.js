import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button, Placeholder, Header, Card, Icon, Dropdown, Image, Search,
} from 'semantic-ui-react'

import { getStories, getAllStories } from 'Utilities/redux/storiesReducer'
import { FormattedMessage } from 'react-intl'

const StoryList = ({ language }) => {
  const [sorter, setSorter] = useState('date')
  const [searchString, setSearchString] = useState('')
  const [searchedStories, setSearchedStories] = useState([])
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()
  const { stories, pending, all, allPending } = useSelector(({ stories }) => ({ stories: stories.data, all: stories.allStories, allPending: stories.allPending, pending: stories.pending }))

  useEffect(() => {
    dispatch(getStories(language, {
      sort_by: sorter,
      order: sorter === 'title' ? 1 : -1, // Worked the best atm
      page,
      page_size: 14,
    }))
  }, [page, sorter])

  const sortDropdownOptions = [
    { key: 'date', text: 'Date', value: 'date' },
    { key: 'title', text: 'Title', value: 'title' },
    { key: 'difficulty', text: 'Difficulty', value: 'difficulty' },
  ]

  const handleChange = (e, option) => {
    setSorter(option.value)
  }

  useEffect(() => {
    const searchFilteredStories = all ? all.filter(story => story.title.toLowerCase().includes(searchString.toLowerCase())) : []
    setSearchedStories(searchFilteredStories)
  }, [searchString.length])

  const handleSearchChange = ({ target }) => {
    const ss = target.value
    setSearchString(ss)
    dispatch(getAllStories(language, {
      sort_by: sorter,
      order: sorter === 'title' ? 1 : -1, // Worked the best atm
    }))
  }

  const icons = {
    high: <Icon name="diamond" size="large" style={{ color: 'red' }} />,
    average: <Icon name="angle double up" size="large" style={{ color: 'red' }} />,
    low: <Icon name="angle up" size="large" style={{ color: 'forestgreen' }} />,
    default: <Icon name="question" style={{ color: 'black' }} />,
  }

  const prevPageDisabled = false
  const nextPageDisabled = false

  const adjustPage = direction => () => setPage(Math.max(page + direction, 0))

  const noResults = !allPending && searchString.length > 0 && searchedStories.length === 0
  const searchSort = (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
      <Search open={false} icon={noResults ? 'close' : 'search'} loading={allPending} value={searchString} onSearchChange={handleSearchChange} />
      <Dropdown selection value={sorter} options={sortDropdownOptions} onChange={handleChange} />
    </div>
  )

  if (pending) {
    return (
      <div>
        {searchSort}
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      </div>
    )
  }

  if (!stories.length) return <FormattedMessage id="NO_STORIES" />

  const filteredInsteadOfPaginated = searchedStories.length > 0 && searchedStories.length < 30
  const displayStories = filteredInsteadOfPaginated ? searchedStories : stories

  return (
    <div>
      {searchSort}
      <Card.Group itemsPerRow={2} doubling>
        {displayStories.map((story) => {
          const difficultyIcon = icons[story.difficulty || 'default']
          const difficultyText = story.elo_score
          return (
            <Card fluid key={story._id} style={{ marginBottom: '10px', marginTop: '10px' }}>
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
      </Card.Group>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button.Group center="true" color="teal" size="small" style={{ margin: '4px', marginTop: '15px' }}>
          <Button disabled={prevPageDisabled} onClick={adjustPage(-1)}><FormattedMessage id="PREV" /></Button>
          <Button.Or text={page + 1} />
          <Button disabled={nextPageDisabled} onClick={adjustPage(1)}><FormattedMessage id="NEXT" /></Button>
        </Button.Group>
      </div>
    </div>
  )
}

export default StoryList
