import React, { useState } from 'react'
import { Modal, Tab, TabPane, Icon } from 'semantic-ui-react'

import Topics from 'Components/Topics'
import ListeningExerciseSettings from 'Components/ListeningExerciseSettings'
import { FormattedMessage, useIntl } from 'react-intl'
import ToggleButton from './ToggleButton'

const GrammarView = ({
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

      if (!levelOfTopic) {
        // This topic is a listening topic which are not included in any level
        isActive = true
      } else if (!isLevelButtonActive(levelOfTopic)) {
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '30px',
        }}
      >
        <div style={{ display: 'flex', gap: '25px', justifyContent: 'center' }}>
          {[1, 2, 3, 4].map(level => (
            <ToggleButton
              key={level}
              handleClick={() => handleLevelClick(level)}
              name={`level ${level}`}
              width="130px"
              height="55px"
              active={isLevelButtonActive(level) && !isCustomButtonActive()}
              level={level}
            />
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

export default GrammarView
