import React, { useState, useEffect } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Icon } from 'semantic-ui-react'
import { skillLevels } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'


const StoryTopics = ({ conceptCount, focusedConcept, setFocusedConcept }) => {
  const dispatch = useDispatch()
  const [topTopics, setTopTopics] = useState([])
  const { width } = useWindowDimensions()
  const showTopicsBox = useSelector((state) => state.topicsBox.showTopicsBox)
  const [sortBy, setSortBy] = useState('name')
  const handleFocusedConcept = topic => {
    if (topic === focusedConcept) {
      setFocusedConcept(null)
    } else {
      setFocusedConcept(topic)
    }
  }
  const handleTopicsBoxClick = () => {
    if (showTopicsBox) {
      dispatch({ type: 'CLOSE_TOPICS_BOX' })
    } else {
      dispatch({ type: 'SHOW_TOPICS_BOX' })
    }
  }

  const sortByName = () => {
    const keysSorted = Object.entries(conceptCount).sort((a, b) => {
      if (b[0] === a[0])
        return b[1].level - a[1].level
      return b[0] - a[0]
    })
    setTopTopics(keysSorted)
  }

  const sortByFrequency = () => {
    const keysSorted = Object.entries(conceptCount).sort((a, b) => {
      if (b[1].freq === a[1].freq)
        return b[1].level - a[1].level
      return b[1].freq - a[1].freq
    })
    setTopTopics(keysSorted)
  }

  const sortByCefr = () => {
    const keysSorted = Object.entries(conceptCount).sort((a, b) => {
      if (b[1].level === a[1].level)
        return b[1].freq - a[1].freq
      return b[1].level - a[1].level
    })
    setTopTopics(keysSorted)
  }

  useEffect(() => {
    if (sortBy == 'freq') {
      sortByFrequency()
    } else if (sortBy == 'cefr') {
      sortByCefr()
    } else {
      sortByName()
    }
  }, [sortBy])

  useEffect(() => {
    sortByName()
  }, [conceptCount])

  if (width >= 1024 && topTopics.length > 0) {
    return (
      <div className="story-topics-box" style={{ padding: '1em' }}>
        <div style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex space-between">
            <div style={{ marginBottom: '.5em' }}>
              <FormattedMessage id="story-top-topics" />:
            </div>
            <div
              onClick={() => {
                handleTopicsBoxClick()}}
              onKeyDown={() => {handleTopicsBoxClick()}}
              role="button"
              tabIndex={0}
            >
              <Icon name={showTopicsBox ? 'angle down' : 'angle up'} size="large" />
            </div>
          </div>
          {showTopicsBox && (
            <>
              <FormattedMessage id="LABEL-sort-by" />
              <div className="space-evenly" style={{ marginTop: '.5em' }}>
                <span style={{ marginRight: '.5em' }}>
                  <input
                    type="radio"
                    style={{ marginRight: '.75em' }}
                    onChange={() => setSortBy('name')}
                    checked={sortBy=='name'}
                  />
                  <FormattedMessage id="Name" />
                </span>
                <span style={{ marginRight: '.5em' }}>
                  <input
                    type="radio"
                    style={{ marginRight: '.75em' }}
                    onChange={() => setSortBy('freq')}
                    checked={sortBy=='freq'}
                  />
                  <FormattedMessage id="sort-by-concept-freq-short" />
                </span>
                <span style={{ marginRight: '.5em' }}>
                  <input
                    type="radio"
                    style={{ marginRight: '.75em' }}
                    onChange={() => setSortBy('cefr')}
                    checked={sortBy=='cefr'}
                  />
                  <FormattedMessage id="sort-by-concept-cefr-short" />
                </span>
              </div>
              <hr />
              <ul style={{ overflow: 'auto', maxHeight: 171 }}>
                {topTopics.map(topic => (
                  <li className="flex space-between">
                    <span
                      className={focusedConcept === topic[0] && 'concept-highlighted-word'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleFocusedConcept(topic[0])}
                    >
                      {topic[0]}
                    </span>
                    <span style={{ marginRight: '.5em' }}>
                      {topic[1].freq}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    )
  }

  return null
}


export default StoryTopics
