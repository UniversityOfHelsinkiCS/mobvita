import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getTextWidth,
  dictionaryLanguageSelector,
  rightAlignedLanguages,
  learningLanguageSelector,
  getTextStyle,
  exerciseMaskedLanguages,
  hiddenFeatures,
} from 'Utilities/common'
import { setFocusedWord, setReferences } from 'Utilities/redux/practiceReducer'
import Tooltip from 'Components/PracticeView/Tooltip'
import { Icon } from 'semantic-ui-react'

const ExerciseCloze = ({ word, handleChange, handleClick }) => {
  const [value, setValue] = useState('')
  const [className, setClassName] = useState('exercise cloze-untouched')
  const [touched, setTouched] = useState(false)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { isWrong, tested, ref } = word
  const [show, setShow] = useState(false)
  const target = useRef()

  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])

  const dispatch = useDispatch()

  const handleTooltipWordClick = () => {
    handleClick(
      exerciseMaskedLanguages.includes(learningLanguage) ? word.surface : word.base || word.bases,
      word.lemmas,
      word.ID,
      exerciseMaskedLanguages.includes(learningLanguage) ? word.base || word.bases : null
    )
  }

  const handleFeedbackClick = () => {
    if (ref && hiddenFeatures) dispatch(setReferences(ref))
  }

  const changeValue = e => {
    setValue(e.target.value)
  }

  const getExerciseClass = (tested, isWrong) => {
    if (!tested) return 'exercise cloze-untouched'
    if (isWrong) return 'exercise wrong'
    return 'exercise correct'
  }

  useEffect(() => {
    const val = currentAnswer ? currentAnswer.users_answer : ''
    setValue(val)
  }, [currentAnswer])

  useEffect(() => {
    setClassName(getExerciseClass(tested, isWrong))
  }, [tested])

  const tooltip = (
    <div>
      {word.message && (
        <div className="tooltip-green flex" onMouseDown={handleFeedbackClick} onClick={handleFeedbackClick}>
          {word.message}
          {word.ref && hiddenFeatures && (
            <Icon
              name="external"
              size="small"
              style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
            />
          )}
        </div>
      )}
      <div className="tooltip-blue" onMouseDown={handleTooltipWordClick} onClick={handleTooltipWordClick}>
        <span style={getTextStyle(learningLanguage, 'tooltip')}>{word.base || word.bases}</span>
        {` → ${dictionaryLanguage}`}
      </div>
    </div>
  )

  const handleBlur = () => {
    handleChange(value, word)
    // It just works...
    setTimeout(() => {
      setShow(false)
    }, 100)
  }

  const handleFocus = () => {
    if (!touched) {
      setTouched(true)
      if (!tested) setClassName('exercise cloze-touched')
      handleChange(value, word)
    }
    setShow(!show)
    dispatch(setFocusedWord(word))
  }

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      const { form } = e.target
      const index = Array.prototype.indexOf.call(form, e.target)
      form.elements[index + 1].focus()
      e.preventDefault()
    }
  }

  const direction = rightAlignedLanguages.includes(learningLanguage) ? 'bidi-override' : ''

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
      <input
        onKeyDown={handleKeyDown}
        ref={target}
        data-cy="exercise-cloze"
        autoCapitalize="off"
        readOnly={tested && !isWrong}
        key={word.ID}
        name={word.ID}
        placeholder={`${word.base || word.bases}`}
        value={value}
        onChange={changeValue}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={className}
        style={{
          width: word.surface > word.base ? getTextWidth(word.surface) : getTextWidth(word.base),
          marginRight: '2px',
          height: '1.5em',
          lineHeight: 'normal',
          unicodeBidi: direction,
        }}
      />
      {false && word.negation && <sup style={{ color: '#0000FF' }}>(neg)</sup>}
    </Tooltip>
  )
}

export default ExerciseCloze
