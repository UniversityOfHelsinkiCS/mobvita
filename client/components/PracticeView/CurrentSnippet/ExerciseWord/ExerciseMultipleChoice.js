import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import AppSelect from 'Components/ui/AppSelect'
import { getTextWidth, formatGreenFeedbackText, getWordColor, getMode, skillLevels } from 'Utilities/common'
import { setFocusedWord, mcExerciseTouched } from 'Utilities/redux/practiceReducer'
import { setCurrentContext } from 'Utilities/redux/chatbotReducer'
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
      value: choice,
      label: choice,
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
    const width = getTextWidth(longestWord, '400 1.15rem Rubik')
    return width > 150 ? width * 1.2 : width + 34
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
      {/* AppSelect drives the option list (cream AppMenu popover), but the trigger stays a bespoke
          inline control: the design-system pill would be wrong mid-sentence, and `.exercise-multiple`
          already supplies the box plus the wrong/correct tints. onFocus/onBlur/onClick live on the
          trigger — AppMenu composes its own open handler with this onClick rather than replacing it. */}
      <AppSelect
        options={options}
        value={value}
        onChange={choice => handle(null, word, { value: choice })}
        minWidth={getInputWidth()}
        trigger={
          <button
            type="button"
            data-cy={!answersPending && 'exercise-multiple-choice' || 'exercise-multiple-choice-pending'}
            disabled={tested && !isWrong || answersPending}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onClick={() => dispatch(mcExerciseTouched(word))}
            className={`${className}`}
            style={{
              font: '400 1.15rem Rubik',
              width: getInputWidth(),
              minWidth: 80,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              textAlign: 'left',
              color: 'rgb(49, 49, 49)',
              cursor: tested && !isWrong || answersPending ? 'default' : 'pointer',
              backgroundColor: getWordColor(
                word.level, grade, skillLevels, show_review_diff, show_preview_exer, mode),
            }}
          >
            <span
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {value || placeholder}
            </span>
            <ArrowDropDownIcon style={{ fontSize: '1.1em', flexShrink: 0 }} />
          </button>
        }
      />
    </Tooltip>
  )
}

export default ExerciseMultipleChoice
