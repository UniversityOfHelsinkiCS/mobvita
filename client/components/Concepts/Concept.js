import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse } from 'react-collapse'
import { Icon } from 'semantic-ui-react'
import { updateExerciseSettings } from 'Utilities/redux/userReducer'

const Concept = ({ concept, children }) => {
  const { concept_id: id, exer_enabled: enabled, name } = concept
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  // const checkIfChildrenEnabled = () => {
  //   concept.children.forEach((c) => {
  //     if (c.exer_enabled === 1) return 1
  //   })
  //   return 0
  // }

  const { conceptOn } = useSelector(({ user }) => (
    { conceptOn: user.data.user.exercise_setting[id] }))
  // conceptOn = concept.children.length === 0
  //   ? conceptOn
  //   : checkIfChildrenEnabled()

  // const updateChildren = (parent, settings) => {
  //   parent.children.reduce((settings, c) => {
  //     settings
  //   })
  // }

  const handleChange = () => {
    // if (concept.children.length === 0) {
    dispatch(updateExerciseSettings({ [id]: conceptOn === 1 ? 0 : 1 }))
    // } else {
    //   dispatch(updateExerciseSettings(
    //     updateChildren(concept, {})
    //   ))
    // }
  }

  const color = enabled === undefined || enabled ? '' : 'gray'
  const caretIconName = open ? 'caret down' : 'caret left'

  return (
    <div className="concept">
      <div
        onClick={() => setOpen(!open)}
        onKeyPress={() => setOpen(!open)}
        role="button"
        tabIndex="0"
        className="concept-row"
      >
        <label htmlFor={`concept${id}`} style={{ color }}>
          <input
            type="checkbox"
            onClick={undefined}
            onChange={handleChange}
            checked={conceptOn}
            disabled={enabled !== undefined && !enabled}
          />
          {name}
        </label>
        {concept.children.length > 0 && <Icon name={caretIconName} className="concept-caret" />}
      </div>
      <Collapse isOpened={open}>
        {children}
      </Collapse>
    </div>
  )
}

export default Concept
