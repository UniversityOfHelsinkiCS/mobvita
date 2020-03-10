import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse } from 'react-collapse'
import { updateExerciseSettings } from 'Utilities/redux/userReducer'

const Concept = ({ header, id, children, enabled = true }) => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const { conceptOn } = useSelector(({ user }) => (
    { conceptOn: user.data.user.exercise_setting[id] }))

  const handleChange = () => {
    dispatch(updateExerciseSettings({ [id]: conceptOn === 1 ? 0 : 1 }))
  }

  const color = enabled && enabled ? '' : 'gray'

  return (
    <div style={{ paddingLeft: '1em' }}>
      <div
        onClick={() => setOpen(!open)}
        onKeyPress={() => setOpen(!open)}
        role="button"
        tabIndex="0"
      >
        <label htmlFor={`concept${id}`} style={{ color }}>
          {header}
          <input type="checkbox" onChange={handleChange} checked={Boolean(conceptOn)} />
        </label>
      </div>
      <Collapse isOpened={open}>
        {children}
      </Collapse>
    </div>
  )
}

export default Concept
