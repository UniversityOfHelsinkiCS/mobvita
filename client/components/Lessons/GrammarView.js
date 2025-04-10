import React from 'react'
import ToggleButton from './ToggleButton'

const GrammarView = ({
  currentStepIndex,
  setShowGrammarModal,
  lessons,
  selectedTopicIds,
  setSelectedTopics,
}) => {
  const getTopicsByLevel = () => {
    const levelTopics = lessons.reduce((groups, lesson) => {
      const groupName = lesson.group[0]
      if (!/^[0-9]$/.test(groupName)) {
        return groups
      }
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      lesson.topics.forEach(topic => {
        groups[groupName].push(topic)
      })
      return groups
    }, {})

    return levelTopics
  }

  const isLevelButtonActive = level => {
    if (selectedTopicIds.length === 0) return false

    return getTopicsByLevel()[level].every(topic => selectedTopicIds.includes(topic))
  }

  const handleLevelClick = level => {
    let newTopics

    if (isLevelButtonActive(level)) {
      newTopics = selectedTopicIds.filter(topicId => !getTopicsByLevel()[level].includes(topicId))
    } else if (isCustomButtonActive()) {
      newTopics = getTopicsByLevel()[level]
    } else {
      newTopics = selectedTopicIds.concat(getTopicsByLevel()[level])
    }

    setSelectedTopics(newTopics)
  }

  const isCustomButtonActive = () => {
    if (selectedTopicIds.length === 0) return false

    let isActive = false

    selectedTopicIds.forEach(topicId => {
      let levelOfTopic

      [1, 2, 3, 4].forEach(level => {
        if (getTopicsByLevel()[level].includes(topicId)) {
          levelOfTopic = level
        }
      })

      if (!isLevelButtonActive(levelOfTopic)) {
        isActive = true
      }
    })

    return isActive
  }

  const handleCustomClick = () => {
    setShowGrammarModal(true)
  }

  if (currentStepIndex !== 2) {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '30px',
      }}
    >
      <div style={{ display: 'flex', gap: '25px', justifyContent: 'center', width: '500px' }}>
        {[1, 2, 3, 4].map(level => (
          <ToggleButton
            key={level}
            handleClick={() => handleLevelClick(level)}
            name={`level ${level}`}
            width="100px"
            active={isLevelButtonActive(level) && !isCustomButtonActive()}
          />
        ))}
      </div>
      <hr style={{ color: '#333', width: '320px' }} />
      <ToggleButton
        handleClick={handleCustomClick}
        name="custom"
        width="100px"
        active={isCustomButtonActive()}
      />
    </div>
  )
}

export default GrammarView
