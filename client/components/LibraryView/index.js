import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import { Button } from 'react-bootstrap'
import StoryListItem from 'Components/LibraryView/StoryListItem'
import { useIntl, FormattedMessage } from 'react-intl'
import LibraryTabs from 'Components/LibraryTabs'
import { capitalize, useLearningLanguage } from 'Utilities/common'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { useLocation } from 'react-router-dom'
import {
  updateLibrarySelect,
  updateGroupSelect,
  updateSortCriterion,
  libraryTourViewed,
} from 'Utilities/redux/userReducer'
import { getAllStories, setLastQuery, clearFocusedStory } from 'Utilities/redux/storiesReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import AddStoryModal from 'Components/AddStoryModal'
import { startLibraryTour } from 'Utilities/redux/tourReducer'
import LibrarySearch from './LibrarySearch'
import Spinner from 'Components/Spinner'
import FolderCard from './FolderCard'

const StoryList = () => {
  const intl = useIntl()
  const location = useLocation()

  const {
    library_sort_criterion: savedSortCriterion,
    last_selected_library: savedLibrarySelection,
    last_selected_group: savedGroupSelection,
    oid: userId,
  } = useSelector(({ user }) => user.data.user)
  const user = useSelector(({ user }) => user.data)
  const refreshed = useSelector(({ user }) => user.refreshed)
  const { groups, deleteSuccessful } = useSelector(({ groups }) => groups)
  const currentGroup = groups.find(g => g.group_id === savedGroupSelection)
  const { pending, data: stories, searchResults, lastQuery } = useSelector(({ stories }) => stories)
  const { sharedToGroupSinceLastFetch } = useSelector(({ share }) => share)
  const learningLanguage = useLearningLanguage()

  const smallWindow = useWindowDimensions().width < 520

  const [sorter, setSorter] = React.useState(savedSortCriterion[savedLibrarySelection].sort_by)
  const [sortDirection, setSortDirection] = React.useState(
    savedSortCriterion[savedLibrarySelection].direction,
  )
  const [addStoryModalOpen, setAddStoryModalOpen] = React.useState(false)
  const [smallScreenSearchOpen, setSmallScreenSearchOpen] = React.useState(false)
  const [displayedStories, setDisplayedStories] = React.useState(stories)
  const [displaySearchResults, setDisplaySearchResults] = React.useState(false)
  const [accordionState, setAccordionState] = React.useState(-1)
  const groupsLibrary = location.pathname.includes('group')
  const privateLibrary = location.pathname.includes('private')
  const [libraries, setLibraries] = React.useState({
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
        }),
      )
    }
  }

  React.useEffect(() => {
    if (groupsLibrary) {
      setLibrary('group')
    }
    if (privateLibrary) {
      setLibrary('private')
    }
  }, [])

  React.useEffect(() => {
    if (sharedToGroupSinceLastFetch || deleteSuccessful) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        }),
      )
    }
  }, [sharedToGroupSinceLastFetch, deleteSuccessful])

  React.useEffect(() => {
    dispatch(clearFocusedStory())
    dispatch(getGroups())
    dispatch(setLastQuery(null))
    setDisplayedStories(stories)
  }, [])

  React.useEffect(() => {
    if (!groups.find(g => g.group_id === savedGroupSelection) && groups[0]) {
      dispatch(updateGroupSelect(groups[0].group_id))
    }
  }, [groups])

  React.useEffect(() => {
    if (!groupsLibrary && !privateLibrary) {
      setLibrary(savedLibrarySelection)
      if (savedLibrarySelection === 'public' && sorter === 'date') {
        setSorter('title')
      }
    }
  }, [])

  React.useEffect(() => {
    if (stories && !displaySearchResults) setDisplayedStories(stories)
  }, [stories])

  React.useEffect(() => {
    if (displaySearchResults) {
      setDisplayedStories(searchResults)
    }
  }, [searchResults])

  const handleGroupChange = event => {
    dispatch(updateGroupSelect(event.target.value))
  }

  React.useEffect(() => {
    if (!user.user.has_seen_library_tour) {
      dispatch(libraryTourViewed())
      dispatch(startLibraryTour())
    }
  }, [])

  const handleSearchIconClick = () => {
    setSmallScreenSearchOpen(!smallScreenSearchOpen)
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

  const handleSortChange = event => {
    const newSorter = event.target.value
    setSorter(newSorter)
    dispatch(
      updateSortCriterion({
        ...savedSortCriterion,
        [savedLibrarySelection]: {
          sort_by: newSorter,
          direction: sortDirection,
        },
      }),
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
      }),
    )
  }

  const libraryControls = (
    <Box data-cy="library-controls" className="library-control">
      <AddStoryModal open={addStoryModalOpen} setOpen={setAddStoryModalOpen} />

      <Button
        className="tour-add-new-stories"
        onClick={() => setAddStoryModalOpen(true)}
        data-cy="add-story-button"
        variant="primary"
        size="large"
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
    </Box>
  )

  const searchAndSortControls = (
    <>
      <Box
        className="search-and-sort"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box className="flex align-center" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select value={sorter} onChange={handleSortChange}>
              {sortDropdownOptions.map(option => (
                <MenuItem key={option.key} value={option.value}>
                  {option.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton aria-label="Toggle sort direction" onClick={handleDirectionChange}>
            {sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </Box>

        {smallWindow ? (
          <IconButton aria-label="Search library" onClick={handleSearchIconClick}>
            {smallScreenSearchOpen ? <CloseIcon /> : <SearchIcon />}
          </IconButton>
        ) : (
          <LibrarySearch
            setDisplayedStories={setDisplayedStories}
            setDisplaySearchResults={setDisplaySearchResults}
          />
        )}
      </Box>

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
    return <Spinner fullHeight size={60} text={intl.formatMessage({ id: 'loading' })} />
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

  const renderStoryGrid = storiesToRender => (
    <Box data-cy="story-items" className="library-story-grid">
      {!libraries.public && <FolderCard name="Example folder" onClick={() => {}} />}
      {storiesToRender.map(story => (
        <StoryListItem
          key={story._id}
          libraryShown={libraries}
          story={story}
          selectedGroup={savedGroupSelection}
          savedLibrarySelection={savedLibrarySelection}
        />
      ))}
    </Box>
  )

  const accordionView = () => {
    const libraryGroup =
      (libraryFilteredStories &&
        libraryFilteredStories.reduce((groupsByDifficulty, story) => {
          const difficultyGroup = groupsByDifficulty[story.difficulty] || []
          difficultyGroup.push(story)
          groupsByDifficulty[story.difficulty] = difficultyGroup
          return groupsByDifficulty
        }, {})) ||
      {}

    return (
      <Box sx={{ background: '#fffaf0' }}>
        {Object.keys(libraryGroup)
          .sort((a, b) => stringToDifficulty(a) - stringToDifficulty(b))
          .map((group, index) => (
            <Accordion
              key={`story-group-block-${group}`}
              expanded={accordionState === index}
              onChange={() => setAccordionState(accordionState === index ? -1 : index)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography component="h4" sx={{ fontWeight: 700 }}>
                  <FormattedMessage id={`level-${group}`} />
                </Typography>
              </AccordionSummary>
              <AccordionDetails>{renderStoryGrid(libraryGroup[group])}</AccordionDetails>
            </Accordion>
          ))}
      </Box>
    )
  }

  return (
    <Box className="cont-tall pt-lg cont flex-col auto library-tour-start">
      {libraryControls}
      <Box className="universal-background" sx={{ margin: '0 7px' }}>
        {libraries.group && (
          <Box className="library-group-dropdown-container">
            <FormControl size="small" fullWidth>
              <Select
                value={savedGroupSelection}
                onChange={handleGroupChange}
                sx={{ color: '#777', width: '100%' }}
              >
                {groupDropdownOptions.map(option => (
                  <MenuItem key={option.key} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        {searchAndSortControls}
        {lastQuery && (
          <Box className="mt-nm ml-sm gap-col-sm">
            <Typography component="span">
              <FormattedMessage id="showing-results-for" /> &quot;{lastQuery}&quot;:
            </Typography>
          </Box>
        )}

        {noResults && (
          <Box className="justify-center mt-lg" sx={{ color: 'rgb(112, 114, 120)' }}>
            <FormattedMessage id="no-stories-found" />
          </Box>
        )}
        {!noResults && libraries.public && accordionView()}
        {!libraries.public && renderStoryGrid(libraryFilteredStories)}
      </Box>
    </Box>
  )
}

export default StoryList
