import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Icon, Popup } from 'semantic-ui-react'
import { useLearningLanguage } from 'Utilities/common'
import {  } from 'Utilities/redux/lessonsReducer'
import { useIntl } from 'react-intl'

const LessonLibrarySearch = ({ setDisplaySearchResults, setDisplayedStories, fluid }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const learningLanguage = useLearningLanguage()
  const { data: stories, lastQuery } = useSelector(({ stories }) => stories)

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
        })
      )
    }
  }

  const handleSearchFieldKeyPress = e => {
    if (e.key === 'Enter') {
      handleLibrarySearch()
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <Popup
        content={intl.formatMessage({ id: 'explanation-library-search' })}
        trigger={<Icon style={{ paddingRight: '0.5em' }} name="info circle" color="grey" />}
      />
      <Input
        action={{ icon: 'search', onClick: handleLibrarySearch, color: 'grey' }}
        placeholder={intl.formatMessage({ id: 'search-input-placeholder' })}
        onChange={e => setCurrentQuery(e.target.value)}
        onKeyPress={handleSearchFieldKeyPress}
        value={currentQuery}
        fluid={fluid}
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
  )
}

export default LessonLibrarySearch
