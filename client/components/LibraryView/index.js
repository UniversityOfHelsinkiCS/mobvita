import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Placeholder,
  Card,
  Select,
  Icon,
  Dropdown,
  Accordion,
  AccordionTitle,
  AccordionContent,
} from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import StoryListItem from 'Components/LibraryView/StoryListItem'
import { useIntl, FormattedMessage } from 'react-intl'
import LibraryTabs from 'Components/LibraryTabs'
import { backgroundColors, capitalize, hiddenFeatures, useLearningLanguage } from 'Utilities/common'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { useHistory } from 'react-router'
import { List, WindowScroller } from 'react-virtualized'
import {
  updateLibrarySelect,
  updateGroupSelect,
  updateSortCriterion,
  libraryTourViewed,
} from 'Utilities/redux/userReducer'
import { getAllStories, setLastQuery } from 'Utilities/redux/storiesReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import AddStoryModal from 'Components/AddStoryModal'
import { startLibraryTour } from 'Utilities/redux/tourReducer'
import LibrarySearch from './LibrarySearch'
import Spinner from 'Components/Spinner'

const StoryList = () => {
  const intl = useIntl()
  const history = useHistory()
  const {
    library_sort_criterion: savedSortCriterion,
    last_selected_library: savedLibrarySelection,
    last_selected_group: savedGroupSelection,
    oid: userId,
  } = useSelector(({ user }) => user.data.user)
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const refreshed = useSelector(({ user }) => user.refreshed)
  const { groups, deleteSuccessful } = useSelector(({ groups }) => groups)
  const currentGroup = groups.find(g => g.group_id === savedGroupSelection)
  const { pending, data: stories, searchResults, lastQuery } = useSelector(({ stories }) => stories)
  const { sharedToGroupSinceLastFetch } = useSelector(({ share }) => share)
  const learningLanguage = useLearningLanguage()

  const smallWindow = useWindowDimensions().width < 520

  const smallScreenSearchbar = useRef()
  const bigScreen = useWindowDimensions().width >= 700

  const [sorter, setSorter] = useState(savedSortCriterion[savedLibrarySelection].sort_by)
  const [sortDirection, setSortDirection] = useState(
    savedSortCriterion[savedLibrarySelection].direction
  )
  const [addStoryModalOpen, setAddStoryModalOpen] = useState(false)
  const [smallScreenSearchOpen, setSmallScreenSearchOpen] = useState(false)
  const [displayedStories, setDisplayedStories] = useState(stories)
  const [displaySearchResults, setDisplaySearchResults] = useState(false)
  const [accordionState, setAccordionState] = useState(-1)
  const groupsLibrary = history.location.pathname.includes('group')
  const privateLibrary = history.location.pathname.includes('private')
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
    if (groupsLibrary) {
      setLibrary('group')
    }
    if (privateLibrary) {
      setLibrary('private')
    }
  }, [])

  useEffect(() => {
    if (sharedToGroupSinceLastFetch || deleteSuccessful) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        })
      )
    }
  }, [sharedToGroupSinceLastFetch, deleteSuccessful])

  useEffect(() => {
    dispatch(getGroups())
    dispatch(setLastQuery(null))
    setDisplayedStories(stories)
  }, [])

  useEffect(() => {
    if (!groups.find(g => g.group_id === savedGroupSelection) && groups[0]) {
      dispatch(updateGroupSelect(groups[0].group_id))
    }
  }, [groups])

  useEffect(() => {
    if (!groupsLibrary && !privateLibrary) {
      setLibrary(savedLibrarySelection)
      if (savedLibrarySelection === 'public' && sorter === 'date') {
        setSorter('title')
      }
    }
  }, [])

  useEffect(() => {
    if (stories && !displaySearchResults) setDisplayedStories(stories)
  }, [stories])

  useEffect(() => {
    if (displaySearchResults) {
      setDisplayedStories(searchResults)
    }
  }, [searchResults])

  useEffect(() => {
    if (smallScreenSearchbar.current && smallScreenSearchOpen) smallScreenSearchbar.current.focus()
  }, [smallScreenSearchOpen])

  const handleGroupChange = (_e, option) => {
    dispatch(updateGroupSelect(option.value))
  }

  useEffect(() => {
    if (!user.user.has_seen_library_tour) {
      dispatch(libraryTourViewed())
      dispatch(startLibraryTour())
    }
  }, [])

  const handleSearchIconClick = () => {
    if (smallScreenSearchOpen) {
      setSmallScreenSearchOpen(false)
    } else {
      setSmallScreenSearchOpen(true)
    }
  }

  const sortDropdownOptions = [
    { key: 'title', text: intl.formatMessage({ id: 'sort-by-title-option' }), value: 'title' },
    { key: 'progress', text: intl.formatMessage({ id: 'Progress' }), value: 'progress' },
  ]

  if (savedLibrarySelection === 'private' || savedLibrarySelection === 'group') {
    sortDropdownOptions.push({
      key: 'difficulty',
      text: intl.formatMessage({ id: 'story-difficulty' }),
      value: 'difficulty',
    })
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

  const libraryControls = (
    <div data-cy="library-controls" className="library-control">
      <AddStoryModal open={addStoryModalOpen} setOpen={setAddStoryModalOpen} />

      <Button
        className="tour-add-new-stories"
        onClick={() => setAddStoryModalOpen(true)}
        data-cy="add-story-button"
        size="big"
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '0 auto 2em auto',
          padding: '1rem 0',
          width: '50%',
          border: '2px solid #000',
          fontSize: '1.3em',
          fontWeight: 500,
        }}
      >
        {intl.formatMessage({ id: 'add-your-stories' })}
      </Button>

      <LibraryTabs
        values={libraries}
        onClick={handleLibraryChange}
        reverse
        savedGroupSelection={savedGroupSelection}
        groupDropdownOptions={groupDropdownOptions}
        groupDropdownDisabled={!libraries.group}
        handleGroupChange={handleGroupChange}
      />
    </div>
  )

  const searchAndSortControls = (
    <>
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
          <LibrarySearch
            setDisplayedStories={setDisplayedStories}
            setDisplaySearchResults={setDisplaySearchResults}
          />
        )}
      </div>

      {smallScreenSearchOpen && (
        <LibrarySearch
          setDisplayedStories={setDisplayedStories}
          setDisplaySearchResults={setDisplaySearchResults}
          fluid
        />
      )}
    </>
  )

  if (pending || !refreshed) {
    return <Spinner fullHeight size={60} text={intl.formatMessage({ id: 'loading' })} textSize={20} />
  }

  const librariesToShow = Object.entries(libraries)
    .filter(entry => entry[1])
    .map(([key]) => capitalize(key))

  const libraryFilteredStories = displayedStories.filter(story => {
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
      const group = story.groups.find(g => g.group_id == savedGroupSelection)
      if (group && (group.hidden === undefined || !group.hidden || currentGroup?.is_teaching)) {
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

  const noResults = !pending && libraryFilteredStories.length === 0

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
  /*
  function rowRenderer({ key, index, style }) {
    return (
      <div
        key={key}
        style={{ ...style, paddingRight: '0.5em', paddingLeft: '0.5em' }}
        className={'tour-lmao'}
      >
        <StoryListItem
          key={key}
          libraryShown={libraries}
          story={libraryFilteredStories[index]}
          selectedGroup={savedGroupSelection}
        />
      </div>
    )
  }
  */

  const accordionView = () => {
    const storyId2Index = libraryFilteredStories.reduce((acc, story, index) => {
      acc[story._id] = index
      return acc
    }, {})
    const libraryGroup =
      (libraryFilteredStories &&
        libraryFilteredStories.reduce((x, y) => {
          ;(x[y.difficulty] = x[y.difficulty] || []).push(y)
          return x
        }, {})) ||
      {}
    const handleClick = (e, props) => {
      const { index } = props
      const newIndex = accordionState === index ? -1 : index
      setAccordionState(newIndex)
    }
    return (
      <Accordion fluid styled style={{ background: '#fffaf0' }}>
        {Object.keys(libraryGroup)
          .sort((a, b) => stringToDifficulty(a) - stringToDifficulty(b))
          .map((group, index) => (
            <>
              <AccordionTitle
                key={`story-group-title-${group}`}
                active={accordionState === index}
                index={index}
                onClick={handleClick}
              >
                <h4>
                  <Icon name="dropdown" />
                  <FormattedMessage id={`level-${group}`} />
                  {/* <FormattedMessage id='story-group' values={{group}}/> */}
                </h4>
              </AccordionTitle>
              <AccordionContent
                key={`story-group-content-${group}`}
                active={accordionState === index}
              >
                <Card.Group itemsPerRow={2} doubling={!bigScreen}>
                  {libraryGroup[group].map((story, storyIdx) => (
                    <StoryListItem
                      key={`story-${story._id}`}
                      libraryShown={libraries}
                      story={libraryGroup[group][storyIdx]}
                      selectedGroup={savedGroupSelection}
                      style={{ padding: '0' }}
                    />
                  ))}
                </Card.Group>
              </AccordionContent>
            </>
          ))}
      </Accordion>
    )
  }

  return (
    <div className="cont-tall pt-lg cont flex-col auto library-tour-start">
      {libraryControls}
      <div className="universal-background">
        {libraries.group && (
          <div className="library-group-dropdown-container">
            <Select
              value={savedGroupSelection}
              options={groupDropdownOptions}
              onChange={handleGroupChange}
              style={{ color: '#777', width: '100%' }}
              />
          </div>
        )}
        {searchAndSortControls}
        {lastQuery && (
          <div className="mt-nm ml-sm gap-col-sm">
            <span>
              <FormattedMessage id="showing-results-for" /> &quot;{lastQuery}&quot;:
            </span>
          </div>
        )}

        {noResults && (
          <div className="justify-center mt-lg" style={{ color: 'rgb(112, 114, 120)' }}>
            <FormattedMessage id="no-stories-found" />
          </div>
        )}
        {!noResults && libraries.public && accordionView()}
        {!noResults && !libraries.public && (
          <Card.Group
            itemsPerRow={2}
            doubling={!bigScreen}
            data-cy="story-items"
            style={{ margin: '6px' }}
          >
            {libraryFilteredStories.map((story, index) => (
              <StoryListItem
                key={story._id}
                libraryShown={libraries}
                story={libraryFilteredStories[index]}
                selectedGroup={savedGroupSelection}
                savedLibrarySelection={savedLibrarySelection}
              />
            ))}
            {/* <WindowScroller>
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
          </WindowScroller> */}
          </Card.Group>
        )}
      </div>
    </div>
  )
}

export default StoryList
