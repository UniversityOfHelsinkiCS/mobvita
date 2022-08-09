import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { getTextWidth, formatGreenFeedbackText, getWordColor, skillLevels } from 'Utilities/common'
import { Button } from 'react-bootstrap'
import Tooltip from 'Components/PracticeView/Tooltip'

const ExerciseMultipleChoice = ({ word, handleChange }) => {
  const [className, setClassName] = useState('exercise-multiple')
  const [options, setOptions] = useState([])
  const [touched, setTouched] = useState(false)
  const [show, setShow] = useState(false)
  const { grade } = useSelector(state => state.user.data.user)
  const [preHints, setPreHints] = useState([])
  const [keepOpen, setKeepOpen] = useState(false)
  const [emptyHintsList, setEmptyHintsList] = useState(false)
  const [filteredHintsList, setFilteredHintsList] = useState([])
  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])
  const { attempt, focusedWord } = useSelector(({ practice }) => practice)


  const { tested, isWrong, message, hints } = word
  const value = currentAnswer ? currentAnswer.users_answer : ''

  const getExerciseClass = (tested, isWrong) => {
    if (!tested) return 'exercise-multiple'
    if (isWrong) return 'exercise-multiple wrong'
    return 'exercise-multiple correct'
  }

  useEffect(() => {
    setClassName(getExerciseClass(tested, isWrong))
  }, [tested])

  useEffect(() => {
    const temp = word.choices.sort().map(choice => ({
      key: `${word.ID}_${choice}`,
      value: choice,
      text: choice,
    }))
    setOptions(temp)
  }, [word])

  useEffect(() => {
    if (focusedWord !== word) {
      setShow(false)
    }
  }, [focusedWord])

  useEffect(() => {
    setFilteredHintsList(hints?.filter(hint => hint !== message))
    setPreHints([])
  }, [message, hints])

  const maximumLength = word.choices.reduce((maxLength, currLength) => {
    if (currLength.length > maxLength) return currLength.length
    return maxLength
  }, 0)

  let testString = ''
  word.choices.forEach(choice => {
    if (choice.length > testString.length) {
      testString = choice
    }
  })

  const handleTooltipBlur = () => {
    setShow(false)
  }

  const placeholder = '_'.repeat(maximumLength)

  const handle = (e, word, data) => {
    if (!touched) {
      setTouched(true)
      if (!tested) setClassName('exercise-multiple')
    }

    handleChange(e, word, data)
  }

  const handlePreHints = () => {
    if (!hints || filteredHintsList.length < 1) {
      setEmptyHintsList(true)
      setKeepOpen(true)
    } else {
      setPreHints(preHints.concat(filteredHintsList[preHints.length]))
      setKeepOpen(true)
    }
  }

  const handleBlur = () => {
    if (!keepOpen) {
      setShow(false)
    }
    setKeepOpen(false)
  }

  const tooltip = (
    <div>
      {(!hints || filteredHintsList.length < 1 || preHints.length < filteredHintsList?.length) &&
        !emptyHintsList && attempt === 0 &&  (
          <div className="tooltip-green">
            <Button variant="primary" onMouseDown={handlePreHints} onBlur={handleTooltipBlur}>
              <FormattedMessage id="ask-for-a-hint" />
            </Button>
          </div>
        )}{' '}
      {(preHints?.length > 0 || message) && (
        <div className="tooltip-hint" style={{ textAlign: 'left' }}>
          <ul>
            {message && <li dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message)} />}
            {preHints?.map(hint => (
              <li dangerouslySetInnerHTML={formatGreenFeedbackText(hint)} />
            ))}
          </ul>
        </div>
      )}
      {emptyHintsList && (
        <div className="tooltip-green">
          <FormattedMessage id="no-hints-available" />
        </div>
      )}
    </div>
  )

  return (
    <Tooltip
      placement="top"
      trigger="none"
      onVisibilityChange={setShow}
      tooltipShown={show}
      closeOnOutOfBoundaries
      tooltip={tooltip}
      additionalClassnames="clickable"
    >
      <Dropdown
        key={word.ID}
        disabled={tested && !isWrong}
        options={options}
        placeholder={placeholder}
        value={value}
        onChange={(e, data) => handle(e, word, data)}
        onBlur={handleBlur}
        onFocus={() => setShow(!show)}
        selection
        floating
        style={{
          width: getTextWidth(testString),
          minWidth: getTextWidth(testString),
          backgroundColor: getWordColor(word.level, grade, skillLevels),
        }}
        className={`${className}`}
      />
    </Tooltip>
  )
}

export default ExerciseMultipleChoice
