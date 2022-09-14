import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Divider, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ButtonGroup, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {
  updateExerciseTemplate,
  updateGroupMaxPracticePercent,
} from 'Utilities/redux/groupsReducer'
import CERFLevelSlider from 'Components/CEFRLevelSlider'
import { hiddenFeatures } from 'Utilities/common'

const GroupLearningSettingsModal = ({ open, setOpen, groupId }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { groups } = useSelector(({ groups }) => groups)
  const { practice_prct_mode: practicePrctMode } = useSelector(({ user }) => user.data.user)

  const group = groups.find(group => group.group_id === groupId)
  const {
    groupName,
    exercise_setting_template: exerciseSettingTemplate,
    max_practice_prct: maxPracticePercent,
  } = group

  const getCERFSliderValue = () => {
    if (exerciseSettingTemplate) {
      return exerciseSettingTemplate * 11 * 11
    }
    return 121
  }

  const [sliderValue, setSliderValue] = useState(maxPracticePercent)
  const [cefrSliderValue, setCefrSliderValue] = useState(getCERFSliderValue())

  const handleMaxPercentUpdate = value => {
    dispatch(updateGroupMaxPracticePercent(value, groupId))
  }

  const getLevelButtonStyle = lvl => {
    if (lvl === exerciseSettingTemplate) {
      return { marginRight: '10px', color: 'yellow', fontWeight: 600 }
    }
    return { marginRight: '10px' }
  }

  const submitSettings = () => {
    const minified = cefrSliderValue / 11
    const rounded = Math.floor(minified / 10)
    dispatch(updateExerciseTemplate(rounded, groupId))
  }

  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
      <Modal.Header>
        {groupName}: <FormattedMessage id="learning-settings" />
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="flex-reverse" style={{ marginBottom: '.5em' }}>
          <Button
            variant="primary"
            size="lg"
            as={Link}
            to={`/groups/teacher/${groupId}/concepts`}
            style={{ color: 'yellow', fontWeight: 600 }}
          >
            <FormattedMessage id="custom" />
          </Button>
        </div>
        {/* 
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
          isDisabled={false}
        />
        <Divider />
        */}
        <>
          <div>
            <CERFLevelSlider sliderValue={cefrSliderValue} setSliderValue={setCefrSliderValue} />
          </div>
          <Button variant="primary" size="lg" onClick={submitSettings}>
            <FormattedMessage id="update-settings" />
          </Button>
        </>
      </Modal.Content>
    </Modal>
  )
}

export default GroupLearningSettingsModal
