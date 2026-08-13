import React, { useState, useEffect, useCallback, useRef } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AppSelect from 'Components/ui/AppSelect'
import AppTextField from 'Components/ui/AppTextField'
import CustomTooltip from 'Components/CustomTooltip'
import { debounce } from 'lodash'
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'

const AnnotationsLibrarySearch = ({ category, setCategory, setAnnotationsList, activeLibrary }) => {
  const intl = useIntl()
  const [searchString, setSearchString] = useState('')
  const [lastQuery, setLastQuery] = useState(false)
  const bigScreen = useWindowDimensions().width >= 700

  const applyFilter = useCallback(
    searchValue => {
      const normalized = searchValue.toLowerCase()
      const matchesText = annotation => annotation.annotated_text.toLowerCase().includes(normalized)

      if (category === 'All') {
        setAnnotationsList(activeLibrary.filter(matchesText))
      } else {
        setAnnotationsList(
          activeLibrary.filter(
            annotation => annotation.category === category && matchesText(annotation)
          )
        )
      }
    },
    [category, activeLibrary, setAnnotationsList]
  )

  useEffect(() => {
    applyFilter(searchString)
  }, [category])

  const applyFilterRef = useRef(applyFilter)
  useEffect(() => {
    applyFilterRef.current = applyFilter
  }, [applyFilter])

  const debouncedFilter = useRef(
    debounce(searchValue => applyFilterRef.current(searchValue), 250)
  ).current

  useEffect(() => () => debouncedFilter.cancel(), [debouncedFilter])

  const cancelSearch = () => {
    debouncedFilter.cancel()
    setLastQuery(false)
    setSearchString('')

    if (category === 'All') {
      setAnnotationsList(activeLibrary)
    } else {
      setAnnotationsList(activeLibrary.filter(annotation => annotation.category === category))
    }
  }

  const handleAnnotationsSearch = () => {
    debouncedFilter.cancel()
    if (searchString !== '') {
      applyFilter(searchString)
      setLastQuery(true)
    }
  }

  const handleSearchFieldChange = e => {
    const nextValue = e.target.value
    setSearchString(nextValue)
    setLastQuery(nextValue !== '')
    debouncedFilter(nextValue)
  }

  const handleSearchFieldKeyPress = e => {
    if (e.key === 'Enter') {
      handleAnnotationsSearch()
    }
  }

  const categoryOptions = [
    {
      value: 'All',
      label: <FormattedMessage id="notes-All" />,
    },
    {
      value: 'Grammar',
      label: <FormattedMessage id="notes-Grammar" />,
    },
    {
      value: 'Phrases',
      label: <FormattedMessage id="notes-Phrases" />,
    },
    {
      value: 'Vocabulary',
      label: <FormattedMessage id="notes-Vocabulary" />,
    },
  ]

  return (
    <div className="flex space-between" style={{ marginRight: '.5em', marginLeft: '.5em' }}>
      <div className="row-flex" style={{ alignItems: 'center' }}>
        {bigScreen && (
          <span style={{ marginRight: '.5em' }}>
            <FormattedMessage id="search-by-category" />
          </span>
        )}
        <Box data-cy="annotations-library-category-select" sx={{ width: '150px' }}>
          <AppSelect
            variant="contrast-outline"
            value={category || 'All'}
            options={categoryOptions}
            onChange={setCategory}
            minWidth={150}
            matchTriggerWidth
          />
        </Box>
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {bigScreen && (
          <CustomTooltip permanent keyId="annotations-search-by-text">
            <InfoOutlinedIcon sx={{ paddingRight: '0.5em', color: 'grey' }} />
          </CustomTooltip>
        )}
        <AppTextField
          fullWidth={false}
          placeholder={intl.formatMessage({ id: 'search-input-placeholder' })}
          onChange={handleSearchFieldChange}
          onKeyPress={handleSearchFieldKeyPress}
          value={searchString}
          inputProps={{ 'data-cy': 'annotations-library-search-input' }}
          endIcon={
            <IconButton
              onClick={handleAnnotationsSearch}
              size="small"
              aria-label="search"
              sx={{ color: 'grey' }}
              data-cy="annotations-library-search-button"
            >
              <SearchIcon />
            </IconButton>
          }
        />
        {lastQuery && (
          <CloseIcon
            className="library-search-cancel"
            onClick={cancelSearch}
            fontSize="large"
            sx={{ color: 'grey' }}
            data-cy="annotations-library-search-cancel"
          />
        )}
      </div>
    </div>
  )
}

export default AnnotationsLibrarySearch
