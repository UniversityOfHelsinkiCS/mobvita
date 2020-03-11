import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse } from 'react-collapse'
import { Icon } from 'semantic-ui-react'
import { updateExerciseSettings } from 'Utilities/redux/userReducer'

const Concept = ({ concept, children }) => {
  const { concept_id: id, exer_enabled: enabled, name } = concept
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const { conceptOn } = useSelector(({ user }) => (
    { conceptOn: user.data.user.exercise_setting[id] }))

  const handleChange = () => {
    dispatch(updateExerciseSettings({ [id]: conceptOn === 1 ? 0 : 1 }))
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
            ref={el => el && (el.indeterminate = conceptOn && conceptOn !== 1 && conceptOn !== 0)}
            disabled={(enabled !== undefined && !enabled)}
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
