// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Tab, TabPane, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'

import { cefrNumberToLevel } from 'Utilities/common'
import Topics from 'Components/Topics'
import ListeningExerciseSettings from 'Components/ListeningExerciseSettings'
import ToggleButton from '../ToggleButton'

import './SelectGrammarLevelStyles.css'

const GRAMMAR_LEVELS = [1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 4]

// Identifies one topic row inside one lesson, even when another lesson has the same topic.
const getLessonTopicKey = (lessonId, topic) => `${lessonId}::${topic}`

// Uses one button for all level 4 lessons, but exact groups for the other levels.
const getLessonLevel = lesson => {
  if (!lesson.group) return null

  const group = String(lesson.group)

  return group.startsWith('4') ? '4' : group
}

const SelectGrammarLevel = ({
  currentStepIndex,
  lessons,
  selectedTopicIds,
  setSelectedTopics,
  topicInstance,
  editable,
  showPerf,
  showListeningSettings,
}) => {
  const [modal, setModal] = useState(false)
  const [selectedTopicKeys, setSelectedTopicKeys] = useState([])
  const intl = useIntl()
  const { grade, current_cefr: currentCefr } = useSelector(state => state.user.data.user)
  const recommendedBaseLevel = cefrNumberToLevel(currentCefr) || cefrNumberToLevel(grade) || 1
  const recommendedLevel = recommendedBaseLevel === 4 ? 4 : Number(`${recommendedBaseLevel}.1`)
  const selectedTopics = selectedTopicIds || []

  // Lists which topic rows belong to each level button.
  const topicKeysByLevel = useMemo(() => {
    return (lessons || []).reduce((groups, lesson) => {
      const groupName = getLessonLevel(lesson)
      if (!groupName) return groups

      if (!groups[groupName]) {
        groups[groupName] = []
      }
      lesson.topics.forEach(topic => {
        const topicKey = getLessonTopicKey(lesson.ID, topic)
        if (!groups[groupName].includes(topicKey)) {
          groups[groupName].push(topicKey)
        }
      })
      return groups
    }, {})
  }, [lessons])

  // Looks up the real topic name from a topic row key.
  const topicByKey = useMemo(() => {
    return (lessons || []).reduce((topics, lesson) => {
      lesson.topics.forEach(topic => {
        topics[getLessonTopicKey(lesson.ID, topic)] = topic
      })
      return topics
    }, {})
  }, [lessons])

  const selectedTopicKeySet = useMemo(() => new Set(selectedTopicKeys), [selectedTopicKeys])

  // If a saved lesson already has topic ids, check the matching rows in Custom.
  useEffect(() => {
    if (selectedTopicKeys.length > 0 || selectedTopics.length === 0) return

    const selectedTopicIdsSet = new Set(selectedTopics)
    const initialTopicKeys = Object.keys(topicByKey).filter(topicKey =>
      selectedTopicIdsSet.has(topicByKey[topicKey]),
    )

    setSelectedTopicKeys(initialTopicKeys)
  }, [selectedTopicKeys.length, selectedTopics, topicByKey])

  // Returns true when every topic row under this level is checked.
  const areAllLevelTopicsSelected = (level, topicKeySet = selectedTopicKeySet) => {
    const levelTopicKeys = topicKeysByLevel[level] || []

    return levelTopicKeys.length > 0 && levelTopicKeys.every(topicKey => topicKeySet.has(topicKey))
  }

  const activeLevels = useMemo(
    () => GRAMMAR_LEVELS.filter(level => areAllLevelTopicsSelected(level)),
    [selectedTopicKeySet, topicKeysByLevel],
  )

  const activeLevelSet = useMemo(() => new Set(activeLevels), [activeLevels])

  // Gets all checked row keys that come from these level buttons.
  const getTopicKeySetByLevels = levels => {
    const topicKeys = new Set()

    levels.forEach(level => {
      ;(topicKeysByLevel[level] || []).forEach(topicKey => topicKeys.add(topicKey))
    })

    return topicKeys
  }

  // Turns checked row keys back into the topic id list saved for practice.
  const getTopicIdsFromKeys = topicKeys => {
    const topics = new Set()

    topicKeys.forEach(topicKey => {
      if (topicByKey[topicKey]) {
        topics.add(topicByKey[topicKey])
      }
    })

    return Array.from(topics)
  }

  const activeLevelTopicKeySet = useMemo(
    () => getTopicKeySetByLevels(activeLevels),
    [activeLevels, topicKeysByLevel],
  )

  // Custom is active when the checked rows are not exactly full selected levels.
  const customButtonActive = useMemo(() => {
    if (selectedTopicKeySet.size === 0) return false
    if (selectedTopicKeySet.size !== activeLevelTopicKeySet.size) return true

    return selectedTopicKeys.some(topicKey => !activeLevelTopicKeySet.has(topicKey))
  }, [activeLevelTopicKeySet, selectedTopicKeySet, selectedTopicKeys])

  // Selects or unselects every topic row under one level button.
  const handleLevelClick = level => {
    const levelTopicKeys = topicKeysByLevel[level] || []
    const newTopicKeys = new Set(selectedTopicKeys)

    if (activeLevelSet.has(level)) {
      const topicKeysInOtherActiveLevels = getTopicKeySetByLevels(
        activeLevels.filter(activeLevel => activeLevel !== level),
      )

      levelTopicKeys.forEach(topicKey => {
        if (!topicKeysInOtherActiveLevels.has(topicKey)) {
          newTopicKeys.delete(topicKey)
        }
      })
    } else {
      levelTopicKeys.forEach(topicKey => newTopicKeys.add(topicKey))
    }

    const nextTopicKeys = Array.from(newTopicKeys)
    setSelectedTopicKeys(nextTopicKeys)
    setSelectedTopics(getTopicIdsFromKeys(nextTopicKeys))
  }

  // Receives checkbox changes from Custom and saves both row keys and topic ids.
  const handleCustomTopicsChange = (topics, topicKeys = selectedTopicKeys) => {
    setSelectedTopicKeys(topicKeys)
    setSelectedTopics(topics)
  }

  if (currentStepIndex !== 2) {
    return null
  }

  const panes = [
    {
      menuItem: intl.formatMessage({ id: 'Grammar topics' }),
      render: () => (
        <TabPane>
          <Topics
            topicInstance={topicInstance}
            editable={editable}
            setSelectedTopics={handleCustomTopicsChange}
            selectedTopicKeys={selectedTopicKeys}
            setSelectedTopicKeys={setSelectedTopicKeys}
            showPerf={showPerf}
          />
        </TabPane>
      ),
    },
    {
      menuItem: intl.formatMessage({ id: 'listening-exercises' }),
      render: () => (
        <TabPane
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '500px',
          }}
        >
          <ListeningExerciseSettings />
        </TabPane>
      ),
    },
  ]

  return (
    <>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        size="large"
        closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}
      >
        {showListeningSettings ? (
          <>
            <Modal.Header>
              <FormattedMessage id="custom" />
            </Modal.Header>
            <Tab panes={panes} />
          </>
        ) : (
          <>
            <Modal.Header>
              <button
                type="button"
                onClick={() => setModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  marginRight: '20px',
                }}
              >
                <Icon name="arrow left" />
              </button>
              <FormattedMessage id="select-lesson-grammar" />
            </Modal.Header>
            <Modal.Content>
              <Topics
                topicInstance={topicInstance}
                editable={editable}
                setSelectedTopics={handleCustomTopicsChange}
                selectedTopicKeys={selectedTopicKeys}
                setSelectedTopicKeys={setSelectedTopicKeys}
                showPerf={showPerf}
              />
            </Modal.Content>
          </>
        )}
      </Modal>
      <div className="grammar-buttons-container">
        <div className="grammar-level-button-group">
          {GRAMMAR_LEVELS.map(level => (
            <div className="button-with-marker" key={level}>
              {recommendedLevel === level && (
                <Popup
                  trigger={<Icon name="caret down" size="large" />}
                  content={intl.formatMessage({ id: 'recommended-grammar-topics-level-popup' })}
                  inverted
                  basic
                />
              )}
              <ToggleButton
                handleClick={() => handleLevelClick(level)}
                name={`level ${level}`}
                width="80px"
                height="55px"
                active={activeLevelSet.has(level)}
                level={level}
              />
            </div>
          ))}
        </div>
        <hr style={{ color: '#333', width: '320px' }} />
        <ToggleButton
          className="lesson-tour-custom-grammar-button"
          handleClick={() => setModal(true)}
          name="custom"
          width="130px"
          height="55px"
          active={customButtonActive}
        />
      </div>
    </>
  )
}

export default SelectGrammarLevel
