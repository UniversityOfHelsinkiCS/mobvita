import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Placeholder, Card, Search, Select } from 'semantic-ui-react'

import StoryListItem from 'Components/StoryListView/StoryListItem'
import { FormattedMessage, useIntl } from 'react-intl'
import CheckboxGroup from 'Components/CheckboxGroup'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { List, WindowScroller } from 'react-virtualized'
import StoryForm from './StoryForm'

const StoryList = () => {
  const intl = useIntl()
  const [sorter, setSorter] = useState('date')
  const [searchString, setSearchString] = useState('')
  const [group, setGroup] = useState('all')
  const [searchedStories, setSearchedStories] = useState([])
  const [libraries, setLibraries] = useState(
    {
      private: false,
      public: true,
      group: false,
    },
  )
  const dispatch = useDispatch()

  const user = useSelector(({ user }) => user.data.user)
  const refreshed = useSelector(({ user }) => user.refreshed)
  const groups = useSelector(({ groups }) => groups.groups)
  const { pending, stories } = useSelector(({ stories }) => ({
    stories: stories.data,
    pending: stories.pending,
  }))


  useEffect(() => {
    dispatch(getGroups())
  }, [])

  const sortDropdownOptions = [
    { key: 'date', text: intl.formatMessage({ id: 'date-added' }), value: 'date' },
    { key: 'title', text: intl.formatMessage({ id: 'Title' }), value: 'title' },
    { key: 'difficulty', text: intl.formatMessage({ id: 'Difficulty' }), value: 'difficulty' },
  ]

  const groupDropdownOptions = [{ key: 'all', text: 'all', value: 'all' }]
    .concat(groups.map(group => (
      { key: group.group_id, text: group.groupName, value: group.group_id }
    )))

  const handleSortChange = (_e, option) => {
    setSorter(option.value)
  }

  useEffect(() => {
    if (stories && searchString.length === 0) {
      setSearchedStories(stories)
    }
  }, [pending])

  useEffect(() => {
    const searchFilteredStories = stories
      ? stories.filter(story => story.title.toLowerCase().includes(searchString.toLowerCase()))
      : []

    setSearchedStories(searchFilteredStories)
  }, [searchString.length])


  const handleLibraryChange = (library) => {
    const librariesCopy = {}
    Object.keys(libraries).forEach((key) => {
      librariesCopy[key] = false
    })

    setLibraries({ ...librariesCopy, [library]: true })
  }

  const handleGroupChange = (_e, option) => {
    setGroup(option.value)
  }

  const noResults = !pending && searchString.length > 0 && searchedStories.length === 0

  const searchSort = (
    <div
      data-cy="library-controls"
      className="library-control"
    >
      <Search
        open={false}
        icon={noResults ? 'close' : 'search'}
        loading={pending}
        value={searchString}
        onSearchChange={e => setSearchString(e.target.value)}
        size="small"
        style={{ marginBottom: 0, marginTop: 'auto' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0.5em' }}>
        {libraries.group && (
          <Select
            value={group}
            options={groupDropdownOptions}
            onChange={handleGroupChange}
            style={{ marginTop: 'auto' }}
          />
        )}
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

  if (pending || !searchedStories || !refreshed) {
    return (
      <div className="component-container">
        {searchSort}
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      </div>
    )
  }


  const librariesToShow = Object
    .entries(libraries)
    .filter(entry => entry[1])
    .map(([key]) => capitalize(key))

  const libraryFilteredStories = searchedStories.filter((story) => {
    // if (story.public) {
    //   return librariesToShow.includes('Public')
    // }

    // if (story.sharedwith && story.sharedwith.includes(user.oid)) {
    //   return librariesToShow.includes('Private')
    // }

    // if (story.user !== user.oid) {
    //   if (group === 'all') return librariesToShow.includes('Group')
    //   return story.group.group_id === group
    // }

    // return librariesToShow.includes('Private')


    if (story.public) {
      return librariesToShow.includes('Public')
    }

    const showLibraries = []

    if (story.user === user.oid) {
      showLibraries.push('Private')
    }

    if (story.group) {
      if (group === 'all' || story.group.group_id === group) {
        showLibraries.push('Group')
      }
    }

    return librariesToShow.some(value => showLibraries.includes(value))
  })

  const stringToDifficulty = (difficulty) => {
    switch (difficulty) {
      case 'low':
        return 1
      case 'average':
        return 2
      case 'high':
        return 3
      default: // null case
        return 4
    }
  }

  libraryFilteredStories.sort((a, b) => {
    switch (sorter) {
      case 'date':
        return new Date(b.date) - new Date(a.date)
      case 'title':
        return a.title > b.title ? 1 : -1
      case 'difficulty':
        return stringToDifficulty(a.difficulty) - stringToDifficulty(b.difficulty)
      default:
        return 0
    }
  })

  const userCanShare = groups.find(group => group.is_teaching)

  function rowRenderer({ key, index, style }) {
    return (
      <div key={key} style={{ ...style, paddingRight: '0.5em', paddingLeft: '0.5em' }}>
        <StoryListItem key={key} userCanShare={userCanShare} story={libraryFilteredStories[index]} />
      </div>
    )
  }


  return (
    <div className="component-container">
      {searchSort}

      <Card.Group itemsPerRow={1} doubling>
        <StoryForm />
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <List
              autoHeight
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              rowCount={libraryFilteredStories.length}
              rowHeight={150}
              rowRenderer={rowRenderer}
              scrollTop={scrollTop}
              width={10000}
            />
          )}
        </WindowScroller>
      </Card.Group>
    </div>
  )
}

export default StoryList
