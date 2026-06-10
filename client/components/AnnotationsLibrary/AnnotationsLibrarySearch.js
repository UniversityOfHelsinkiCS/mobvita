import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Dropdown, Popup, Icon, Input } from 'semantic-ui-react'
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

  const dropDownMenuText = category ? (
    <FormattedMessage id={`notes-${category}`} />
  ) : (
    <FormattedMessage id="notes-All" />
  )

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
      key: '0',
      text: <FormattedMessage id="notes-All" />,
      value: 'All',
    },
    {
      key: '1',
      text: <FormattedMessage id="notes-Grammar" />,
      value: 'Grammar',
    },
    {
      key: '2',
      text: <FormattedMessage id="notes-Phrases" />,
      value: 'Phrases',
    },
    {
      key: '3',
      text: <FormattedMessage id="notes-Vocabulary" />,
      value: 'Vocabulary',
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
        <Dropdown
          style={{ width: '150px' }}
          text={dropDownMenuText}
          selection
          fluid
          options={categoryOptions}
          onChange={(_, { value }) => setCategory(value)}
        />
      </div>
      <div style={{ position: 'relative' }}>
        {bigScreen && (
          <Popup
            content={<FormattedMessage id="annotations-search-by-text" />}
            trigger={<Icon style={{ paddingRight: '0.5em' }} name="info circle" color="grey" />}
          />
        )}
        <Input
          action={{ icon: 'search', onClick: handleAnnotationsSearch, color: 'grey' }}
          placeholder={intl.formatMessage({ id: 'search-input-placeholder' })}
          onChange={handleSearchFieldChange}
          onKeyPress={handleSearchFieldKeyPress}
          value={searchString}
        />
        {lastQuery && (
          <Icon
            className="library-search-cancel"
            onClick={cancelSearch}
            size="large"
            color="grey"
            name="times"
          />
        )}
      </div>
    </div>
  )
}

export default AnnotationsLibrarySearch
