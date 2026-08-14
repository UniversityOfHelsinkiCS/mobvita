// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import { updateExerciseTemplate } from 'Utilities/redux/groupsReducer'
import CERFLevelSlider from 'Components/Sliders/CEFRLevelSlider'

const GroupLearningSettingsModal = ({ open, setOpen, groupId }) => {
  const dispatch = useDispatch()
  const { groups } = useSelector(({ groups }) => groups)

  const group = groups.find(group => group.group_id === groupId)
  const { groupName, grade } = group

  const getCERFSliderValue = () => {
    if (grade) {
      return grade * 11 * 11
    }
    return 121
  }

  const [cefrSliderValue, setCefrSliderValue] = useState(getCERFSliderValue())

  const submitSettings = () => {
    const minified = cefrSliderValue / 11
    const rounded = Math.floor(minified / 10)
    dispatch(updateExerciseTemplate(rounded, groupId))
    setOpen(false)
  }

  const dialogTitle = (
    <span>
      {groupName}: <FormattedMessage id="learning-settings" />
    </span>
  )

  return (
    <AppDialog open={open} onClose={() => setOpen(false)} title={dialogTitle}>
      <div style={{ marginTop: '0.5em' }}>
        <CERFLevelSlider
          sliderValue={cefrSliderValue}
          setSliderValue={setCefrSliderValue}
          noExtremeValue={false}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: '2.5em',
        }}
      >
        <AppButton variant="card" size="lg" as={Link} to={`/groups/teacher/${groupId}/topics`}>
          <FormattedMessage id="customize-learning-settings" />
        </AppButton>
        <AppButton variant="primary" size="lg" onClick={submitSettings}>
          <FormattedMessage id="update-settings" />
        </AppButton>
      </div>
    </AppDialog>
  )
}

export default GroupLearningSettingsModal
