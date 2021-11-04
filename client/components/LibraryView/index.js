import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Placeholder, Card, Search, Select, Icon, Dropdown, Input } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import StoryListItem from 'Components/LibraryView/StoryListItem'
import { useIntl } from 'react-intl'
import LibraryTabs from 'Components/LibraryTabs'
import { capitalize, useLearningLanguage } from 'Utilities/common'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { List, WindowScroller } from 'react-virtualized'
import {
  updateLibrarySelect,
  updateGroupSelect,
  updateSortCriterion,
} from 'Utilities/redux/userReducer'
import { getAllStories } from 'Utilities/redux/storiesReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import AddStoryModal from 'Components/AddStoryModal'

const StoryList = () => {
  const intl = useIntl()

  const {
    library_sort_criterion: savedSortCriterion,
    last_selected_library: savedLibrarySelection,
    last_selected_group: savedGroupSelection,
    oid: userId,
  } = useSelector(({ user }) => user.data.user)
  const refreshed = useSelector(({ user }) => user.refreshed)
  const groups = useSelector(({ groups }) => groups.groups)
  const { pending, stories } = useSelector(({ stories }) => ({
    stories: stories.data,
    pending: stories.pending,
  }))
  const { sharedToGroupSinceLastFetch } = useSelector(({ share }) => share)
  const learningLanguage = useLearningLanguage()

  const smallWindow = useWindowDimensions().width < 520

  const smallScreenSearchbar = useRef()

  const [sorter, setSorter] = useState(savedSortCriterion[savedLibrarySelection].sort_by)
  const [sortDirection, setSortDirection] = useState(
    savedSortCriterion[savedLibrarySelection].direction
  )
  const [addStoryModalOpen, setAddStoryModalOpen] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [smallScreenSearchOpen, setSmallScreenSearchOpen] = useState(false)
  const [searchedStories, setSearchedStories] = useState([])
  const [libraries, setLibraries] = useState({
    public: false,
    private: false,
    group: false,
  })
  const dispatch = useDispatch()

  const setLibrary = library => {
    const librariesCopy = {}
    Object.keys(libraries).forEach(key => {
      librariesCopy[key] = false
    })

    setLibraries({ ...librariesCopy, [library]: true })
  }

  const handleLibraryChange = library => {
    dispatch(updateLibrarySelect(library))
    setLibrary(library)
    setSorter(savedSortCriterion[library].sort_by)
    setSortDirection(savedSortCriterion[library].direction)
    if (library === 'group' && sharedToGroupSinceLastFetch) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        })
      )
    }
  }

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  useEffect(() => {
    if (!groups.find(g => g.group_id === savedGroupSelection) && groups[0]) {
      dispatch(updateGroupSelect(groups[0].group_id))
    }
  }, [groups])

  useEffect(() => {
    setLibrary(savedLibrarySelection)
    if (savedLibrarySelection !== 'private' && sorter === 'date') {
      setSorter('title')
    }
  }, [savedLibrarySelection])

  const sortDropdownOptions = [
    { key: 'title', text: intl.formatMessage({ id: 'Title' }), value: 'title' },
    { key: 'difficulty', text: intl.formatMessage({ id: 'Difficulty' }), value: 'difficulty' },
    { key: 'progress', text: intl.formatMessage({ id: 'Progress' }), value: 'progress' },
  ]

  if (savedLibrarySelection === 'private' || savedLibrarySelection === 'group') {
    sortDropdownOptions.push({
      key: 'date',
      text: intl.formatMessage({ id: 'date-added' }),
      value: 'date',
    })
  }

  const groupDropdownOptions = groups.map(group => ({
    key: group.group_id,
    text: group.groupName,
    value: group.group_id,
  }))

  const handleSortChange = (_e, option) => {
    setSorter(option.value)
    dispatch(
      updateSortCriterion({
        ...savedSortCriterion,
        [savedLibrarySelection]: {
          sort_by: option.value,
          direction: sortDirection,
        },
      })
    )
  }

  const handleDirectionChange = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc'
    setSortDirection(newDirection)
    dispatch(
      updateSortCriterion({
        ...savedSortCriterion,
        [savedLibrarySelection]: {
          sort_by: sorter,
          direction: newDirection,
        },
      })
    )
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
  }, [searchString.length, pending])

  useEffect(() => {
    if (smallScreenSearchbar.current && smallScreenSearchOpen) smallScreenSearchbar.current.focus()
  }, [smallScreenSearchOpen])

  const handleGroupChange = (_e, option) => {
    dispatch(updateGroupSelect(option.value))
  }

  const handleSearchIconClick = () => {
    if (smallScreenSearchOpen) {
      setSearchString('')
      setSmallScreenSearchOpen(false)
    } else {
      setSmallScreenSearchOpen(true)
    }
  }

  const noResults = !pending && searchString.length > 0 && searchedStories.length === 0

  const libraryControls = (
    <div data-cy="library-controls" className="library-control">
      <AddStoryModal open={addStoryModalOpen} setOpen={setAddStoryModalOpen} />
      <div className="library-selection">
        <LibraryTabs
          values={libraries}
          additionalClass="wrap-and-grow align-center pt-sm"
          onClick={handleLibraryChange}
          reverse
        />
        {libraries.group && (
          <Select
            value={savedGroupSelection}
            options={groupDropdownOptions}
            onChange={handleGroupChange}
            disabled={!libraries.group}
            style={{ color: '#777', marginTop: '0.5em' }}
          />
        )}
      </div>
      <span>
        <Button
          className="tour-add-new-stories"
          onClick={() => setAddStoryModalOpen(true)}
          data-cy="add-story-button"
          size="big"
          style={{
            fontSize: '1.3em',
            fontWeight: 500,
            margin: '1em 0',
            padding: '1rem 0',
            width: '100%',
            border: '2px solid #000',
          }}
        >
          {intl.formatMessage({ id: 'add-your-stories' })}
        </Button>
      </span>
      <div className="search-and-sort">
        <div className="flex align-center">
          <Dropdown
            value={sorter}
            options={sortDropdownOptions}
            onChange={handleSortChange}
            selection
          />
          <Icon
            style={{ cursor: 'pointer', marginLeft: '0.5em' }}
            name={sortDirection === 'asc' ? 'caret up' : 'caret down'}
            size="large"
            color="grey"
            onClick={handleDirectionChange}
          />
        </div>
        {smallWindow ? (
          <Icon
            name={smallScreenSearchOpen ? 'close' : 'search'}
            circular
            color="grey"
            onClick={handleSearchIconClick}
          />
        ) : (
          <Search
            open={false}
            icon="search"
            loading={pending}
            value={searchString}
            onSearchChange={e => setSearchString(e.target.value)}
            size="tiny"
            style={{ height: '100%' }}
          />
        )}
      </div>
      {smallScreenSearchOpen && (
        <Input
          icon="search"
          loading={pending}
          value={searchString}
          onChange={e => setSearchString(e.target.value)}
          size="mini"
          fluid
          ref={smallScreenSearchbar}
        />
      )}
    </div>
  )

  if (pending || !searchedStories || !refreshed) {
    return (
      <div className="cont-tall cont flex-col auto gap-row-sm">
        {libraryControls}
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      </div>
    )
  }

  const librariesToShow = Object.entries(libraries)
    .filter(entry => entry[1])
    .map(([key]) => capitalize(key))

  const libraryFilteredStories = searchedStories.filter(story => {
    if (story.public) {
      return librariesToShow.includes('Public')
    }

    const showLibraries = []

    if (story.user === userId) {
      showLibraries.push('Private')
    }

    if (story.shared && story.sharedwith && story.sharedwith.includes(userId)) {
      showLibraries.push('Private')
    }

    if (story.groups) {
      if (story.groups.map(g => g.group_id).includes(savedGroupSelection)) {
        showLibraries.push('Group')
      }
    }

    return librariesToShow.some(value => showLibraries.includes(value))
  })

  const stringToDifficulty = difficulty => {
    switch (difficulty) {
      case 'low':
        return 1
      case 'average':
        return 2
      case 'high':
        return 3
      default:
        // null case
        return 4
    }
  }

  libraryFilteredStories.sort((a, b) => {
    let dir = 0
    switch (sorter) {
      case 'date':
        dir = new Date(b.date) - new Date(a.date)
        break
      case 'title':
        dir = a.title > b.title ? 1 : -1
        break
      case 'difficulty':
        dir = stringToDifficulty(a.difficulty) - stringToDifficulty(b.difficulty)
        break
      case 'progress':
        dir = a.percent_cov - b.percent_cov
        break
      default:
        break
    }

    const multiplier = sortDirection === 'asc' ? 1 : -1
    return dir * multiplier
  })

  const userCanShare = groups.find(group => group.is_teaching)
  function rowRenderer({ key, index, style }) {
    return (
      <div key={key} style={{ ...style, paddingRight: '0.5em', paddingLeft: '0.5em' }}>
        <StoryListItem
          key={key}
          userCanShare={userCanShare}
          libraryShown={libraries}
          story={libraryFilteredStories[index]}
          selectedGroup={savedGroupSelection}
        />
      </div>
    )
  }

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm pt-lg">
      {libraryControls}
      <Card.Group itemsPerRow={1} doubling data-cy="story-items">
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <List
              autoHeight
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              rowCount={libraryFilteredStories.length}
              rowHeight={130}
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
