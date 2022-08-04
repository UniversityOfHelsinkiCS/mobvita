import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { getTextWidth, formatGreenFeedbackText, getWordColor, skillLevels } from 'Utilities/common'
import Tooltip from 'Components/PracticeView/Tooltip'

const ExerciseMultipleChoice = ({ word, handleChange }) => {
  const [className, setClassName] = useState('exercise-multiple')
  const [options, setOptions] = useState([])
  const [touched, setTouched] = useState(false)
  const [show, setShow] = useState(false)
  const { grade } = useSelector(state => state.user.data.user)
  const [preHints, setPreHints] = useState([])
  const [keepOpen, setKeepOpen] = useState(false)

  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])

  const { tested, isWrong, message } = word
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
    if (message) {
      setPreHints([])
    }
  }, [message])

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

  const placeholder = '_'.repeat(maximumLength)

  const handle = (e, word, data) => {
    if (!touched) {
      setTouched(true)
      if (!tested) setClassName('exercise-multiple')
    }

    handleChange(e, word, data)
  }

  const handlePreHints = () => {
    setPreHints(preHints.concat(word.hints[preHints.length]))
    setKeepOpen(true)
  }

  const handleBlur = () => {
    if (!keepOpen) {
      setShow(false)
    }
    setKeepOpen(false)
  }

  const tooltip = (
    <div>
      {word.message && (
        <div className="tooltip-green">
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message)} />
        </div>
      )}
      {word.hints?.length > 0 && preHints.length < word.hints?.length && (
        <div className="tooltip-green" style={{ cursor: 'pointer' }} onMouseDown={handlePreHints}>
          <FormattedMessage id="ask-for-a-hint" />
        </div>
      )}
      {preHints.length > 0 && (
        <div className="tooltip-hint">
          {preHints.map(hint => <li dangerouslySetInnerHTML={formatGreenFeedbackText(hint)} />)}
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
