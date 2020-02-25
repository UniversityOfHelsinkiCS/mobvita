import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Placeholder, Card, Search, Select } from 'semantic-ui-react'

import { getStories, getAllStories } from 'Utilities/redux/storiesReducer'
import StoryListItem from 'Components/StoryListView/StoryListItem'
import { FormattedMessage, useIntl } from 'react-intl'
import { debounce } from 'lodash'
import CheckboxGroup from 'Components/CheckboxGroup'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import StoryForm from './StoryForm'
import AddStoryModal from './AddStoryModal'

const StoryList = () => {
  const intl = useIntl()
  const [sorter, setSorter] = useState('date')
  const [searchString, setSearchString] = useState('')
  const [searchedStories, setSearchedStories] = useState([])
  const [libraries, setLibraries] = useState(
    {
      private: true,
      public: true,
      group: true,
    },
  )
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()
  const { stories, pending, all, allPending } = useSelector(({ stories }) => ({
    stories: stories.data,
    all: stories.allStories,
    allPending: stories.allPending,
    pending: stories.pending,
  }))

  const user = useSelector(({ user }) => user.data.user)
  const learningLanguage = useSelector(learningLanguageSelector)

  const debouncedSearch = useCallback(
    debounce(
      () => {
        dispatch(
          getAllStories(learningLanguage, {
            sort_by: sorter,
            order: sorter === 'title' ? 1 : -1, // Worked the best atm
          }),
        )
      },
      300,
    ),
    [learningLanguage],
  )

  useEffect(() => {
    dispatch(
      getStories(learningLanguage, {
        sort_by: sorter,
        order: sorter === 'title' ? 1 : -1, // Worked the best atm
        page,
        page_size: 14,
      }),
    )
  }, [page, sorter])

  const sortDropdownOptions = [
    { key: 'date', text: intl.formatMessage({ id: 'date-added' }), value: 'date' },
    { key: 'title', text: intl.formatMessage({ id: 'Title' }), value: 'title' },
    { key: 'difficulty', text: intl.formatMessage({ id: 'Difficulty' }), value: 'difficulty' },
  ]

  const handleSortChange = (e, option) => {
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
    debouncedSearch()
  }

  const handleLibraryChange = library => () => {
    setLibraries({ ...libraries, [library]: !libraries[library] })
  }

  const prevPageDisabled = false
  const nextPageDisabled = false

  const adjustPage = direction => () => setPage(Math.max(page + direction, 0))

  const noResults = !allPending && searchString.length > 0 && searchedStories.length === 0
  const searchSort = (
    <div
      data-cy="library-controls"
      className="libraryControl"
    >
      <Search
        open={false}
        icon={noResults ? 'close' : 'search'}
        loading={allPending}
        value={searchString}
        onSearchChange={handleSearchChange}
        size="small"
        style={{ marginBottom: 0, marginTop: 'auto' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0.5em' }}>
        <CheckboxGroup values={libraries} onClick={handleLibraryChange} />
        <div>
          <FormattedMessage id="sort-by" />
          <br />
          <Select
            value={sorter}
            options={sortDropdownOptions}
            onChange={handleSortChange}
            style={{ minWidth: '5em' }}
          />
        </div>
      </div>

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

  if (!stories.length) return <FormattedMessage id="no-stories-available" />

  const filteredInsteadOfPaginated = searchString && searchedStories.length < 30
  const displayStories = filteredInsteadOfPaginated ? searchedStories : stories

  const librariesToShow = Object
    .entries(libraries)
    .filter(entry => entry[1])
    .map(([key]) => capitalize(key))

  const libraryFilteredStories = displayStories.filter((story) => {
    if (story.public) {
      return librariesToShow.includes('Public')
    }

    if (story.sharedwith && story.sharedwith.includes(user.oid)) {
      return librariesToShow.includes('Private')
    }

    if (story.user !== user.oid) {
      return librariesToShow.includes('Group')
    }

    return librariesToShow.includes('Private')
  })

  return (
    <div>
      {searchSort}

      <Card.Group itemsPerRow={1} doubling>
        <StoryForm />
        {libraryFilteredStories.map(story => (
          <StoryListItem key={story._id} story={story} />
        ))}
      </Card.Group>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button.Group color="teal" size="small" style={{ margin: '4px', marginTop: '15px' }}>
          <Button disabled={prevPageDisabled} onClick={adjustPage(-1)}>
            <FormattedMessage id="Previous" />
          </Button>
          <Button.Or text={page + 1} />
          <Button disabled={nextPageDisabled} onClick={adjustPage(1)}>
            <FormattedMessage id="Next" />
          </Button>
        </Button.Group>
      </div>
    </div>
  )
}

export default StoryList
