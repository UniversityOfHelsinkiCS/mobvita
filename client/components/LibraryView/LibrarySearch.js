import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, IconButton, TextField, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { setLastQuery } from 'Utilities/redux/storiesReducer'
import { useIntl } from 'react-intl'

const LibrarySearch = ({ setDisplaySearchResults, setDisplayedStories, fluid }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { data: stories, lastQuery } = useSelector(({ stories }) => stories)

  const [currentQuery, setCurrentQuery] = useState('')

  const filterStories = query => {
    const normalizedQuery = query.trim().toLowerCase()

    if (normalizedQuery === '') {
      dispatch(setLastQuery(null))
      setDisplaySearchResults(false)
      setDisplayedStories(stories)
      return
    }

    const filteredStories = stories.filter(story => {
      const searchableFields = [story.title, story.description]
      return searchableFields.some(field => field?.toLowerCase().includes(normalizedQuery))
    })

    dispatch(setLastQuery(query))
    setDisplaySearchResults(true)
    setDisplayedStories(filteredStories)
  }

  const cancelSearch = () => {
    setCurrentQuery('')
    dispatch(setLastQuery(null))
    setDisplaySearchResults(false)
    setDisplayedStories(stories)
  }

  const handleLibrarySearch = () => {
    filterStories(currentQuery)
  }

  const handleSearchFieldChange = event => {
    const nextQuery = event.target.value
    setCurrentQuery(nextQuery)
    filterStories(nextQuery)
  }

  const handleSearchFieldKeyDown = event => {
    if (event.key === 'Enter') {
      handleLibrarySearch()
    }
  }

  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title={intl.formatMessage({ id: 'explain-library-search' })}>
        <InfoOutlinedIcon color="action" fontSize="small" />
      </Tooltip>
      <Box className="library-search-control" sx={{ width: fluid ? '100%' : 'auto' }}>
        <TextField
          className="library-search-field"
          placeholder={intl.formatMessage({ id: 'search-input-placeholder' })}
          onChange={handleSearchFieldChange}
          onKeyDown={handleSearchFieldKeyDown}
          value={currentQuery}
          fullWidth
          size="small"
        />
        <IconButton
          aria-label={intl.formatMessage({ id: 'search-input-placeholder' })}
          className="library-search-button"
          onClick={handleLibrarySearch}
        >
          <SearchIcon />
        </IconButton>
      </Box>
      {lastQuery && (
        <IconButton
          className="library-search-cancel"
          aria-label="Clear search"
          onClick={cancelSearch}
          size="small"
          sx={{ position: 'absolute', right: 42 }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  )
}

export default LibrarySearch
