import React, { useState, useEffect } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormattedMessage } from 'react-intl'

const StoryTopics = ({ conceptCount }) => {
  const [topTopics, setTopTopics] = useState([])
  const { width } = useWindowDimensions()

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
          <div className="header-3" style={{ marginBottom: '.5em' }}>
            <FormattedMessage id="story-top-topics" />
          </div>
          <ul>{topTopics.map((topic, index) => index < 3 && <li>{topic[0]}</li>)}</ul>
        </div>
      </div>
    )
  }

  return null
}

export default StoryTopics
