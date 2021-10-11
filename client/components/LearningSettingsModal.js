import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Dropdown, Divider, Radio, Popup, Icon } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ButtonGroup, Button } from 'react-bootstrap'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { Link } from 'react-router-dom'
import {
  updateExerciseTemplate,
  updateMaxPracticePercent,
  updateGroupTemplateSelection,
  updateLearningSettingMode,
} from 'Utilities/redux/userReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { hiddenFeatures, learningLanguageSelector } from 'Utilities/common'
import ExerciseDensitySlider from './ExerciseDensitySlider'

const LearningSettingsModal = ({ trigger }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { pending } = useSelector(({ metadata }) => metadata)
  const { groups } = useSelector(({ groups }) => groups)
  const {
    exercise_setting_template: exerciseSettingTemplate,
    max_practice_prct: maxPracticePrct,
    auto_practice_prct: autoPracticePrct,
    practice_prct_mode: practicePrctMode,
    last_selected_group: currentGroupId,
    exercise_history: exerciseHistory,
  } = useSelector(({ user }) => user.data.user)

  const latestStoryElo = exerciseHistory[exerciseHistory.length - 1]?.score
  const currentGroup = groups.find(group => group.group_id === currentGroupId)
  const learningLanguage = useSelector(learningLanguageSelector)
  const [open, setOpen] = useState(false)

  const skillLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  const getSliderValue = () => {
    if (practicePrctMode === 'auto') return autoPracticePrct
    if (practicePrctMode === 'custom') return maxPracticePrct
    if (practicePrctMode === 'group' && currentGroup) return currentGroup.max_practice_prct
    return null
  }

  const [sliderValue, setSliderValue] = useState(getSliderValue())

  useEffect(() => {
    if (!pending) {
      dispatch(getMetadata(learningLanguage))
    }
  }, [learningLanguage])

  useEffect(() => {
    if (currentGroup && practicePrctMode === 'group') {
      setSliderValue(currentGroup.max_practice_prct)
    }
  }, [currentGroup])

  useEffect(() => {
    if (open) dispatch(getGroups())
  }, [open])

  const convertEloToCefrLevel = elo => {
    if (elo < 1450) return 'A1'
    if (elo < 1650) return 'A2'
    if (elo < 1850) return 'B1'
    if (elo < 2050) return 'B2'
    if (elo < 2250) return 'C1'
    if (elo >= 2250) return 'C2'
    return null
  }

  const handleMaxPercentUpdate = value => {
    dispatch(updateMaxPracticePercent(value))
  }

  const handleLevelSelect = level => {
    dispatch(updateExerciseTemplate(level))
    dispatch(sidebarSetOpen(false))
  }

  const handleCustomSelect = () => {
    dispatch(updateExerciseTemplate('custom'))
    dispatch(sidebarSetOpen(false))
    setOpen(false)
  }

  const templateOptions = []

  groups.forEach(group =>
    templateOptions.push({
      key: group.group_id,
      text: group.groupName,
      value: group.group_id,
    })
  )

  const handleGroupChange = groupId => {
    dispatch(updateGroupTemplateSelection(groupId))
    const targetGroup = groups.find(group => group.group_id === groupId)
    setSliderValue(targetGroup.max_practice_prct)
  }

  const handleAutomaticOptionClick = () => {
    dispatch(updateLearningSettingMode('auto'))
    setSliderValue(autoPracticePrct)
  }

  const handlePersonalOptionClick = () => {
    dispatch(updateLearningSettingMode('personal'))
    setSliderValue(maxPracticePrct)
  }

  const handleGroupOptionClick = () => {
    if (currentGroup) {
      dispatch(updateLearningSettingMode('group', currentGroup.group_id))
      setSliderValue(currentGroup.max_practice_prct)
    }
  }

  const getLevelButtonStyle = level => {
    if (
      (practicePrctMode === 'auto' && level === convertEloToCefrLevel(latestStoryElo)) ||
      (practicePrctMode === 'custom' && level === exerciseSettingTemplate) ||
      (practicePrctMode === 'group' && level === currentGroup?.exercise_setting_template)
    ) {
      return { marginRight: '10px', color: 'yellow', fontWeight: 600 }
    }
    return { marginRight: '10px' }
  }

  const getCustomButtonStyle = () => {
    if (
      (practicePrctMode === 'group' &&
        !skillLevels.includes(currentGroup?.exercise_setting_template)) ||
      (practicePrctMode === 'custom' && !skillLevels.includes(exerciseSettingTemplate))
    ) {
      return { alignSelf: 'center', color: 'yellow', fontWeight: 600 }
    }
    return { alignSelf: 'center' }
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={trigger}
    >
      <Modal.Header>
        <FormattedMessage id="learning-settings" />
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '550' }}>
          <Popup
            position="top center"
            content={intl.formatMessage({
              id: 'choose-settings-template-info',
            })}
            trigger={<Icon name="info circle" color="grey" />}
          />{' '}
          <FormattedMessage id="choose-settings-template" />:
        </h2>
        <div className="learning-settings-radio-button-cont">
          <div className="learning-settings-radio-button-item">
            <Radio
              checked={practicePrctMode === 'auto'}
              value="auto"
              label={intl.formatMessage({ id: 'exercise-setting-automatic' })}
              onChange={() => handleAutomaticOptionClick()}
            />
          </div>
          <div className="learning-settings-radio-button-item">
            <Radio
              label={intl.formatMessage({ id: 'use-my-personal-settings' })}
              name="templateSelect"
              value="custom"
              checked={practicePrctMode === 'custom'}
              onChange={() => handlePersonalOptionClick()}
            />
          </div>
          <div className="flex-col learning-settings-radio-button-item">
            <span>
              <Radio
                label={intl.formatMessage({ id: 'use-my-group-settings' })}
                name="templateSelect"
                checked={practicePrctMode === 'group'}
                disabled={templateOptions.length === 0}
                onChange={() => handleGroupOptionClick()}
              />
              :
            </span>
            <Dropdown
              id="settings-template-selector"
              selection
              options={templateOptions}
              value={currentGroupId}
              disabled={practicePrctMode !== 'group' || templateOptions.length === 0}
              onChange={(e, data) => handleGroupChange(data.value)}
            />
          </div>
        </div>
        <Divider />
        <h2 style={{ fontSize: '17px', fontWeight: '550' }}>
          <Popup
            position="top center"
            content={intl.formatMessage({
              id: 'exercise-density-documentation',
            })}
            trigger={<Icon name="info circle" color="grey" />}
          />{' '}
          <FormattedMessage id="exercise-density" />
          {hiddenFeatures && (
            <span style={{ color: 'grey', marginLeft: '.5em' }}>({sliderValue})</span>
          )}
        </h2>
        <ExerciseDensitySlider
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          onAfterChange={handleMaxPercentUpdate}
          isDisabled={practicePrctMode !== 'custom'}
        />
        <>
          <Divider />
          <h2 style={{ fontSize: '17px', fontWeight: '550' }}>
            <Popup
              position="top center"
              content={intl.formatMessage({
                id: 'cefr-level-documentation',
              })}
              trigger={<Icon name="info circle" color="grey" />}
            />{' '}
            <FormattedMessage id="select-cefr-level" />
          </h2>
          <ButtonGroup
            name="difficultyButtons"
            id="difficultyButtons"
            size="md"
            style={{ marginTop: '1em' }}
          >
            {skillLevels.sort().map(level => (
              <Button
                style={getLevelButtonStyle(level)}
                disabled={practicePrctMode !== 'custom'}
                key={level}
                onClick={() => handleLevelSelect(level)}
              >
                {level}
              </Button>
            ))}
          </ButtonGroup>
          <br />

          <Button
            as={practicePrctMode === 'custom' ? Link : Button}
            to="/concepts"
            variant="primary"
            size="lg"
            onClick={handleCustomSelect}
            disabled={practicePrctMode !== 'custom'}
            style={getCustomButtonStyle()}
          >
            <FormattedMessage id="custom" />
          </Button>
        </>
      </Modal.Content>
    </Modal>
  )
}

export default LearningSettingsModal
