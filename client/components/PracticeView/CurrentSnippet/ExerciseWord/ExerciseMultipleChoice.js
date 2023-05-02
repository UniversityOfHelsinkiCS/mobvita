import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Dropdown, Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { getTextWidth, formatGreenFeedbackText, getWordColor, skillLevels } from 'Utilities/common'
import { incrementHintRequests, mcExerciseTouched } from 'Utilities/redux/practiceReducer'
// import { decreaseEloHearts } from 'Utilities/redux/snippetsReducer'
import { Button } from 'react-bootstrap'
import Tooltip from 'Components/PracticeView/Tooltip'

const ExerciseMultipleChoice = ({ word, handleChange }) => {
  const dispatch = useDispatch()
  const [className, setClassName] = useState('exercise-multiple')
  const [options, setOptions] = useState([])
  const [touched, setTouched] = useState(false)
  const [show, setShow] = useState(false)
  const { grade } = useSelector(state => state.user.data.user)
  const [preHints, setPreHints] = useState([])
  const [keepOpen, setKeepOpen] = useState(false)
  const [emptyHintsList, setEmptyHintsList] = useState(false)
  const [filteredHintsList, setFilteredHintsList] = useState([])
  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[`${word.ID}-${word.id}`])
  // const { eloHearts } = useSelector(({ snippets }) => snippets)
  const { attempt, focusedWord, latestMCTouched } = useSelector(({ practice }) => practice)
  const { tested, isWrong, message, hints, ID: wordId, requested_hints, frozen_messages, hint2penalty } = word
  
  const [eloScoreHearts, setEloScoreHearts] = useState(Array.from({length: hints ? hints.length : 0}, (_, i) => i + 1))
  const [spentHints, setSpentHints] = useState([])
  
  const value = currentAnswer ? currentAnswer.users_answer : ''
  const hintButtonVisibility =
    (!hints || filteredHintsList.length < 1 || preHints.length - requested_hints?.length < filteredHintsList?.length) &&
    !emptyHintsList
      ? { visibility: 'visible' }
      : { visibility: 'hidden' }
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
  /*
  useEffect(() => {
    if (eloHearts[wordId] >= 0) {
      if (eloHearts[wordId] === 0) {
        setEloScoreHearts([])
      } else {
        const currentEloHearts = Array.from(Array(eloHearts[wordId]).keys())
        setEloScoreHearts(currentEloHearts)
      }

      const difference = 5 - eloHearts[wordId]
      const newSpentHearts = Array.from(Array(difference).keys())
      setSpentHints(newSpentHearts)
    }
  }, [eloHearts[wordId]])
  */
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

  useEffect(() => {
    if (message && !hints && !requested_hints) {
      setPreHints([])
    } else if (attempt !== 0) {
      setFilteredHintsList(hints)
      setPreHints(requested_hints || [])
      // dispatch(incrementHintRequests(wordId, requested_hints?.length, requested_hints))
    } else {
      setFilteredHintsList(hints?.filter(hint => hint !== message))
      setPreHints(requested_hints || [])
      // dispatch(incrementHintRequests(wordId, requested_hints?.length, requested_hints))
    }
    /*
    if (!hints || !hints.length || message && !hints.filter(hint => hint !== message)) {
      setEmptyHintsList(true)
    }
    */
  }, [message, hints, requested_hints, attempt])

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

  const handleHintRequest = newHintList => {
    const newRequestNum = preHints.length + 1
    const penalties = newHintList?.filter(hint=> hint2penalty[hint]).map(hint=> hint2penalty[hint])
    dispatch(incrementHintRequests(`${word.ID}-${word.id}`, newRequestNum, newHintList, penalties))

    setSpentHints(spentHints.concat(1))
    setEloScoreHearts(eloScoreHearts.slice(0, -1))
  }

  const handlePreHints = () => {
    if (!hints && !requested_hints || filteredHintsList.length < 1 && requested_hints.length < 1) {
      setEmptyHintsList(true)
      handleHintRequest()
    } else {
      const newHintList = preHints.concat(filteredHintsList[preHints.length - requested_hints?.length])
      setPreHints(newHintList)
      handleHintRequest(newHintList)
    }
    setKeepOpen(true)
  }

  const handleBlur = () => {
    if (!keepOpen) {
      setShow(false)
    }
    setKeepOpen(false)
  }

  const handleFocus = () => {
    if (hints & hints?.length > 0 || frozen_messages & frozen_messages?.length > 0) {
      setShow(!show)
    }
  }

  const getInputWidth = () => {
    const width = getTextWidth(longestWord)
    if (width >= 150) {
      return width + 20
    }

    return width
  }

  let hint_context_box = <div></div>
  if (eloScoreHearts.length + spentHints.length > 0){
    hint_context_box = <div className="tooltip-green flex space-between">
      <Button style={hintButtonVisibility} variant="primary" onMouseDown={handlePreHints}>
        <FormattedMessage id="ask-for-a-hint" />
      </Button>
      <div>
        {eloScoreHearts.map(heart => (
          <Icon size="small" name="lightbulb" style={{ marginLeft: '0.25em' }} />
        ))}
        {spentHints.map(hint => (
          <Icon size="small" name="lightbulb outline" style={{ marginLeft: '0.25em' }} />
        ))}
      </div>
    </div>
  } else {
    hint_context_box = <div className="tooltip-green flex space-between">
      <div className="tooltip-hint" style={{ textAlign: 'left' }}>
        <FormattedMessage id="no-hints-available" />
      </div>
    </div>
  }

  const tooltip = (
    <div onBlur={handleTooltipBlur}>
      {/* <div className="tooltip-green flex space-between">
        <Button
          style={hintButtonVisibility}
          variant="primary"
          onMouseDown={handlePreHints}
        >
          <FormattedMessage id="ask-for-a-hint" />
        </Button>
        <div>
          {eloScoreHearts.map(heart => (
            <Icon size="small" name="lightbulb" style={{ marginLeft: '0.25em' }} />
          ))}
          {spentHints.map(hint => (
            <Icon size="small" name="lightbulb outline" style={{ marginLeft: '0.25em' }} />
          ))}
        </div>
      </div> */}
      {hint_context_box} {' '}{hint_context_box} {' '}
      <div className="tooltip-hint" style={{ textAlign: 'left' }}>
        <ul>
          {frozen_messages?.map(mess => (
            <span className="flex"><li style={{ fontWeight: 'bold', fontStyle: 'italic' }} dangerouslySetInnerHTML={formatGreenFeedbackText(mess)} />{ref && showRefIcon(mess) && (
              <Icon name="info circle" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
            )}
            {explanation && (
              checkString(mess)
            )}</span>
          ))}
          {message && attempt === 0 && <li dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message)} />}
          {preHints?.map(hint => (
            <li dangerouslySetInnerHTML={formatGreenFeedbackText(hint)} />
          ))}
        </ul>
      </div>
      {emptyHintsList && preHints?.length < 1 && (
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
        onFocus={handleFocus}
        onClick={() => dispatch(mcExerciseTouched(word))}
        selection
        floating
        style={{
          width: getInputWidth(),
          minWidth: getInputWidth(),
          backgroundColor: getWordColor(word.level, grade, skillLevels),
        }}
        className={`${className}`}
      />
    </Tooltip>
  )
}

export default ExerciseMultipleChoice
