import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Breadcrumbs,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp'
import ArrowDropUpSharpIcon from '@mui/icons-material/ArrowDropUpSharp'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import AppButton from 'Components/AppButton'
import StoryListItem from 'Components/LibraryView/StoryListItem'
import { useIntl, FormattedMessage } from 'react-intl'
import LibraryTabs from 'Components/LibraryTabs'
import { capitalize, useLearningLanguage } from 'Utilities/common'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  updateLibrarySelect,
  updateGroupSelect,
  updateSortCriterion,
  libraryTourViewed,
} from 'Utilities/redux/userReducer'
import {
  getAllStories,
  setLastQuery,
  clearFocusedStory,
  updateStoryPath,
  removeStory,
} from 'Utilities/redux/storiesReducer'
import {
  getWritingEssays,
  getWritingEssay,
  writingEssayHasContent,
  getWritingEssayId,
  getWritingEssaySavedDate,
  removeWritingEssay,
  updateWritingEssayPath,
} from 'Utilities/redux/writingCorrectionReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import AddStoryModal from 'Components/AddStoryModal'
import { startLibraryTour } from 'Utilities/redux/tourReducer'
import LibrarySearch from './LibrarySearch'
import Spinner from 'Components/Spinner'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import FolderCard from './FolderCard'
import AddFolder from './AddFolder'
import EssayListItem from './EssayListItem'
import GeneralChatbot from 'Components/ChatBot/GeneralChatbot'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'
import {
  addLocalFolder,
  getFoldersForPath,
  getLocalFolderPathsForLibrary,
  getLocalFolderStorageKey,
  getStoriesForPath,
  getStoriesInFolder,
  getStoredLocalFolders,
  normalizeLibraryPath,
  removeLocalFolder,
  saveStoredLocalFolders,
} from './folderUtils'
import useLibraryDragAndDrop from './useLibraryDragAndDrop'

