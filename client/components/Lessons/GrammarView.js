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
      groups[groupName].push(lesson.ID)
      return groups
    }, {})

    return levelTopics
  }

  const isButtonActive = level => {
    if (selectedTopicIds.length === 0) return false

    return getTopicsByLevel()[level].every(topic => selectedTopicIds.includes(topic))
  }

  const handleLevelClick = level => {
    let newTopics

    if (isButtonActive(level)) {
      newTopics = selectedTopicIds.filter(topicId => Number(topicId[0]) !== level)
    } else {
      newTopics = selectedTopicIds.concat(getTopicsByLevel()[level])
    }

    setSelectedTopics(newTopics)
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
            active={isButtonActive(level)}
          />
        ))}
      </div>
      <hr style={{ color: '#333', width: '320px' }} />
      <ToggleButton handleClick={handleCustomClick} name="custom" width="100px" />
    </div>
  )
}

export default GrammarView
