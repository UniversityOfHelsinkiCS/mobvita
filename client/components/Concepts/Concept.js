import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Collapse } from 'react-collapse'
import { Icon } from 'semantic-ui-react'
import { Form } from 'react-bootstrap'
import { useIntl } from 'react-intl'

const Concept = ({
  concept,
  showTestConcepts,
  showLevels,
  conceptTurnedOn,
  testConceptQuestionAmount,
  handleCheckboxChange,
  handleTestQuestionAmountChange,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const {
    exer_enabled: exerEnabled,
    test_enabled: testEnabled,
    question_num: maxNumQuestions,
    test_count: defaultNumQuestions,
    name,
  } = concept

  const [numberError, setNumberError] = useState(false)
  const { target } = useParams()
  const intl = useIntl()

  const conceptNameClass =
    exerEnabled === undefined || exerEnabled || (showTestConcepts && testEnabled)
      ? 'concept-name'
      : 'concept-name concept-disabled'

  const caretIconName = open ? 'caret down' : 'caret right'
  const isLeaf = concept.children.length === 0
  const renderTestConcepts = isLeaf && showTestConcepts && target === 'groups'
  const renderLevels = showLevels && concept.level !== null && concept.level !== undefined

  const validateNumberInput = event => {
    const number = Number(event.target.value)
    if (Number.isNaN(number)) return setNumberError(true)
    if (number < 0) return setNumberError(true)
    if (!Number.isInteger(number)) return setNumberError(true)

    setNumberError(false)
    return handleTestQuestionAmountChange(event)
  }

  const indeterminateCheck = conceptTurnedOn && conceptTurnedOn !== 1 && conceptTurnedOn !== 0

  return (
    <div className="concept">
      {numberError && <div style={{ color: 'red' }}>Please input a non-negative integer</div>}
      <div className="concept-row">
        <div style={{ display: 'flex', flex: 1 }}>
          <div className="concept-caret" style={{ paddingRight: '32px' }}>
            {!isLeaf && <Icon name={caretIconName} onClick={() => setOpen(!open)} />}
          </div>
          <Form.Group>
            <Form.Check
              type="checkbox"
              inline
              onChange={handleCheckboxChange}
              checked={conceptTurnedOn}
              /* eslint-disable no-param-reassign */
              ref={el => {
                if (el) el.indeterminate = indeterminateCheck
              }}
              disabled={exerEnabled !== undefined && !exerEnabled}
            />
          </Form.Group>
          <span
            onClick={() => setOpen(!open)}
            onKeyPress={() => setOpen(!open)}
            role="button"
            tabIndex="0"
            className={conceptNameClass}
          >
            {name}
          </span>
          {renderLevels && (
            <div>
              {concept.level.map(level => (
                <sup key={`${concept.concept_id}${level}`} className="concept-level">
                  [{level}]
                </sup>
              ))}
            </div>
          )}
          {renderTestConcepts && (
            <>
              &nbsp;|&nbsp;{intl.formatMessage({ id: 'questions' })}:&nbsp;
              <Form.Control
                type="text"
                size="sm"
                style={{ width: '4em' }}
                disabled={testEnabled !== undefined && !testEnabled}
                placeholder={testConceptQuestionAmount}
                onBlur={e => validateNumberInput(e)}
                isInvalid={numberError}
              />
              {defaultNumQuestions > 0
                ? `(max: ${maxNumQuestions},  ${intl.formatMessage({
                    id: 'default',
                  })}: ${defaultNumQuestions})`
                : `(${intl.formatMessage({ id: 'no-questions' })})`}
            </>
          )}
        </div>
      </div>
      <Collapse isOpened={open}>{children}</Collapse>
    </div>
  )
}

export default Concept
