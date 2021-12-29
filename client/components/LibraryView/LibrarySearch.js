import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Icon } from 'semantic-ui-react'
import { useLearningLanguage } from 'Utilities/common'
import { searchStories, setLastQuery } from 'Utilities/redux/storiesReducer'

const LibrarySearch = ({ setDisplaySearchResults, setDisplayedStories, fluid }) => {
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  const { data: stories, lastQuery } = useSelector(({ stories }) => stories)

  const [currentQuery, setCurrentQuery] = useState('')

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
      <Input
        action={{ icon: 'search', onClick: handleLibrarySearch, color: 'grey' }}
        placeholder="Search..."
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

export default LibrarySearch