const StoryList = () => {
  const intl = useIntl()
  const location = useLocation()
  const navigate = useNavigate()

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
  const essays = useSelector(state => state.writingCorrection.essays)
  const essaysPending = useSelector(state => state.writingCorrection.essaysPending)
  const { sharedToGroupSinceLastFetch } = useSelector(({ share }) => share)
  const learningLanguage = useLearningLanguage()
  const isSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)
  const localFolderStorageKey = getLocalFolderStorageKey(userId, learningLanguage)

  const smallWindow = useWindowDimensions().width < 520

  const [sorter, setSorter] = useState(
    savedSortCriterion?.[savedLibrarySelection]?.sort_by || 'title',
  )
  const [sortDirection, setSortDirection] = useState(
    savedSortCriterion?.[savedLibrarySelection]?.direction || 'asc',
  )
  const [addStoryModalOpen, setAddStoryModalOpen] = useState(false)
  const [smallScreenSearchOpen, setSmallScreenSearchOpen] = useState(false)
  const [displayedStories, setDisplayedStories] = useState(stories)
  const [displaySearchResults, setDisplaySearchResults] = useState(false)
  const [currentLibraryPath, setCurrentLibraryPath] = useState('')
  const [localFolders, setLocalFolders] = useState(() =>
    getStoredLocalFolders(localFolderStorageKey),
  )
  const [loadedLocalFolderStorageKey, setLoadedLocalFolderStorageKey] =
    useState(localFolderStorageKey)
  const [folderDeleteRequest, setFolderDeleteRequest] = useState(null)
  const [essaySearchQuery, setEssaySearchQuery] = useState('')
  const groupsLibrary = location.pathname.includes('group')
  const privateLibrary = location.pathname.includes('private')
  const [libraries, setLibraries] = useState({
    public: false,
    private: false,
    essays: false,
    group: false,
  })
  const dispatch = useDispatch()
  const librariesToShow = Object.entries(libraries)
    .filter(entry => entry[1])
    .map(([key]) => capitalize(key))
  const activeLibrary = Object.entries(libraries).find(([, isActive]) => isActive)?.[0] || 'public'
  const libraryIsMutable = activeLibrary !== 'public'
  const essaysLibraryActive = activeLibrary === 'essays'
  const uploadedEssays = essays.filter(writingEssayHasContent)
  const {
    clearDragState,
    draggedStoryIds,
    dragOverFolderPath,
    handleFolderDragLeave,
    handleFolderDragOver,
    handleFolderDrop,
    handleStoryDragEnd,
    handleStoryDragStart,
  } = useLibraryDragAndDrop({
    libraryIsMutable,
    onMoveStories: handleMoveStoriesToPath,
  })
  // A second drag-and-drop context for essays (same mechanics, moves via updateWritingEssayPath).
  const {
    clearDragState: clearEssayDragState,
    draggedStoryIds: draggedEssayIds,
    dragOverFolderPath: essayDragOverFolderPath,
    handleFolderDragLeave: handleEssayFolderDragLeave,
    handleFolderDragOver: handleEssayFolderDragOver,
    handleFolderDrop: handleEssayFolderDrop,
    handleStoryDragEnd: handleEssayDragEnd,
    handleStoryDragStart: handleEssayDragStart,
  } = useLibraryDragAndDrop({
    libraryIsMutable: essaysLibraryActive,
    onMoveStories: handleMoveEssaysToPath,
  })

  useEffect(() => {
    if (loadedLocalFolderStorageKey === localFolderStorageKey) return

    setLocalFolders(getStoredLocalFolders(localFolderStorageKey))
    setLoadedLocalFolderStorageKey(localFolderStorageKey)
  }, [loadedLocalFolderStorageKey, localFolderStorageKey])

  useEffect(() => {
    if (loadedLocalFolderStorageKey !== localFolderStorageKey) return

    saveStoredLocalFolders(localFolderStorageKey, localFolders)
  }, [loadedLocalFolderStorageKey, localFolderStorageKey, localFolders])

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
    setCurrentLibraryPath('')
    setEssaySearchQuery('')
    clearDragState()
    clearEssayDragState()
    setSorter(savedSortCriterion?.[library]?.sort_by || 'title')
    setSortDirection(savedSortCriterion?.[library]?.direction || 'asc')
    if (library === 'group' && sharedToGroupSinceLastFetch) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        }),
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
    if (
      (sharedToGroupSinceLastFetch || deleteSuccessful) &&
      (groupsLibrary || savedLibrarySelection === 'group')
    ) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        }),
      )
    }
  }, [sharedToGroupSinceLastFetch, deleteSuccessful])

  useEffect(() => {
    dispatch(clearFocusedStory())
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

  const handleGroupChange = event => {
    dispatch(updateGroupSelect(event.target.value))
  }

  useEffect(() => {
    if (!user.user.has_seen_library_tour) {
      dispatch(libraryTourViewed())
      dispatch(startLibraryTour())
    }
  }, [])

  // Prefetch the user's essays on mount (and on language change), like stories are prefetched, so the
  // "My Essays" tab shows its content immediately when selected instead of loading on activation.
  useEffect(() => {
    if (learningLanguage) dispatch(getWritingEssays(capitalize(learningLanguage)))
  }, [learningLanguage])

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

  const essaySortDropdownOptions = [
    { key: 'title', text: intl.formatMessage({ id: 'sort-by-title-option' }), value: 'title' },
    { key: 'date', text: intl.formatMessage({ id: 'date-added' }), value: 'date' },
  ]
  // sorter is shared per-library state; coerce to a valid essay option so the Select never warns.
  const essaySorter = essaySortDropdownOptions.some(option => option.value === sorter)
    ? sorter
    : 'title'

  const groupDropdownOptions = groups.map(group => ({
    key: group.group_id,
    text: group.groupName,
    value: group.group_id,
  }))

  const dropdownMenuProps = {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    PaperProps: {
      className: 'library-dropdown-menu',
      sx: {
        backgroundColor: '#ffffff',
      },
    },
    MenuListProps: {
      className: 'library-dropdown-menu-list',
    },
  }

  // Persist under activeLibrary (synchronous local state that sorter/sortDirection track), not the
  // async-lagging Redux savedLibrarySelection, so the preference is saved for the displayed library.
  const handleSortChange = e => {
    const newSorter = e.target.value
    setSorter(newSorter)
    dispatch(
      updateSortCriterion({
        ...savedSortCriterion,
        [activeLibrary]: {
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
        [activeLibrary]: {
          sort_by: sorter,
          direction: newDirection,
        },
      }),
    )
  }

  const libraryControls = (
    <Box data-cy="library-controls" className="library-control">
      <AddStoryModal open={addStoryModalOpen} setOpen={setAddStoryModalOpen} />

      <AppButton
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
      </AppButton>

      <LibraryTabs
        values={libraries}
        onClick={handleLibraryChange}
        order={['public', 'private', 'essays', 'group']}
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
            <Select
              value={sorter}
              onChange={handleSortChange}
              className="library-semantic-select"
              MenuProps={dropdownMenuProps}
            >
              {sortDropdownOptions.map(option => (
                <MenuItem className="library-dropdown-item" key={option.key} value={option.value}>
                  {option.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton aria-label="Toggle sort direction" onClick={handleDirectionChange}>
            {sortDirection === 'asc' ? (
              <ArrowDropUpSharpIcon fontSize="large" />
            ) : (
              <ArrowDropDownSharpIcon fontSize="large" />
            )}
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

  // Sort (title/date) + title search for the "My Essays" library, styled like the story controls.
  const essaySearchAndSortControls = (
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={essaySorter}
            onChange={handleSortChange}
            className="library-semantic-select"
            MenuProps={dropdownMenuProps}
          >
            {essaySortDropdownOptions.map(option => (
              <MenuItem className="library-dropdown-item" key={option.key} value={option.value}>
                {option.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton aria-label="Toggle sort direction" onClick={handleDirectionChange}>
          {sortDirection === 'asc' ? (
            <ArrowDropUpSharpIcon fontSize="large" />
          ) : (
            <ArrowDropDownSharpIcon fontSize="large" />
          )}
        </IconButton>
      </Box>

      <Box className="library-search-control">
        <TextField
          className="library-search-field"
          placeholder={intl.formatMessage({ id: 'search-input-placeholder' })}
          value={essaySearchQuery}
          onChange={event => setEssaySearchQuery(event.target.value)}
          fullWidth
          size="small"
        />
        <IconButton
          className="library-search-button"
          aria-label={essaySearchQuery ? 'Clear search' : 'Search essays'}
          onClick={() => essaySearchQuery && setEssaySearchQuery('')}
        >
          {essaySearchQuery ? <CloseIcon /> : <SearchIcon />}
        </IconButton>
      </Box>
    </Box>
  )

  if (pending || !refreshed) {
    return <Spinner fullHeight size={60} text={intl.formatMessage({ id: 'loading' })} />
  }

  const storyIsInActiveLibrary = story => {
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
  }

  const libraryFilteredStories = displayedStories.filter(storyIsInActiveLibrary)
  const allStoriesInActiveLibrary = stories.filter(storyIsInActiveLibrary)

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

  const libraryPathParts = currentLibraryPath ? currentLibraryPath.split('/') : []
  const localFolderPathsForLibrary = getLocalFolderPathsForLibrary(
    localFolders,
    libraryIsMutable,
    activeLibrary,
  )

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

  const handleLibraryPathChange = path => {
    setCurrentLibraryPath(normalizeLibraryPath(path))
    clearDragState()
  }

  const handleEssayLibraryPathChange = path => {
    setCurrentLibraryPath(normalizeLibraryPath(path))
    clearEssayDragState()
  }

  function handleMoveStoriesToPath(storyIds, targetPath) {
    if (!libraryIsMutable) return

    const normalizedTargetPath = normalizeLibraryPath(targetPath)
    const storyIdSet = new Set(storyIds.map(storyId => String(storyId)))
    const storiesToMove = libraryFilteredStories.filter(
      story =>
        storyIdSet.has(String(story._id)) &&
        normalizeLibraryPath(story.path) !== normalizedTargetPath,
    )

    storiesToMove.forEach(story => {
      dispatch(updateStoryPath(story._id, normalizedTargetPath))
    })
  }

  function handleMoveEssaysToPath(essayIds, targetPath) {
    if (!essaysLibraryActive || !learningLanguage) return

    const normalizedTargetPath = normalizeLibraryPath(targetPath)
    const essayIdSet = new Set(essayIds.map(id => String(id)))
    const essaysToMove = uploadedEssays.filter(essay => {
      const id = getWritingEssayId(essay)
      return (
        id != null &&
        essayIdSet.has(String(id)) &&
        normalizeLibraryPath(essay.path) !== normalizedTargetPath
      )
    })

    essaysToMove.forEach(essay => {
      dispatch(
        updateWritingEssayPath(
          capitalize(learningLanguage),
          getWritingEssayId(essay),
          normalizedTargetPath,
        ),
      )
    })
  }

  const folderIsLocalOnly = folderPath =>
    localFolderPathsForLibrary.includes(normalizeLibraryPath(folderPath))

  const renderLibraryPathBreadcrumbs = () => (
    <Box className="library-folder-breadcrumbs">
      <Breadcrumbs aria-label="Library folder path">
        <button
          type="button"
          className="library-folder-breadcrumb"
          onClick={() => handleLibraryPathChange('')}
          onDragLeave={e => handleFolderDragLeave('', e)}
          onDragOver={e => handleFolderDragOver('', e)}
          onDrop={e => handleFolderDrop('', e)}
        >
          <FormattedMessage id={capitalize(activeLibrary)} />
        </button>
        {libraryPathParts.map((part, index) => {
          const path = libraryPathParts.slice(0, index + 1).join('/')
          const isCurrentFolder = path === currentLibraryPath

          if (isCurrentFolder) {
            return (
              <Typography key={path} className="library-folder-breadcrumb-current">
                {part}
              </Typography>
            )
          }

          return (
            <button
              type="button"
              key={path}
              className="library-folder-breadcrumb"
              onClick={() => handleLibraryPathChange(path)}
              onDragLeave={e => handleFolderDragLeave(path, e)}
              onDragOver={e => handleFolderDragOver(path, e)}
              onDrop={e => handleFolderDrop(path, e)}
            >
              {part}
            </button>
          )
        })}
      </Breadcrumbs>
    </Box>
  )

  const handleAddFolder = folderName => {
    if (!libraryIsMutable) return

    const newFolderPath = normalizeLibraryPath(
      currentLibraryPath ? `${currentLibraryPath}/${folderName}` : folderName,
    )

    setLocalFolders(currentLocalFolders =>
      addLocalFolder(currentLocalFolders, activeLibrary, newFolderPath),
    )
  }

  const handleRemoveLocalFolder = folderPath => {
    if (!libraryIsMutable) return

    const normalizedFolderPath = normalizeLibraryPath(folderPath)

    setLocalFolders(currentLocalFolders =>
      removeLocalFolder(currentLocalFolders, activeLibrary, normalizedFolderPath),
    )
  }

  const handleDeleteFolderRequest = folderPath => {
    if (!libraryIsMutable) return

    const normalizedFolderPath = normalizeLibraryPath(folderPath)
    const storiesInFolder = getStoriesInFolder(allStoriesInActiveLibrary, normalizedFolderPath)

    if (storiesInFolder.length === 0) {
      handleRemoveLocalFolder(normalizedFolderPath)
      return
    }

    setFolderDeleteRequest({
      path: normalizedFolderPath,
      storyIds: storiesInFolder.map(story => story._id),
    })
  }

  const handleDeleteEssayFolderRequest = folderPath => {
    if (!essaysLibraryActive) return

    const normalizedFolderPath = normalizeLibraryPath(folderPath)
    const essaysInFolder = getStoriesInFolder(uploadedEssays, normalizedFolderPath)

    if (essaysInFolder.length === 0) {
      handleRemoveLocalFolder(normalizedFolderPath)
      return
    }

    setFolderDeleteRequest({
      path: normalizedFolderPath,
      essayIds: essaysInFolder.map(essay => getWritingEssayId(essay)),
    })
  }

  const handleConfirmFolderDelete = () => {
    if (!folderDeleteRequest) return

    ;(folderDeleteRequest.storyIds || []).forEach(storyId => {
      dispatch(removeStory(storyId))
    })
    if (learningLanguage) {
      ;(folderDeleteRequest.essayIds || []).forEach(essayId => {
        dispatch(removeWritingEssay(capitalize(learningLanguage), essayId))
      })
    }

    handleRemoveLocalFolder(folderDeleteRequest.path)
    setFolderDeleteRequest(null)
  }

  const renderEssayPathBreadcrumbs = () => (
    <Box className="library-folder-breadcrumbs">
      <Breadcrumbs aria-label="Essay folder path">
        <button
          type="button"
          className="library-folder-breadcrumb"
          onClick={() => handleEssayLibraryPathChange('')}
          onDragLeave={e => handleEssayFolderDragLeave('', e)}
          onDragOver={e => handleEssayFolderDragOver('', e)}
          onDrop={e => handleEssayFolderDrop('', e)}
        >
          <FormattedMessage id="my-essays" />
        </button>
        {libraryPathParts.map((part, index) => {
          const path = libraryPathParts.slice(0, index + 1).join('/')
          const isCurrentFolder = path === currentLibraryPath

          if (isCurrentFolder) {
            return (
              <Typography key={path} className="library-folder-breadcrumb-current">
                {part}
              </Typography>
            )
          }

          return (
            <button
              type="button"
              key={path}
              className="library-folder-breadcrumb"
              onClick={() => handleEssayLibraryPathChange(path)}
              onDragLeave={e => handleEssayFolderDragLeave(path, e)}
              onDragOver={e => handleEssayFolderDragOver(path, e)}
              onDrop={e => handleEssayFolderDrop(path, e)}
            >
              {part}
            </button>
          )
        })}
      </Breadcrumbs>
    </Box>
  )

  const renderFolderBrowser = () => {
    const foldersInCurrentPath = getFoldersForPath(
      libraryFilteredStories,
      currentLibraryPath,
      localFolderPathsForLibrary,
    )
    const storiesInCurrentPath = getStoriesForPath(libraryFilteredStories, currentLibraryPath)
    const folderIsEmpty = foldersInCurrentPath.length === 0 && storiesInCurrentPath.length === 0

    return (
      <>
        <Box className="library-folder-header">
          {renderLibraryPathBreadcrumbs()}
          {libraryIsMutable && (
            <AddFolder existingFolderNames={foldersInCurrentPath} onAddFolder={handleAddFolder} />
          )}
        </Box>
        {folderIsEmpty ? (
          <Box className="justify-center mt-lg" sx={{ color: 'rgb(112, 114, 120)' }}>
            <FormattedMessage id="no-stories-found" />
          </Box>
        ) : (
          <Box data-cy="story-items" className="library-story-grid">
            {foldersInCurrentPath.map(folderName => {
              const folderPath = currentLibraryPath
                ? `${currentLibraryPath}/${folderName}`
                : folderName
              const normalizedFolderPath = normalizeLibraryPath(folderPath)
              const storiesInFolder = getStoriesInFolder(
                allStoriesInActiveLibrary,
                normalizedFolderPath,
              )
              const folderIsEmptyLocal =
                folderIsLocalOnly(normalizedFolderPath) && storiesInFolder.length === 0

              return (
                <FolderCard
                  key={normalizedFolderPath}
                  isDropTarget={libraryIsMutable && dragOverFolderPath === normalizedFolderPath}
                  isEmpty={folderIsEmptyLocal}
                  name={folderName}
                  onClick={() => handleLibraryPathChange(normalizedFolderPath)}
                  onDragLeave={
                    libraryIsMutable
                      ? e => handleFolderDragLeave(normalizedFolderPath, e)
                      : undefined
                  }
                  onDragOver={
                    libraryIsMutable
                      ? e => handleFolderDragOver(normalizedFolderPath, e)
                      : undefined
                  }
                  onDrop={
                    libraryIsMutable ? e => handleFolderDrop(normalizedFolderPath, e) : undefined
                  }
                  onDelete={
                    libraryIsMutable && storiesInFolder.length > 0
                      ? () => handleDeleteFolderRequest(normalizedFolderPath)
                      : undefined
                  }
                  onRemove={
                    folderIsEmptyLocal
                      ? () => handleRemoveLocalFolder(normalizedFolderPath)
                      : undefined
                  }
                />
              )
            })}
            {storiesInCurrentPath.map(story => (
              <StoryListItem
                key={story._id}
                draggable={libraryIsMutable}
                isDragging={draggedStoryIds.includes(story._id)}
                libraryShown={libraries}
                onDragEnd={handleStoryDragEnd}
                onDragStart={handleStoryDragStart}
                story={story}
                selectedGroup={savedGroupSelection}
                savedLibrarySelection={savedLibrarySelection}
              />
            ))}
          </Box>
        )}
      </>
    )
  }

  // Tapping an essay opens the essay-writing page for it: the essay is fetched into Redux and the
  // page renders by role (students continue the current text; teachers see a read-only
  // original-vs-current split) — handled inside EssayWritingView.
  const handleEssayCardOpen = essayId => {
    if (essayId && learningLanguage) {
      dispatch(getWritingEssay(capitalize(learningLanguage), essayId))
      navigate('/essay-writing', { state: { loadEssayId: essayId } })
    } else {
      navigate('/essay-writing')
    }
  }

  const renderEssaysLibrary = () => {
    const query = essaySearchQuery.trim().toLowerCase()
    const searchedEssays = query
      ? uploadedEssays.filter(essay => (essay.title || '').toLowerCase().includes(query))
      : uploadedEssays

    const sortedEssays = [...searchedEssays].sort((a, b) => {
      let dir = 0
      if (essaySorter === 'date') {
        const dateA = getWritingEssaySavedDate(a)
        const dateB = getWritingEssaySavedDate(b)
        dir = (dateB ? dateB.getTime() : 0) - (dateA ? dateA.getTime() : 0)
      } else {
        dir = (a.title || '').localeCompare(b.title || '')
      }
      return sortDirection === 'asc' ? dir : -dir
    })

    const foldersInCurrentPath = getFoldersForPath(
      sortedEssays,
      currentLibraryPath,
      localFolderPathsForLibrary,
    )
    const essaysInCurrentPath = getStoriesForPath(sortedEssays, currentLibraryPath)
    const folderIsEmpty = foldersInCurrentPath.length === 0 && essaysInCurrentPath.length === 0

    return (
      <>
        <Box className="library-folder-header">
          {renderEssayPathBreadcrumbs()}
          <AddFolder existingFolderNames={foldersInCurrentPath} onAddFolder={handleAddFolder} />
        </Box>
        {folderIsEmpty ? (
          // Render nothing during the initial prefetch (unless searching) to avoid a "no essays" flash.
          essaysPending && !query ? null : (
            <Box className="justify-center mt-lg" sx={{ color: 'rgb(112, 114, 120)' }}>
              <FormattedMessage id="no-essays-found" />
            </Box>
          )
        ) : (
          <Box data-cy="essay-items" className="library-story-grid">
            {foldersInCurrentPath.map(folderName => {
              const folderPath = currentLibraryPath
                ? `${currentLibraryPath}/${folderName}`
                : folderName
              const normalizedFolderPath = normalizeLibraryPath(folderPath)
              const essaysInFolder = getStoriesInFolder(uploadedEssays, normalizedFolderPath)
              const folderIsEmptyLocal =
                folderIsLocalOnly(normalizedFolderPath) && essaysInFolder.length === 0

              return (
                <FolderCard
                  key={normalizedFolderPath}
                  isDropTarget={essayDragOverFolderPath === normalizedFolderPath}
                  isEmpty={folderIsEmptyLocal}
                  name={folderName}
                  onClick={() => handleEssayLibraryPathChange(normalizedFolderPath)}
                  onDragLeave={e => handleEssayFolderDragLeave(normalizedFolderPath, e)}
                  onDragOver={e => handleEssayFolderDragOver(normalizedFolderPath, e)}
                  onDrop={e => handleEssayFolderDrop(normalizedFolderPath, e)}
                  onDelete={
                    essaysInFolder.length > 0
                      ? () => handleDeleteEssayFolderRequest(normalizedFolderPath)
                      : undefined
                  }
                  onRemove={
                    folderIsEmptyLocal
                      ? () => handleRemoveLocalFolder(normalizedFolderPath)
                      : undefined
                  }
                />
              )
            })}
            {essaysInCurrentPath.map((essay, index) => {
              const essayId = getWritingEssayId(essay)
              return (
                <EssayListItem
                  key={essayId || index}
                  essay={essay}
                  draggable={essaysLibraryActive && Boolean(essayId)}
                  isDragging={Boolean(essayId) && draggedEssayIds.includes(String(essayId))}
                  onDragStart={handleEssayDragStart}
                  onDragEnd={handleEssayDragEnd}
                  onOpen={essayId ? () => handleEssayCardOpen(essayId) : undefined}
                />
              )
            })}
          </Box>
        )}
      </>
    )
  }

  return (
    <Box
      className={`cont-tall pt-lg cont flex-col auto library-tour-start ${isSidebarOpen ? 'sidebar-pushed' : ''}`}
    >
      <ConfirmationWarning
        open={Boolean(folderDeleteRequest)}
        setOpen={open => {
          if (!open) setFolderDeleteRequest(null)
        }}
        action={handleConfirmFolderDelete}
      >
        <FormattedMessage id="confirm-folder-delete" />
      </ConfirmationWarning>
      {libraryControls}
      <Box className="universal-background" sx={{ margin: '0 7px' }}>
        {activeLibrary === 'essays' ? (
          <>
            {essaySearchAndSortControls}
            {renderEssaysLibrary()}
          </>
        ) : (
          <>
            {libraries.group && (
              <Box className="library-group-dropdown-container">
                <FormControl size="small" fullWidth>
                  <Select
                    value={savedGroupSelection}
                    onChange={handleGroupChange}
                    className="library-semantic-select"
                    MenuProps={dropdownMenuProps}
                    sx={{ color: '#777', width: '100%' }}
                  >
                    {groupDropdownOptions.map(option => (
                      <MenuItem
                        className="library-dropdown-item"
                        key={option.key}
                        value={option.value}
                      >
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

            {renderFolderBrowser()}
          </>
        )}
      </Box>

      <HelperSidebar>
        <GeneralChatbot />
      </HelperSidebar>
    </Box>
  )
}

export default StoryList
