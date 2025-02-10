import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {
  updateExerciseTemplate,
  updateGroupMaxPracticePercent,
} from 'Utilities/redux/groupsReducer'
import CERFLevelSlider from 'Components/CEFRLevelSlider'

const GroupLearningSettingsModal = ({ open, setOpen, groupId }) => {
  const dispatch = useDispatch()
  const { groups } = useSelector(({ groups }) => groups)
  const { practice_prct_mode: practicePrctMode } = useSelector(({ user }) => user.data.user)

  const group = groups.find(group => group.group_id === groupId)
  const {
    groupName,
    exercise_setting_template: exerciseSettingTemplate,
    max_practice_prct: maxPracticePercent,
    grade,
  } = group

  const getCERFSliderValue = () => {
    if (grade) {
      return grade * 11 * 11
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
              {/* slider */}
              <div>
                  <CERFLevelSlider 
                    sliderValue={cefrSliderValue}
                    setSliderValue={setCefrSliderValue} 
                    noExtremeValue={false}
                  />
              </div>
              {/* customize learning settings */}
              <div className="flex-reverse" style={{ marginBottom: '1.5em', marginTop: '1.0em' }}>
                  <Button
                      variant="primary"
                      size="lg"
                      as={Link}
                      to={`/groups/teacher/${groupId}/topics`}
                      style={{ color: 'yellow', fontWeight: 600, margin: '0 auto'}}
                  >
                      <FormattedMessage id="customize-learning-settings" />
                  </Button>
              </div>
              {/* save learning settings */}
              <Button variant="primary" size="lg" onClick={submitSettings}>
                  <FormattedMessage id="update-settings" />
              </Button>
          </>
      </Modal.Content>
    </Modal>
  )
}

export default GroupLearningSettingsModal
