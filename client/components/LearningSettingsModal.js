import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Dropdown, Divider, Radio } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ButtonGroup, Button } from 'react-bootstrap'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { Link } from 'react-router-dom'
import {
  updateExerciseTemplate,
  updatePracticePrctMode,
  updateMaxPracticePercent,
  updateGroupSelect,
  updatePracticeSettingsToAuto,
} from 'Utilities/redux/userReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
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
  } = useSelector(({ user }) => user.data.user)

  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const currentGroup = groups.find(group => group.group_id === currentGroupId)

  const getSliderValue = () => {
    if (practicePrctMode === 'auto') return autoPracticePrct
    if (practicePrctMode === 'custom') return maxPracticePrct
    if (practicePrctMode === 'group' && currentGroup) return currentGroup.max_practice_prct
    return null
  }
  const learningLanguage = useSelector(learningLanguageSelector)
  const [open, setOpen] = useState(false)
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

  const skillLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  const handleMaxPercentUpdate = value => {
    dispatch(updateMaxPracticePercent(value))
    dispatch(setNotification('learning-settings-saved', 'success'))
  }

  const handleLevelSelect = level => {
    dispatch(updateExerciseTemplate(level))
    dispatch(setNotification('learning-settings-saved', 'success'))
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

  const handleGroupChange = async value => {
    await dispatch(updateGroupSelect(value))
    const targetGroup = groups.find(group => group.group_id === value)
    setSliderValue(targetGroup.max_practice_prct)
  }

  const handleAutomaticOptionClick = () => {
    dispatch(updatePracticeSettingsToAuto())
    setSliderValue(autoPracticePrct)
  }

  const handlePersonalOptionClick = () => {
    dispatch(updatePracticePrctMode('custom'))
    setSliderValue(maxPracticePrct)
  }

  const handleGroupOptionClick = () => {
    dispatch(updatePracticePrctMode('group'))
    setSliderValue(currentGroup.max_practice_prct)
  }

  const getLevelButtonStyle = level => {
    if (
      (level === exerciseSettingTemplate && practicePrctMode === 'custom') ||
      (level === currentGroup?.exercise_setting_template && practicePrctMode === 'group')
    ) {
      return { marginRight: '10px', color: 'yellow', fontWeight: 600 }
    }
    return { marginRight: '10px' }
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
        <label htmlFor="settings-template-selector" className="label">
          <FormattedMessage id="choose-settings-template" />:
        </label>
        <div className="space-between wrap" style={{ marginTop: '1em' }}>
          <div>
            <Radio
              checked={practicePrctMode === 'auto'}
              value="auto"
              label="Automatic (system chooses)"
              onChange={() => handleAutomaticOptionClick()}
            />
          </div>
          <div>
            <Radio
              label={intl.formatMessage({ id: 'use-my-personal-settings' })}
              name="templateSelect"
              value="custom"
              checked={practicePrctMode === 'custom'}
              onChange={() => handlePersonalOptionClick()}
            />
          </div>
          <div className="flex-col">
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
          <FormattedMessage id="exercise-density" />{' '}
          {hiddenFeatures && <span style={{ color: 'grey' }}>({sliderValue})</span>}
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
            <FormattedMessage id="select-cefr-level" />:
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
            style={
              exerciseSettingTemplate === 'custom'
                ? { color: 'yellow', fontWeight: 600, alignSelf: 'center' }
                : { alignSelf: 'center' }
            }
          >
            <FormattedMessage id="custom" />
          </Button>

          <Divider />
          <span className="additional-info">
            <FormattedMessage id="choose-settings-template-info" />
          </span>
        </>
      </Modal.Content>
    </Modal>
  )
}

export default LearningSettingsModal
