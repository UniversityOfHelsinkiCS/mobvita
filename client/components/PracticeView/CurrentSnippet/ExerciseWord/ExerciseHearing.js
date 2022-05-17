import React, { createRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import {
  getTextWidth,
  speak,
  learningLanguageSelector,
  voiceLanguages,
  formatGreenFeedbackText,
} from 'Utilities/common'
import { setFocusedWord } from 'Utilities/redux/practiceReducer'
import Tooltip from 'Components/PracticeView/Tooltip'

const ExerciseHearing = ({ word, handleChange }) => {
  const [value, setValue] = useState('')

  const [className, setClassname] = useState('exercise hearing-untouched')
  const [touched, setTouched] = useState(false)
  const [show, setShow] = useState(false)
  const [focusTimeout, setFocusTimeout] = useState(false)
  const inputRef = createRef(null)

  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])
  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()

  const { isWrong, tested } = word

  const voice = voiceLanguages[learningLanguage]

  const giveHint = () => {
    if (word.base !== word.surface) handleChange(word.base, word)
  }

  const getExerciseClass = (tested, isWrong) => {
    if (!tested) return 'exercise hearing-untouched'
    if (isWrong) return 'exercise wrong'
    return 'exercise correct'
  }

  useEffect(() => {
    setClassname(getExerciseClass(tested, isWrong))
    if (tested && isWrong) {
      giveHint()
      const val = currentAnswer ? currentAnswer.users_answer : ''
      setValue(val)
    }
  }, [tested])

  const speakerClickHandler = word => {
    // speak(word.audio, voice)
    inputRef.current.focus()
  }

  // Font is changed to 16px and back to disable iOS safari zoom in effect
  const changeElementFont = (element, size = '') => {
    element.style.fontSize = size
  }

  const handleInputFocus = e => {
    if (!touched) {
      if (!tested) setClassname('exercise hearing-touched')
      setTouched(true)
      handleChange(value, word)
    }
    dispatch(setFocusedWord(word))
    if (!focusTimeout) {
      console.log('speaking ', word.audio, '  ', voice)
      speak(word.audio, voice, 'exercise')
      setFocusTimeout(true)
      setTimeout(() => {
        setFocusTimeout(false)
      }, 500)
    }
    setShow(!show)
    changeElementFont(e.target)
  }

  const handleMouseDown = e => {
    changeElementFont(e.target, '16px')
  }

  const handle = e => {
    setValue(e.target.value)
  }

  const handleBlur = () => {
    handleChange(value, word)
    setShow(false)
  }

  const focusNextClozeOrHearing = element => {
    const { form } = element
    const nextElement = form.elements[Array.prototype.indexOf.call(form, element) + 1]
    const isNextElementInput = nextElement.className.includes('exercize')
    if (isNextElementInput) changeElementFont(nextElement, '16px')
    nextElement.focus()
  }

  const handleKeyDown = e => {
    const isEnterPressed = e.keyCode === 13
    if (isEnterPressed) {
      focusNextClozeOrHearing(e.target)
      e.preventDefault()
    }
  }

  const tooltip = (
    <div>
      {word.message && (
        <div className="tooltip-green">
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message)} />
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
      <span>
        <input
          onKeyDown={handleKeyDown}
          data-cy="exercise-hearing"
          readOnly={tested && !isWrong}
          ref={inputRef}
          key={word.ID}
          onChange={handle}
          value={value}
          onFocus={handleInputFocus}
          onBlur={handleBlur}
          onMouseDown={handleMouseDown}
          className={className}
          style={{
            width: getTextWidth(word.surface),
            minWidth: getTextWidth(word.surface),
            marginRight: '2px',
            height: '1.5em',
            lineHeight: 'normal',
          }}
        />
        <Icon
          name="volume up"
          link
          onClick={() => speakerClickHandler(word)}
          style={{ marginLeft: '-25px' }}
        />
        {word.negation && <sup style={{ marginLeft: '3px', color: '#0000FF' }}>(neg)</sup>}
      </span>
    </Tooltip>
  )
}

export default ExerciseHearing
