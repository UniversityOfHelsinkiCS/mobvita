import React, { useState, useEffect } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Icon } from 'semantic-ui-react'
import { skillLevels } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'

const StoryTopics = ({ conceptCount, focusedConcept, setFocusedConcept }) => {
  const [topTopics, setTopTopics] = useState([])
  const { width } = useWindowDimensions()
  const [collapsed, setCollapsed] = useState(true)
  const [sortByFreq, setSortByFreq] = useState(true)

  const handleFocusedConcept = topic => {
    if (topic === focusedConcept) {
      setFocusedConcept(null)
    } else {
      setFocusedConcept(topic)
    }
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
    if (sortByFreq) {
      sortByFrequency()
    } else {
      sortByCefr()
    }
  }, [sortByFreq])

  useEffect(() => {
    sortByFrequency()
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
              onClick={() => setCollapsed(!collapsed)}
              onKeyDown={() => setCollapsed(!collapsed)}
              role="button"
              tabIndex={0}
            >
              <Icon name={collapsed ? 'angle down' : 'angle up'} size="large" />
            </div>
          </div>
          {!collapsed && (
            <>
              <FormattedMessage id="LABEL-sort-by" />
              <div className="space-evenly" style={{ marginTop: '.5em' }}>
                <span style={{ marginRight: '.5em' }}>
                  <input
                    type="radio"
                    style={{ marginRight: '.75em' }}
                    onChange={() => setSortByFreq(true)}
                    checked={sortByFreq}
                  />
                  <FormattedMessage id="sort-by-concept-freq-short" />
                </span>
                <span style={{ marginRight: '.5em' }}>
                  <input
                    type="radio"
                    style={{ marginRight: '.75em' }}
                    onChange={() => setSortByFreq(false)}
                    checked={!sortByFreq}
                  />
                  <FormattedMessage id="sort-by-concept-cefr-short" />
                </span>
              </div>
              <hr />
              <ul style={{ overflow: 'auto', maxHeight: 120 }}>
                {topTopics.map(topic => (
                  <li className="flex space-between">
                    <span
                      className={focusedConcept === topic[0] && 'notes-highlighted-word'}
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
