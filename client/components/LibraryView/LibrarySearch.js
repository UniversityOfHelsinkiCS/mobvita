import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, IconButton, TextField, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { useLearningLanguage } from 'Utilities/common'
import { searchStories, setLastQuery } from 'Utilities/redux/storiesReducer'
import { useIntl } from 'react-intl'

const LibrarySearch = ({ setDisplaySearchResults, setDisplayedStories, fluid }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const learningLanguage = useLearningLanguage()
  const { data: stories, lastQuery } = useSelector(({ stories }) => stories)

  const [currentQuery, setCurrentQuery] = React.useState('')

  const cancelSearch = () => {
    setCurrentQuery('')
    dispatch(setLastQuery(null))
    setDisplaySearchResults(false)
    setDisplayedStories(stories)
  }

  const handleLibrarySearch = () => {
    if (currentQuery === '') {
      cancelSearch()
    } else {
      dispatch(setLastQuery(currentQuery))
      setDisplaySearchResults(true)
      dispatch(
        searchStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
          text: currentQuery,
        }),
      )
    }
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
          onChange={event => setCurrentQuery(event.target.value)}
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
