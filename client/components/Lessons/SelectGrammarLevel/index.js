// eslint-disable-next-line no-unused-vars
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Tab, TabPane, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'

import { cefrNumberToLevel } from 'Utilities/common'
import Topics from 'Components/Topics'
import ListeningExerciseSettings from 'Components/ListeningExerciseSettings'
import ToggleButton from '../ToggleButton'

import './SelectGrammarLevelStyles.css'

const GRAMMAR_LEVELS = [1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 4]

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
  const intl = useIntl()
  const { grade, current_cefr: currentCefr } = useSelector(state => state.user.data.user)
  const recommendedBaseLevel = cefrNumberToLevel(currentCefr) || cefrNumberToLevel(grade) || 1
  const recommendedLevel = recommendedBaseLevel === 4 ? 4 : Number(`${recommendedBaseLevel}.1`)
  const selectedTopics = selectedTopicIds || []

  const topicsByLevel = useMemo(() => {
    return (lessons || []).reduce((groups, lesson) => {
      const groupName = getLessonLevel(lesson)
      if (!groupName) return groups

      if (!groups[groupName]) {
        groups[groupName] = []
      }
      lesson.topics.forEach(topic => {
        if (!groups[groupName].includes(topic)) {
          groups[groupName].push(topic)
        }
      })
      return groups
    }, {})
  }, [lessons])

  const selectedTopicSet = useMemo(() => new Set(selectedTopics), [selectedTopics])

  const getActiveLevels = () =>
    GRAMMAR_LEVELS.filter(level => {
      const levelTopics = topicsByLevel[level] || []

      return levelTopics.length > 0 && levelTopics.every(topic => selectedTopicSet.has(topic))
    })

  const getTopicSetByLevels = levels => {
    const topics = new Set()

    levels.forEach(level => {
      ;(topicsByLevel[level] || []).forEach(topic => topics.add(topic))
    })

    return topics
  }

  const isLevelButtonActive = level => {
    if (selectedTopicSet.size === 0) return false

    const levelTopics = topicsByLevel[level] || []

    return levelTopics.length > 0 && levelTopics.every(topic => selectedTopicSet.has(topic))
  }

  const isCustomButtonActive = () =>
    selectedTopicSet.size > 0 &&
    GRAMMAR_LEVELS.some(level => {
      const levelTopics = topicsByLevel[level] || []
      const selectedLevelTopics = levelTopics.filter(topic => selectedTopicSet.has(topic))

      return selectedLevelTopics.length > 0 && selectedLevelTopics.length < levelTopics.length
    })

  const handleLevelClick = level => {
    const levelTopics = topicsByLevel[level] || []
    const activeLevels = getActiveLevels()
    const newTopics = new Set(selectedTopics)

    if (activeLevels.includes(level)) {
      const topicsInOtherActiveLevels = getTopicSetByLevels(
        activeLevels.filter(activeLevel => activeLevel !== level),
      )

      levelTopics.forEach(topic => {
        if (!topicsInOtherActiveLevels.has(topic)) {
          newTopics.delete(topic)
        }
      })
    } else {
      levelTopics.forEach(topic => newTopics.add(topic))
    }

    setSelectedTopics(Array.from(newTopics))
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
            setSelectedTopics={setSelectedTopics}
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
                setSelectedTopics={setSelectedTopics}
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
                active={isLevelButtonActive(level)}
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
          active={isCustomButtonActive()}
        />
      </div>
    </>
  )
}

export default SelectGrammarLevel
