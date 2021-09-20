import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Divider } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { ButtonGroup, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { setNotification } from 'Utilities/redux/notificationReducer'
import {
  updateExerciseTemplate,
  updateGroupMaxPracticePercent,
} from 'Utilities/redux/groupsReducer'
import ExerciseDensitySlider from 'Components/ExerciseDensitySlider'
import { hiddenFeatures } from 'Utilities/common'

const GroupLearningSettingsModal = ({ open, setOpen, groupId }) => {
  const dispatch = useDispatch()
  const { groups } = useSelector(({ groups }) => groups)
  const { practice_prct_mode: practicePrctMode } = useSelector(({ user }) => user.data.user)

  const group = groups.find(group => group.group_id === groupId)
  const {
    groupName,
    exercise_setting_template: exerciseSettingTemplate,
    max_practice_prct: maxPracticePercent,
  } = group

  const [sliderValue, setSliderValue] = useState(maxPracticePercent)
  const skillLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  const handleMaxPercentUpdate = value => {
    dispatch(updateGroupMaxPracticePercent(value, groupId))
    dispatch(setNotification('learning-settings-saved', 'success'))
  }

  const handleLevelSelect = level => {
    dispatch(updateExerciseTemplate(level, groupId))
    dispatch(setNotification('learning-settings-saved', 'success'))
  }

  const getLevelButtonStyle = lvl => {
    if (lvl === exerciseSettingTemplate) {
      return { marginRight: '10px', color: 'yellow', fontWeight: 600 }
    }
    return { marginRight: '10px' }
  }

  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
      <Modal.Header>
        {groupName}: <FormattedMessage id="learning-settings" />
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '550' }}>
          <FormattedMessage id="exercise-density" />{' '}
          {hiddenFeatures && <span style={{ color: 'grey' }}>({sliderValue})</span>}
        </h2>
        <ExerciseDensitySlider
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          onAfterChange={handleMaxPercentUpdate}
          isDisabled={false}
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
                key={level}
                onClick={() => handleLevelSelect(level)}
              >
                {level}
              </Button>
            ))}
          </ButtonGroup>
          <br />

          <Button
            as={Link}
            to={`/groups/teacher/${groupId}/concepts`}
            variant="primary"
            size="lg"
            onClick={() => dispatch(updateExerciseTemplate('custom', groupId))}
            disabled={practicePrctMode !== 'custom'}
            style={
              exerciseSettingTemplate === 'custom'
                ? { color: 'yellow', alignSelf: 'center', fontWeight: 600 }
                : { alignSelf: 'center' }
            }
          >
            <FormattedMessage id="custom" />
          </Button>
        </>
      </Modal.Content>
    </Modal>
  )
}

export default GroupLearningSettingsModal
