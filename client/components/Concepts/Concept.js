/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Collapse } from 'react-collapse'
import { Icon, Popup } from 'semantic-ui-react'
import { Form } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { skillLevels } from 'Utilities/common'

const Concept = ({
  concept,
  target,
  showTestConcepts,
  showLevels,
  conceptTurnedOn,
  testConceptQuestionAmount,
  handleCheckboxChange,
  handleTestQuestionAmountChange,
  children,
  expandConcepts,
  collapseConcepts,
}) => {
  const CONCEPT_NAME_MAX_LEN = 50
  const [open, setOpen] = useState(false)
  const {
    exer_enabled: exerEnabled,
    test_enabled: testEnabled,
    question_num: maxNumQuestions,
    test_count: defaultNumQuestions,
    name,
  } = concept

  const [numberError, setNumberError] = useState(false)
  const intl = useIntl()
  const caretIconName = open ? 'caret down' : 'caret right'
  const isLeaf = concept.children.length === 0
  const renderTestConcepts = isLeaf && showTestConcepts && target === 'groups'
  const renderLevels = showLevels && concept.level !== null && concept.level !== undefined
  const [maxQuestionsExceeded, setMaxQuestionsExceeded] = useState(false)

  useEffect(() => {
    if (open) {
      setOpen(false)
    }
  }, [collapseConcepts])

  useEffect(() => {
    if (!open) {
      setOpen(true)
    }
  }, [expandConcepts])

  useEffect(() => {
    if (!showTestConcepts) {
      setNumberError(false)
      setMaxQuestionsExceeded(false)
    }
  }, [showTestConcepts])

  const validateNumberInput = event => {
    const number = Number(event.target.value)
    if (Number.isNaN(number) || number < 0 || !Number.isInteger(number)) {
      setMaxQuestionsExceeded(false)
      return setNumberError(true)
    }
    if (number > maxNumQuestions) {
      setNumberError(false)
      return setMaxQuestionsExceeded(true)
    }

    setMaxQuestionsExceeded(false)
    setNumberError(false)
    return handleTestQuestionAmountChange(event)
  }

  const truncateConceptName = name => {
    const truncatedName = `${name.slice(0, CONCEPT_NAME_MAX_LEN)}...`

    if ((maxNumQuestions > 0 && showTestConcepts) || (exerEnabled && !showTestConcepts)) {
      return <Popup content={name} trigger={<span>{truncatedName}</span>} />
    }
    return <Popup content={name} trigger={<span className="disabled-text">{truncatedName}</span>} />
  }

  const indeterminateCheck = conceptTurnedOn && conceptTurnedOn !== 1 && conceptTurnedOn !== 0
  const hidden = showTestConcepts ? { visibility: 'hidden' } : { visibility: 'visible' }
  const levelsHidden = renderLevels ? { visibility: 'visible' } : { visibility: 'hidden' }

  return (
    <div className="concept">
      {numberError && (
        <div style={{ color: 'red' }}>
          <FormattedMessage id="please-input-non-negative-integer" />
        </div>
      )}
      {maxQuestionsExceeded && (
        <div style={{ color: 'red' }}>
          <FormattedMessage id="max-questions-exceeded" values={{ maxNumQuestions }} />
        </div>
      )}
      <div className="concept-row">
        <div style={{ display: 'flex', flex: 1 }}>
          <div className="concept-caret" style={{ paddingRight: '32px' }}>
            {!isLeaf && <Icon name={caretIconName} onClick={() => setOpen(!open)} />}
          </div>
          <Form.Group>
            <Form.Check
              style={hidden}
              type="checkbox"
              inline
              onChange={handleCheckboxChange}
              checked={conceptTurnedOn && exerEnabled && !showTestConcepts}
              /* eslint-disable no-param-reassign */
              ref={el => {
                if (el) el.indeterminate = indeterminateCheck
              }}
              disabled={(exerEnabled !== undefined && !exerEnabled) || showTestConcepts}
            />
          </Form.Group>
          <span
            onClick={() => setOpen(!open)}
            onKeyPress={() => setOpen(!open)}
            role="button"
            tabIndex="0"
            className="concept-name"
          >
            {name.length > CONCEPT_NAME_MAX_LEN ? (
              <span>{truncateConceptName(name)}</span>
            ) : !isLeaf ||
              (maxNumQuestions > 0 && showTestConcepts) ||
              (exerEnabled && !showTestConcepts) ? (
              <span>{name}</span>
            ) : (
              <span className="disabled-text">{name}</span>
            )}
          </span>
          {concept?.level && (
            <div style={levelsHidden}>
              {concept.level.map(level => (
                <sup key={`${concept.concept_id}${level}`} className="concept-level">
                  [{skillLevels[level]}]
                </sup>
              ))}
            </div>
          )}
          {renderTestConcepts && (
            <div style={{ marginLeft: '1.5em', display: 'flex' }}>
              <span style={{ marginRight: '0.3em' }}>
                {(maxNumQuestions > 0 && showTestConcepts) || (exerEnabled && !showTestConcepts) ? (
                  <>{intl.formatMessage({ id: 'questions' })}:</>
                ) : (
                  <span className="disabled-text">
                    <>{intl.formatMessage({ id: 'no-questions' })}:</>
                  </span>
                )}
              </span>
              <Popup
                content={`max: ${maxNumQuestions}, ${intl.formatMessage({
                  id: 'default',
                })}: ${defaultNumQuestions}`}
                trigger={
                  <Form.Control
                    type="text"
                    size="sm"
                    style={{ width: '4em' }}
                    disabled={(testEnabled !== undefined && !testEnabled) || maxNumQuestions === 0}
                    placeholder={maxNumQuestions > 0 ? testConceptQuestionAmount : ''}
                    onBlur={e => validateNumberInput(e)}
                    isInvalid={numberError}
                  />
                }
              />
            </div>
          )}
        </div>
      </div>
      <Collapse isOpened={open}>{children}</Collapse>
    </div>
  )
}

export default Concept
