// eslint-disable-next-line no-unused-vars
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { FormattedMessage, useIntl } from 'react-intl'

import { cefrNumberToLevel } from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import AppDialog from 'Components/ui/AppDialog'
import AppTabs from 'Components/ui/AppTabs'
import CustomTooltip from 'Components/CustomTooltip'
import Topics from 'Components/Topics'
import ListeningExerciseSettings from 'Components/ListeningExerciseSettings'
import ToggleButton from '../ToggleButton'

import './SelectGrammarLevelStyles.css'

const GRAMMAR_LEVELS = [1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 4]

// Uses one button for all level 4 lesson topic items, but exact groups for the others.
const getLessonTopicItemLevel = lessonTopicItem => {
  if (!lessonTopicItem.group) return null

  const group = String(lessonTopicItem.group)

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
  const [activeTab, setActiveTab] = useState('grammar')
  const intl = useIntl()
  const lessonTopicItems = lessons || []
  const { grade, current_cefr: currentCefr } = useSelector(state => state.user.data.user)
  const recommendedBaseLevel = cefrNumberToLevel(currentCefr) || cefrNumberToLevel(grade) || 1
  const recommendedLevel = recommendedBaseLevel === 4 ? 4 : Number(`${recommendedBaseLevel}.1`)
  const selectedTopics = selectedTopicIds || []
  const selectedTopicSet = useMemo(() => new Set(selectedTopics), [selectedTopics])

  // Lists which topic ids belong to each level button.
  const topicIdsByLevel = useMemo(() => {
    return lessonTopicItems.reduce((groups, lessonTopicItem) => {
      const groupName = getLessonTopicItemLevel(lessonTopicItem)
      if (!groupName) return groups

      if (!groups[groupName]) {
        groups[groupName] = []
      }
      lessonTopicItem.topics.forEach(topic => {
        if (!groups[groupName].includes(topic)) {
          groups[groupName].push(topic)
        }
      })
      return groups
    }, {})
  }, [lessonTopicItems])

  // Returns true when every topic under this level is checked.
  const areAllLevelTopicsSelected = (level, topicSet = selectedTopicSet) => {
    const levelTopicIds = topicIdsByLevel[level] || []

    return levelTopicIds.length > 0 && levelTopicIds.every(topicId => topicSet.has(topicId))
  }

  const activeLevels = useMemo(
    () => GRAMMAR_LEVELS.filter(level => areAllLevelTopicsSelected(level)),
    [selectedTopicSet, topicIdsByLevel],
  )

  const activeLevelSet = useMemo(() => new Set(activeLevels), [activeLevels])

  // Gets all topic ids that come from these level buttons.
  const getTopicIdSetByLevels = levels => {
    const topicIds = new Set()

    levels.forEach(level => {
      ;(topicIdsByLevel[level] || []).forEach(topicId => topicIds.add(topicId))
    })

    return topicIds
  }

  const activeLevelTopicIdSet = useMemo(
    () => getTopicIdSetByLevels(activeLevels),
    [activeLevels, topicIdsByLevel],
  )

  // Custom is active when the checked topics are not exactly full selected levels.
  const customButtonActive = useMemo(() => {
    if (selectedTopicSet.size === 0) return false
    if (selectedTopicSet.size !== activeLevelTopicIdSet.size) return true

    return selectedTopics.some(topicId => !activeLevelTopicIdSet.has(topicId))
  }, [activeLevelTopicIdSet, selectedTopicSet, selectedTopics])

  // Selects or unselects every topic under one level button.
  const handleLevelClick = level => {
    const levelTopicIds = topicIdsByLevel[level] || []
    const newTopicIds = new Set(selectedTopics)

    if (activeLevelSet.has(level)) {
      const topicIdsInOtherActiveLevels = getTopicIdSetByLevels(
        activeLevels.filter(activeLevel => activeLevel !== level),
      )

      levelTopicIds.forEach(topicId => {
        if (!topicIdsInOtherActiveLevels.has(topicId)) {
          newTopicIds.delete(topicId)
        }
      })
    } else {
      levelTopicIds.forEach(topicId => newTopicIds.add(topicId))
    }

    setSelectedTopics(Array.from(newTopicIds))
  }

  // Receives checkbox changes from Custom and saves the selected topic ids.
  const handleCustomTopicsChange = topics => {
    setSelectedTopics(topics)
  }

  if (currentStepIndex !== 2) {
    return null
  }

  const topicsPane = (
    <Topics
      topicInstance={topicInstance}
      editable={editable}
      setSelectedTopics={handleCustomTopicsChange}
      showPerf={showPerf}
    />
  )

  const tabItems = [
    { value: 'grammar', label: intl.formatMessage({ id: 'Grammar topics' }) },
    { value: 'listening', label: intl.formatMessage({ id: 'listening-exercises' }) },
  ]

  // The tabs variant ("Customize learning settings") and the plain variant share one AppDialog;
  // only the title and body differ.
  const dialogTitle = showListeningSettings ? (
    <FormattedMessage id="custom" />
  ) : (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <IconButton
        onClick={() => setModal(false)}
        aria-label="back"
        size="small"
        sx={{ color: colors.ink }}
      >
        <ArrowBackIcon />
      </IconButton>
      <FormattedMessage id="select-lesson-grammar" />
    </span>
  )

  return (
    <>
      <AppDialog open={modal} onClose={() => setModal(false)} maxWidth="md" title={dialogTitle}>
        {showListeningSettings ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <AppTabs tabs={tabItems} value={activeTab} onChange={setActiveTab} fullWidth bordered />
            </div>
            {activeTab === 'grammar' ? (
              topicsPane
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 500,
                }}
              >
                <ListeningExerciseSettings />
              </div>
            )}
          </>
        ) : (
          topicsPane
        )}
      </AppDialog>
      <div className="grammar-buttons-container">
        <div className="grammar-level-button-group">
          {GRAMMAR_LEVELS.map(level => (
            <div className="button-with-marker" key={level}>
              {recommendedLevel === level && (
                <CustomTooltip
                  title={intl.formatMessage({ id: 'recommended-grammar-topics-level-popup' })}
                  placement="top"
                  permanent
                >
                  <span style={{ display: 'inline-flex' }}>
                    <ArrowDropDownIcon fontSize="large" sx={{ color: colors.ink }} />
                  </span>
                </CustomTooltip>
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
