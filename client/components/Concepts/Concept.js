/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { Collapse } from 'react-collapse'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { FormattedMessage, useIntl } from 'react-intl'
import AppCheckbox from 'Components/ui/AppCheckbox'
import AppTextField from 'Components/ui/AppTextField'
import CustomTooltip from 'Components/CustomTooltip'
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
    test_enabled: testEnabled,
    question_num: maxNumQuestions,
    test_count: defaultNumQuestions,
    name,
  } = concept

  const [numberError, setNumberError] = useState(false)
  const intl = useIntl()
  const CaretIcon = open ? ArrowDropDownIcon : ArrowRightIcon
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

    if ((maxNumQuestions > 0 && showTestConcepts) || !showTestConcepts) {
      return (
        <CustomTooltip title={name} permanent>
          <span>{truncatedName}</span>
        </CustomTooltip>
      )
    }
    return (
      <CustomTooltip title={name} permanent>
        <span className="disabled-text">{truncatedName}</span>
      </CustomTooltip>
    )
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
            {!isLeaf && (
              <CaretIcon sx={{ cursor: 'pointer' }} onClick={() => setOpen(!open)} />
            )}
          </div>
          <AppCheckbox
            sx={{ p: 0, mr: '0.5em', ...hidden }}
            onChange={handleCheckboxChange}
            checked={Boolean(conceptTurnedOn) && !showTestConcepts}
            indeterminate={Boolean(indeterminateCheck)}
            disabled={showTestConcepts}
          />
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
              !showTestConcepts ? (
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
                {(maxNumQuestions > 0 && showTestConcepts) || !showTestConcepts ? (
                  <>{intl.formatMessage({ id: 'questions' })}:</>
                ) : (
                  <span className="disabled-text">
                    <>{intl.formatMessage({ id: 'no-questions' })}:</>
                  </span>
                )}
              </span>
              <CustomTooltip
                permanent
                title={`max: ${maxNumQuestions}, ${intl.formatMessage({
                  id: 'default',
                })}: ${defaultNumQuestions}`}
              >
                {/* Tooltip needs a ref-able child, and a disabled input swallows hover events —
                    the span gives it both. */}
                <span style={{ display: 'inline-flex' }}>
                  <AppTextField
                    type="text"
                    fullWidth={false}
                    sx={{ width: '5em' }}
                    disabled={(testEnabled !== undefined && !testEnabled) || maxNumQuestions === 0}
                    placeholder={maxNumQuestions > 0 ? String(testConceptQuestionAmount) : ''}
                    onBlur={e => validateNumberInput(e)}
                    error={numberError}
                  />
                </span>
              </CustomTooltip>
            </div>
          )}
        </div>
      </div>
      <Collapse isOpened={open}>{children}</Collapse>
    </div>
  )
}

export default Concept
