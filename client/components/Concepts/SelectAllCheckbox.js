import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Form } from 'react-bootstrap'
import { updateExerciseSettings as updateUserSettings } from 'Utilities/redux/userReducer'
import { updateExerciseSettings as updateGroupSettings } from 'Utilities/redux/groupsReducer'
import { updateExerciseSettings as updateStorySettings } from 'Utilities/redux/storiesReducer'

const SelectAllCheckbox = ({ showTestConcepts }) => {
  const { concepts } = useSelector(({ metadata }) => metadata)
  const { target, id } = useParams()
  const dispatch = useDispatch()

  let exerciseSettings
  let updateSettings
  switch (target) {
    case 'groups':
      exerciseSettings = useSelector(({ groups }) => groups.group && groups.group.exercise_setting)
      updateSettings = updateGroupSettings
      break
    case 'stories':
      exerciseSettings = useSelector(
        ({ stories }) => stories.focused && stories.focused.exercise_setting
      )
      updateSettings = updateStorySettings
      break
    default:
      exerciseSettings = useSelector(({ user }) => user && user.data.user.exercise_setting)
      updateSettings = updateUserSettings
  }

  if (!exerciseSettings) return null

  const superConcepts = concepts.filter(c => c.super)

  // Tells if some/all/none of the super concepts are enabled or partially enabled.
  // 1 = all fully enabled, 0 = all fully disabled, 0 < x < 1 partially enabled
  const childrenEnabledAverage =
    superConcepts.reduce((sum, sc) => sum + exerciseSettings[sc.concept_id], 0) /
    superConcepts.length
  const checked = childrenEnabledAverage === 1

  const indeterminateCheck =
    childrenEnabledAverage && childrenEnabledAverage !== 1 && childrenEnabledAverage !== 0

  const handleCheckboxClick = () => {
    const newValue = childrenEnabledAverage === 1 ? 0 : 1
    const updatedValues = superConcepts.reduce(
      (values, sc) => ({ ...values, [sc.concept_id]: newValue }),
      {}
    )
    dispatch(updateSettings(updatedValues, id))
  }

  const hidden = showTestConcepts ? { visibility: 'hidden' } : { visibility: 'visible' }

  return (
    <div style={hidden} className="concept-enable-all">
      <Form.Group>
        <Form.Check
          type="checkbox"
          inline
          onChange={handleCheckboxClick}
          checked={checked && !showTestConcepts}
          /* eslint-disable no-param-reassign */
          ref={el => {
            if (el) el.indeterminate = indeterminateCheck
          }}
          disabled={showTestConcepts}
        />
      </Form.Group>
      <span>
        <FormattedMessage id="select-unselect-all" />
      </span>
    </div>
  )
}

export default SelectAllCheckbox
