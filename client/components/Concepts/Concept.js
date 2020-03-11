import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse } from 'react-collapse'
import { Icon } from 'semantic-ui-react'
import { Form } from 'react-bootstrap'
import { updateExerciseSettings } from 'Utilities/redux/userReducer'

const Concept = ({ concept, showTestConcepts, children }) => {
  const { concept_id: id, exer_enabled: exerEnabled, test_enabled: testEnabled, name } = concept
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const { conceptOn } = useSelector(({ user }) => (
    { conceptOn: user.data.user.exercise_setting[id] }))

  const handleChange = () => {
    dispatch(updateExerciseSettings({ [id]: conceptOn === 1 ? 0 : 1 }))
  }

  const conceptNameClass = exerEnabled === undefined
    || exerEnabled
    || (showTestConcepts && testEnabled) ? 'concept-name' : 'concept-name concept-disabled'

  const caretIconName = open ? 'caret down' : 'caret left'

  const isLeaf = concept.children.length === 0

  return (
    <div className="concept">
      <div className="concept-row">
        <div style={{ display: 'flex', flex: 1 }}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              inline
              onClick={undefined}
              onChange={handleChange}
              checked={conceptOn}
              ref={el => el && (el.indeterminate = conceptOn && conceptOn !== 1 && conceptOn !== 0)}
              disabled={(exerEnabled !== undefined && !exerEnabled)}
            />
          </Form.Group>
          {showTestConcepts && isLeaf
            && (
              <Form.Control
                type="text"
                size="sm"
                style={{ width: '4em' }}
                disabled={(testEnabled !== undefined && !testEnabled)}
              />
            )

          }
          <span
            onClick={() => setOpen(!open)}
            onKeyPress={() => setOpen(!open)}
            role="button"
            tabIndex="0"
            className={conceptNameClass}
          >
            {name}
          </span>
        </div>
        {!isLeaf && <Icon name={caretIconName} className="concept-caret" />}
      </div>
      <Collapse isOpened={open}>
        {children}
      </Collapse>
    </div>
  )
}

export default Concept
