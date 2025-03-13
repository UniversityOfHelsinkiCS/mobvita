import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Dropdown, Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { getTextWidth, formatGreenFeedbackText, getWordColor, getMode, skillLevels } from 'Utilities/common'
import { setFocusedWord, mcExerciseTouched } from 'Utilities/redux/practiceReducer'
import { setCurrentContext } from 'Utilities/redux/chatbotReducer'
// import { decreaseEloHearts } from 'Utilities/redux/snippetsReducer'
import { Button } from 'react-bootstrap'
import Tooltip from 'Components/PracticeView/Tooltip'
import { composeExerciseContext } from 'Utilities/common'

const ExerciseMultipleChoice = ({ word, snippet, handleChange }) => {
  const dispatch = useDispatch()
  const [className, setClassName] = useState('exercise-multiple')
  const [options, setOptions] = useState([])
  const [touched, setTouched] = useState(false)
  const [show, setShow] = useState(false)
  const mode = getMode()
  const { show_review_diff, show_preview_exer, grade } = useSelector(state => state.user.data.user)
  const [keepOpen, setKeepOpen] = useState(false)
  const { answersPending } = useSelector(({ snippets }) => snippets)
  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[`${word.ID}-${word.id}`])
  // const { eloHearts } = useSelector(({ snippets }) => snippets)
  const { attempt, focusedWord, latestMCTouched } = useSelector(({ practice }) => practice)
  const { 
    tested, 
    isWrong, 
    message, 
    hints, 
    ID: wordId, 
    ref, 
    explanation, 
    requested_hints, 
    frozen_messages, 
    hint2penalty } = word
  
  
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
    const temp = word.choices.map(choice => ({
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
    if (latestMCTouched !== word) {
      setShow(false)
    }
  }, [latestMCTouched])


  const maximumLength = word.choices.reduce((maxLength, currLength) => {
    if (currLength.length > maxLength) return currLength.length
    return maxLength
  }, 0)

  let longestWord = ''
  word.choices.forEach(choice => {
    if (choice.length > longestWord.length) {
      longestWord = choice
    }
  })

  const handleTooltipBlur = () => {
    setShow(false)
  }

  const placeholder = '_'.repeat(Math.min(maximumLength, 4))

  const handle = (e, word, data) => {
    if (!touched) {
      setTouched(true)
      if (!tested) setClassName('exercise-multiple')
    }

    handleChange(e, word, data)
  }




  const handleBlur = () => {
    if (!keepOpen) {
      setShow(false)
    }
    setKeepOpen(false)
  }

  const handleFocus = () => {
    if (hints && hints?.length > 0 || frozen_messages && frozen_messages?.length > 0) {
      setShow(!show)
    }
    dispatch(setFocusedWord(word))
    dispatch(setCurrentContext(composeExerciseContext(snippet, word)))
  }

  const getInputWidth = () => {
    const width = getTextWidth(longestWord)
    if (width >= 150) {
      return width + 20
    }

    return width
  }

  

  const tooltip = (
    <div onBlur={handleTooltipBlur}>
      {
        frozen_messages?.length>0 && (<div className="tooltip-hint" style={{ textAlign: 'left' }}>
        <ul style={{paddingLeft: '20px'}}>
          {frozen_messages.map((mess, index) => (
            <span key={index} className="flex">
              <li
                style={{ fontWeight: 'bold', fontStyle: 'italic' }}
                dangerouslySetInnerHTML={formatGreenFeedbackText(mess)}
              />
            </span>
          ))}
        </ul>
        </div>)
      }
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
        disabled={tested && !isWrong || answersPending}
        options={options}
        placeholder={placeholder}
        value={value}
        onChange={(e, data) => handle(e, word, data)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onClick={() => dispatch(mcExerciseTouched(word))}
        selection
        floating
        style={{
          width: getInputWidth(),
          minWidth: getInputWidth(),
          backgroundColor: getWordColor(
            word.level, grade, skillLevels, show_review_diff, show_preview_exer, mode),
        }}
        className={`${className}`}
      />
    </Tooltip>
  )
}

export default ExerciseMultipleChoice
