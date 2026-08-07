import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Breadcrumbs, IconButton, Typography } from '@mui/material'
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp'
import ArrowDropUpSharpIcon from '@mui/icons-material/ArrowDropUpSharp'
import AppButton from 'Components/AppButton'
import StoryListItem from 'Components/LibraryView/StoryListItem'
import { useIntl, FormattedMessage } from 'react-intl'
import AppTabs from 'Components/ui/AppTabs'
import AppSearchField from 'Components/ui/AppSearchField'
import AppSelect from 'Components/ui/AppSelect'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import { colors } from 'Assets/mui_theme/designTokens'
import star06Icon from 'Assets/images/star-06.svg'
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
import { openAddStoryOptions } from 'Utilities/redux/helperSidebarReducer'
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
  getRenamedItemPath,
  getStoriesForPath,
  getStoriesInFolder,
  getStoredLocalFolders,
  normalizeLibraryPath,
  removeLocalFolder,
  renameLocalFolder,
  saveStoredLocalFolders,
} from './folderUtils'
import useLibraryDragAndDrop from './useLibraryDragAndDrop'
import './LibraryView.scss'

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

  const [sorter, setSorter] = useState(
    savedSortCriterion?.[savedLibrarySelection]?.sort_by || 'title',
  )
  const [sortDirection, setSortDirection] = useState(
    savedSortCriterion?.[savedLibrarySelection]?.direction || 'asc',
  )
  const [displayedStories, setDisplayedStories] = useState(stories)
  const [displaySearchResults, setDisplaySearchResults] = useState(false)
  const [currentLibraryPath, setCurrentLibraryPath] = useState('')
  const [selectedFolderPath, setSelectedFolderPath] = useState(null)
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
    setSelectedFolderPath(null)
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

  const handleGroupChange = groupId => {
    dispatch(updateGroupSelect(groupId))
  }

  // Group selector for the "Group" library — the design-system dropdown, rendered in the folder header.
  const renderGroupDropdown = () => {
    if (!libraries.group) return null
    return (
      <Box className="library-group-dropdown-container">
        <AppSelect
          className="library-menu"
          borderRadius="30px"
          variant="contrast-outline"
          value={savedGroupSelection}
          onChange={handleGroupChange}
          options={groupDropdownOptions.map(option => ({
            value: option.value,
            label: option.text,
          }))}
        />
      </Box>
    )
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

  // Persist under activeLibrary (synchronous local state that sorter/sortDirection track), not the
  // async-lagging Redux savedLibrarySelection, so the preference is saved for the displayed library.
  const handleSortChange = newSorter => {
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
      {(() => {
        const meta = {
          public: { label: <FormattedMessage id="Public" />, icon: <PublicOutlinedIcon /> },
          private: { label: <FormattedMessage id="Private" />, icon: <LockOutlinedIcon /> },
          essays: { label: <FormattedMessage id="my-essays" />, icon: <ArticleOutlinedIcon /> },
          group: { label: <FormattedMessage id="Group" />, icon: <GroupsOutlinedIcon /> },
        }
        const tabs = ['public', 'private', 'essays', 'group']
          .filter(key => key in libraries)
          .map(key => ({ value: key, ...meta[key] }))
        return (
          <div style={{ margin: '1.5em 0 12px' }}>
            <AppTabs tabs={tabs} value={activeLibrary} onChange={handleLibraryChange} fullWidth />
          </div>
        )
      })()}
    </Box>
  )

  const addStoryButton = (
    <AppButton
      className="tour-add-new-stories library-add-story-button"
      variant="contrast"
      onClick={() => dispatch(openAddStoryOptions())}
      data-cy="add-story-button"
    >
      <img src={star06Icon} alt="" />
      {intl.formatMessage({ id: 'add-your-stories' })}
    </AppButton>
  )

  const renderSortAndAddRow = (sortValue, options) => (
    <div className="library-sort-add-row">
      <div className="library-sort-select">
        <AppSelect
          className="library-menu"
          borderRadius="30px"
          variant="contrast-outline"
          value={sortValue}
          onChange={handleSortChange}
          options={options.map(option => ({ value: option.value, label: option.text }))}
        />
      </div>
      <IconButton
        aria-label="Toggle sort direction"
        onClick={handleDirectionChange}
        className="library-sort-direction"
      >
        {sortDirection === 'asc' ? (
          <ArrowDropUpSharpIcon fontSize="large" />
        ) : (
          <ArrowDropDownSharpIcon fontSize="large" />
        )}
      </IconButton>
      {addStoryButton}
    </div>
  )

  // Sort (title/date) + title search for the "My Essays" library, styled like the story controls.
  const essaySearchAndSortControls = (
    <>
      <AppSearchField
        className="library-search-field"
        placeholder={intl.formatMessage({ id: 'search-input-placeholder' })}
        value={essaySearchQuery}
        onChange={setEssaySearchQuery}
      />
      {renderSortAndAddRow(essaySorter, essaySortDropdownOptions)}
    </>
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
    setSelectedFolderPath(null)
    clearDragState()
  }

  const handleEssayLibraryPathChange = path => {
    setCurrentLibraryPath(normalizeLibraryPath(path))
    setSelectedFolderPath(null)
    clearEssayDragState()
  }

  // Tapping a folder: navigate into it when it has sub-folders, otherwise just preview it (highlighted
  // green) and show its stories below via selectedFolderPath. Tapping the same leaf again clears it.
  const handleFolderTap = (folderPath, hasSubfolders, navigateInto) => {
    if (hasSubfolders) {
      navigateInto(folderPath)
      return
    }
    setSelectedFolderPath(previous => (previous === folderPath ? null : folderPath))
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

  // Rename a folder: re-path every story inside it (folder itself + sub-paths) and rename any matching
  // empty local-folder entries. The item drag/move endpoint (updateStoryPath) is reused for the re-path.
  const handleRenameFolder = (folderPath, newName) => {
    if (!libraryIsMutable) return

    const normalizedOldPath = normalizeLibraryPath(folderPath)
    const parentPath = normalizedOldPath.split('/').slice(0, -1).join('/')
    const newFolderPath = normalizeLibraryPath(parentPath ? `${parentPath}/${newName}` : newName)

    if (!newFolderPath || newFolderPath === normalizedOldPath) return

    getStoriesInFolder(allStoriesInActiveLibrary, normalizedOldPath).forEach(story => {
      dispatch(
        updateStoryPath(
          story._id,
          getRenamedItemPath(story.path, normalizedOldPath, newFolderPath),
        ),
      )
    })

    setLocalFolders(currentLocalFolders =>
      renameLocalFolder(currentLocalFolders, activeLibrary, normalizedOldPath, newFolderPath),
    )
    setCurrentLibraryPath(currentPath =>
      getRenamedItemPath(currentPath, normalizedOldPath, newFolderPath),
    )
    clearDragState()
  }

  const handleRenameEssayFolder = (folderPath, newName) => {
    if (!essaysLibraryActive || !learningLanguage) return

    const normalizedOldPath = normalizeLibraryPath(folderPath)
    const parentPath = normalizedOldPath.split('/').slice(0, -1).join('/')
    const newFolderPath = normalizeLibraryPath(parentPath ? `${parentPath}/${newName}` : newName)

    if (!newFolderPath || newFolderPath === normalizedOldPath) return

    getStoriesInFolder(uploadedEssays, normalizedOldPath).forEach(essay => {
      const essayId = getWritingEssayId(essay)
      if (essayId == null) return

      dispatch(
        updateWritingEssayPath(
          capitalize(learningLanguage),
          essayId,
          getRenamedItemPath(essay.path, normalizedOldPath, newFolderPath),
        ),
      )
    })

    setLocalFolders(currentLocalFolders =>
      renameLocalFolder(currentLocalFolders, activeLibrary, normalizedOldPath, newFolderPath),
    )
    setCurrentLibraryPath(currentPath =>
      getRenamedItemPath(currentPath, normalizedOldPath, newFolderPath),
    )
    clearEssayDragState()
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

  // The folder section (breadcrumbs + the folder pills) sits at the TOP of the library card, above the
  // search/sort row. The stories that live in the current folder render separately, BELOW that row (see
  // renderStoriesGrid), per the 2026 library layout.
  const renderFolderSection = () => {
    const foldersInCurrentPath = getFoldersForPath(
      libraryFilteredStories,
      currentLibraryPath,
      localFolderPathsForLibrary,
    )
    // Add/rename name-collision checks must see every sibling folder, not just the ones matching the
    // active search, so a rename can't silently merge into a folder the search is currently hiding.
    const allFolderNamesInCurrentPath = getFoldersForPath(
      allStoriesInActiveLibrary,
      currentLibraryPath,
      localFolderPathsForLibrary,
    )

    return (
      <>
        <Box className="library-folder-header">
          {renderLibraryPathBreadcrumbs()}
          {renderGroupDropdown()}
          {libraryIsMutable && (
            <AddFolder
              existingFolderNames={allFolderNamesInCurrentPath}
              onAddFolder={handleAddFolder}
            />
          )}
        </Box>
        {(libraryPathParts.length > 0 || foldersInCurrentPath.length > 0) && (
          <Box data-cy="library-folders" className="library-folder-grid">
            {libraryPathParts.length > 0 && (
              <FolderCard
                isBack
                onClick={() => handleLibraryPathChange(libraryPathParts.slice(0, -1).join('/'))}
              />
            )}
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
              const hasSubfolders =
                getFoldersForPath(
                  libraryFilteredStories,
                  normalizedFolderPath,
                  localFolderPathsForLibrary,
                ).length > 0

              return (
                <FolderCard
                  key={normalizedFolderPath}
                  isDropTarget={libraryIsMutable && dragOverFolderPath === normalizedFolderPath}
                  isEmpty={folderIsEmptyLocal}
                  isSelected={selectedFolderPath === normalizedFolderPath}
                  name={folderName}
                  onClick={() =>
                    handleFolderTap(normalizedFolderPath, hasSubfolders, handleLibraryPathChange)
                  }
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
                  onRename={
                    libraryIsMutable
                      ? newName => handleRenameFolder(normalizedFolderPath, newName)
                      : undefined
                  }
                  existingFolderNames={allFolderNamesInCurrentPath}
                />
              )
            })}
          </Box>
        )}
      </>
    )
  }

  const renderStoriesGrid = () => {
    const foldersInCurrentPath = getFoldersForPath(
      libraryFilteredStories,
      currentLibraryPath,
      localFolderPathsForLibrary,
    )

    const storiesInCurrentPath = getStoriesForPath(
      libraryFilteredStories,
      selectedFolderPath || currentLibraryPath,
    )

    if (foldersInCurrentPath.length === 0 && storiesInCurrentPath.length === 0) {
      return (
        <Box className="justify-center mt-lg" sx={{ color: 'rgb(112, 114, 120)' }}>
          <FormattedMessage id="no-stories-found" />
        </Box>
      )
    }

    return (
      <Box data-cy="story-items" className="library-story-grid">
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

  // Essays that survive the current title search, newest/A-Z per the essay sort. Shared by the essay folder
  // section (top of the card) and the essay items (below the sort/add row).
  const getSortedEssaysInView = () => {
    const query = essaySearchQuery.trim().toLowerCase()
    const searchedEssays = query
      ? uploadedEssays.filter(essay => (essay.title || '').toLowerCase().includes(query))
      : uploadedEssays

    return [...searchedEssays].sort((a, b) => {
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
  }

  // Breadcrumbs + essay folder pills — rendered at the TOP of the essay card.
  const renderEssayFolderSection = () => {
    const sortedEssays = getSortedEssaysInView()
    const foldersInCurrentPath = getFoldersForPath(
      sortedEssays,
      currentLibraryPath,
      localFolderPathsForLibrary,
    )
    // Collision checks use the full essay set (not the search-filtered one) so a rename can't silently
    // merge into a sibling folder the active search is hiding.
    const allFolderNamesInCurrentPath = getFoldersForPath(
      uploadedEssays,
      currentLibraryPath,
      localFolderPathsForLibrary,
    )

    return (
      <>
        <Box className="library-folder-header">
          {renderEssayPathBreadcrumbs()}
          <AddFolder
            existingFolderNames={allFolderNamesInCurrentPath}
            onAddFolder={handleAddFolder}
          />
        </Box>
        {(libraryPathParts.length > 0 || foldersInCurrentPath.length > 0) && (
          <Box data-cy="essay-folders" className="library-folder-grid">
            {libraryPathParts.length > 0 && (
              <FolderCard
                isBack
                onClick={() => handleEssayLibraryPathChange(libraryPathParts.slice(0, -1).join('/'))}
              />
            )}
            {foldersInCurrentPath.map(folderName => {
              const folderPath = currentLibraryPath
                ? `${currentLibraryPath}/${folderName}`
                : folderName
              const normalizedFolderPath = normalizeLibraryPath(folderPath)
              const essaysInFolder = getStoriesInFolder(uploadedEssays, normalizedFolderPath)
              const folderIsEmptyLocal =
                folderIsLocalOnly(normalizedFolderPath) && essaysInFolder.length === 0
              const hasSubfolders =
                getFoldersForPath(sortedEssays, normalizedFolderPath, localFolderPathsForLibrary)
                  .length > 0

              return (
                <FolderCard
                  key={normalizedFolderPath}
                  isDropTarget={essayDragOverFolderPath === normalizedFolderPath}
                  isEmpty={folderIsEmptyLocal}
                  isSelected={selectedFolderPath === normalizedFolderPath}
                  name={folderName}
                  onClick={() =>
                    handleFolderTap(
                      normalizedFolderPath,
                      hasSubfolders,
                      handleEssayLibraryPathChange,
                    )
                  }
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
                  onRename={newName => handleRenameEssayFolder(normalizedFolderPath, newName)}
                  existingFolderNames={allFolderNamesInCurrentPath}
                />
              )
            })}
          </Box>
        )}
      </>
    )
  }

  const renderEssayItems = () => {
    const query = essaySearchQuery.trim().toLowerCase()
    const sortedEssays = getSortedEssaysInView()
    const foldersInCurrentPath = getFoldersForPath(
      sortedEssays,
      currentLibraryPath,
      localFolderPathsForLibrary,
    )
    const essaysInCurrentPath = getStoriesForPath(
      sortedEssays,
      selectedFolderPath || currentLibraryPath,
    )

    if (foldersInCurrentPath.length === 0 && essaysInCurrentPath.length === 0) {
      if (essaysPending && !query) return null
      return (
        <Box className="justify-center mt-lg" sx={{ color: 'rgb(112, 114, 120)' }}>
          <FormattedMessage id="no-essays-found" />
        </Box>
      )
    }

    if (essaysInCurrentPath.length === 0) return null

    return (
      <Box data-cy="essay-items" className="library-story-grid">
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
    )
  }

  return (
    <div className="library-page">
      <Box
        className={`library-dashboard library-tour-start ${isSidebarOpen ? 'sidebar-pushed' : ''}`}
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
      <Box
        data-cy="library-container"
        sx={{
          margin: '0 7px',
          backgroundColor: colors.card,
          borderRadius: '30px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {activeLibrary === 'essays' ? (
          <>
            {renderEssayFolderSection()}
            {essaySearchAndSortControls}
            {renderEssayItems()}
          </>
        ) : (
          <>
            {renderFolderSection()}
            <LibrarySearch
              setDisplayedStories={setDisplayedStories}
              setDisplaySearchResults={setDisplaySearchResults}
            />
            {renderSortAndAddRow(sorter, sortDropdownOptions)}
            {lastQuery && (
              <Box>
                <Typography component="span">
                  <FormattedMessage id="showing-results-for" /> &quot;{lastQuery}&quot;:
                </Typography>
              </Box>
            )}
            {renderStoriesGrid()}
          </>
        )}
      </Box>
      </Box>

      <HelperSidebar>
        <GeneralChatbot />
      </HelperSidebar>
    </div>
  )
}

export default StoryList
