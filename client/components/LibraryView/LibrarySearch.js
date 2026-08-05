import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AppSearchField from 'Components/ui/AppSearchField'
import { setLastQuery } from 'Utilities/redux/storiesReducer'
import { useIntl } from 'react-intl'
import CustomTooltip from 'Components/CustomTooltip'

const LibrarySearch = ({ setDisplaySearchResults, setDisplayedStories }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { data: stories } = useSelector(({ stories }) => stories)

  const [currentQuery, setCurrentQuery] = useState('')

  const filterStories = useCallback(
    query => {
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
    },
    [stories, dispatch, setDisplaySearchResults, setDisplayedStories],
  )

  const cancelSearch = () => {
    dispatch(setLastQuery(null))
    setDisplaySearchResults(false)
    setDisplayedStories(stories)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
      <CustomTooltip title={intl.formatMessage({ id: 'explain-library-search' })}>
        <InfoOutlinedIcon color="action" fontSize="small" sx={{ flexShrink: 0 }} />
      </CustomTooltip>
      <AppSearchField
        value={currentQuery}
        onChange={setCurrentQuery}
        onSearch={filterStories}
        onClear={cancelSearch}
        debounceMs={250}
        placeholder={intl.formatMessage({ id: 'search-input-placeholder' })}
      />
    </Box>
  )
}

export default LibrarySearch
