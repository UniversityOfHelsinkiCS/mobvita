import React, { useState } from 'react'
import { Collapse } from 'react-collapse'
import { Icon } from 'semantic-ui-react'
import { Form } from 'react-bootstrap'

const Concept = ({
  concept,
  showTestConcepts,
  conceptTurnedOn,
  testConceptQuestionAmount,
  handleCheckboxChange,
  handleTestQuestionAmountChange,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const { exer_enabled: exerEnabled, test_enabled: testEnabled, name } = concept
  const [numberError, setNumberError] = useState(false)

  const conceptNameClass = exerEnabled === undefined
    || exerEnabled
    || (showTestConcepts && testEnabled) ? 'concept-name' : 'concept-name concept-disabled'

  const caretIconName = open ? 'caret down' : 'caret left'

  const isLeaf = concept.children.length === 0

  const validateNumberInput = (event) => {
    const number = Number(event.target.value)
    if (Number.isNaN(number)) return setNumberError(true)
    if (number < 0) return setNumberError(true)
    if (!Number.isInteger(number)) return setNumberError(true)

    setNumberError(false)
    return handleTestQuestionAmountChange(event)
  }

  return (
    <div className="concept">
      {numberError && (
        <div style={{ color: 'red' }}>
          Please input a non-negative integer
        </div>
      )}
      <div className="concept-row">
        <div style={{ display: 'flex', flex: 1 }}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              inline
              onChange={handleCheckboxChange}
              checked={conceptTurnedOn}
              ref={el => el && (el.indeterminate = conceptTurnedOn && conceptTurnedOn !== 1 && conceptTurnedOn !== 0)}
              disabled={(exerEnabled !== undefined && !exerEnabled)}
            />
          </Form.Group>
          {showTestConcepts && isLeaf
            && (
              <>
                <Form.Control
                  type="text"
                  size="sm"
                  style={{ width: '4em' }}
                  disabled={(testEnabled !== undefined && !testEnabled)}
                  placeholder={testConceptQuestionAmount}
                  onBlur={e => validateNumberInput(e)}
                  isInvalid={numberError}
                />
              </>
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
