import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Tab, TabPane, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'

import { cefrNumberToLevel } from 'Utilities/common'
import Topics from 'Components/Topics'
import ListeningExerciseSettings from 'Components/ListeningExerciseSettings'
import ToggleButton from '../ToggleButton'

import './SelectGrammarLevelStyles.css'

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
  const recommendedLevel = cefrNumberToLevel(currentCefr) || cefrNumberToLevel(grade) || 1

  const getTopicsByLevel = () => {
    const levelTopics = lessons.reduce((groups, lesson) => {
      const groupName = lesson.group[0]
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

  const isCustomButtonActive = () => {
    if (selectedTopicIds.length === 0) return false

    let isActive = false

    selectedTopicIds.forEach(topicId => {
      let levelOfTopic
      ;[1, 2, 3, 4].forEach(level => {
        if (getTopicsByLevel()[level].includes(topicId)) {
          levelOfTopic = level
        }
      })

      if (levelOfTopic && !isLevelButtonActive(levelOfTopic)) {
        isActive = true
      }
    })

    return isActive
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
          {[1, 2, 3, 4].map(level => (
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
                width="130px"
                height="55px"
                active={isLevelButtonActive(level) && !isCustomButtonActive()}
                level={level}
              />
            </div>
          ))}
        </div>
        <hr style={{ color: '#333', width: '320px' }} />
        <ToggleButton
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
