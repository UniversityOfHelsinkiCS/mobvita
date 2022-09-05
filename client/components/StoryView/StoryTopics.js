import React, { useState, useEffect } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

const StoryTopics = ({ conceptCount, focusedConcept, setFocusedConcept }) => {
  const [topTopics, setTopTopics] = useState([])
  const { width } = useWindowDimensions()
  const [collapsed, setCollapsed] = useState(false)

  const handleFocusedConcept = topic => {
    if (topic === focusedConcept) {
      setFocusedConcept(null)
    } else {
      setFocusedConcept(topic)
    }
  }

  useEffect(() => {
    const keysSorted = Object.entries(conceptCount).sort((a, b) => {
      if (b[1][0] == a[1][0])
        return b[1][1] - a[1][1]
      return b[1][0] - a[1][0]
    })
    setTopTopics(keysSorted)
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
            <ul style={{ overflow: 'auto', maxHeight: 120 }}>
              {topTopics.map(topic => (
                <li>
                  <span
                    className={focusedConcept === topic[0] && 'notes-highlighted-word'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleFocusedConcept(topic[0])}
                  >
                    {topic[0]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default StoryTopics
