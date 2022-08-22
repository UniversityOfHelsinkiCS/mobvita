import React, { useState, useEffect } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

const StoryTopics = ({ conceptCount }) => {
  const [topTopics, setTopTopics] = useState([])
  const { width } = useWindowDimensions()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const keysSorted = Object.entries(conceptCount).sort((a, b) => {
      return b[1] - a[1]
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
              <Icon name={collapsed ? 'angle up' : 'angle down'} size="large" />
            </div>
          </div>
          {!collapsed && (
            <ul style={{ overflow: 'auto', maxHeight: 120 }}>
              {topTopics.map(topic => (
                <li>
                  {topic[0]}: {topic[1]}
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
