import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, Placeholder, Card, Dropdown, Search } from 'semantic-ui-react'

import { postStory, getStories, getAllStories } from 'Utilities/redux/storiesReducer'
import StoryListItem from 'Components/StoryListView/StoryListItem'
import { FormattedMessage } from 'react-intl'
import { capitalize } from 'Utilities/common'


const StoryList = ({ language }) => {
  const [storyUrl, setStoryUrl] = useState('')
  const [sorter, setSorter] = useState('date')
  const [searchString, setSearchString] = useState('')
  const [searchedStories, setSearchedStories] = useState([])
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()
  const { stories, pending, all, allPending } = useSelector(({ stories }) => ({
    stories: stories.data,
    all: stories.allStories,
    allPending: stories.allPending,
    pending: stories.pending,
  }))

  useEffect(() => {
    dispatch(
      getStories(language, {
        sort_by: sorter,
        order: sorter === 'title' ? 1 : -1, // Worked the best atm
        page,
        page_size: 14,
      }),
    )
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
    const searchFilteredStories = all
      ? all.filter(story => story.title.toLowerCase().includes(searchString.toLowerCase()))
      : []
    setSearchedStories(searchFilteredStories)
  }, [searchString.length])

  const handleSearchChange = ({ target }) => {
    const ss = target.value
    setSearchString(ss)
    dispatch(
      getAllStories(language, {
        sort_by: sorter,
        order: sorter === 'title' ? 1 : -1, // Worked the best atm
      }),
    )
  }

  const handleStorySubmit = () => {
    const newStory = {
      url: storyUrl,
      language: capitalize(language),
    }

    dispatch(postStory(newStory))
    setStoryUrl('')
  }

  const prevPageDisabled = false
  const nextPageDisabled = false

  const adjustPage = direction => () => setPage(Math.max(page + direction, 0))

  const noResults = !allPending && searchString.length > 0 && searchedStories.length === 0
  const searchSort = (
    <div style={
      { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', margin: '10px 0' }}
    >
      <Form onSubmit={handleStorySubmit}>
        <Input placeholder="story url here" value={storyUrl} onChange={event => setStoryUrl(event.target.value)} />
        <Button type="submit">submit story</Button>
      </Form>
      <Search
        open={false}
        icon={noResults ? 'close' : 'search'}
        loading={allPending}
        value={searchString}
        onSearchChange={handleSearchChange}
      />
      <Dropdown
        selection
        value={sorter}
        options={sortDropdownOptions}
        onChange={handleChange}
        style={{ minWidth: '10em' }}
      />
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
        {displayStories.map(story => (
          <StoryListItem key={story._id} story={story} language={language} />
        ))}
      </Card.Group>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button.Group color="teal" size="small" style={{ margin: '4px', marginTop: '15px' }}>
          <Button disabled={prevPageDisabled} onClick={adjustPage(-1)}>
            <FormattedMessage id="PREV" />
          </Button>
          <Button.Or text={page + 1} />
          <Button disabled={nextPageDisabled} onClick={adjustPage(1)}>
            <FormattedMessage id="NEXT" />
          </Button>
        </Button.Group>
      </div>
    </div>
  )
}

export default StoryList
