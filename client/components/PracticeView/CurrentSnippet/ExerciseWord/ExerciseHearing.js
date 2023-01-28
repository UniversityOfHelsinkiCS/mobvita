import React, { createRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import {
  getTextWidth,
  speak,
  learningLanguageSelector,
  voiceLanguages,
  formatGreenFeedbackText,
  getWordColor,
  skillLevels,
} from 'Utilities/common'
import { setFocusedWord, handleVoiceSampleCooldown } from 'Utilities/redux/practiceReducer'
import Tooltip from 'Components/PracticeView/Tooltip'

const ExerciseHearing = ({ word, handleChange }) => {
  const [value, setValue] = useState('')
  const [className, setClassName] = useState('exercise')
  const [touched, setTouched] = useState(false)
  const [iconDisabled, setIconDisabled] = useState(false)
  const [show, setShow] = useState(false)
  const [focusTimeout, setFocusTimeout] = useState(false)
  const [count, setCount] = useState(0)
  const [lastWord, setLastWord] = useState('')
  const inputRef = createRef(null)
  const { voiceSampleOnCooldown } = useSelector(({ practice }) => practice)
  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[`${word.ID}-${word.id}`])
  const learningLanguage = useSelector(learningLanguageSelector)
  const { resource_usage } = useSelector(state => state.user.data.user)
  const { grade } = useSelector(state => state.user.data.user)

  const dispatch = useDispatch()

  const { isWrong, tested } = word

  const voice = voiceLanguages[learningLanguage]

  const giveHint = () => {
    if (word.base !== word.surface) handleChange(word.base, word)
  }

  const getExerciseClass = (tested, isWrong) => {
    if (!tested) return 'exercise'
    if (isWrong) return 'exercise wrong'
    return 'exercise correct'
  }

  useEffect(() => {
    setClassName(getExerciseClass(tested, isWrong))
    if (tested && isWrong) {
      // giveHint()
      const val = currentAnswer ? currentAnswer.users_answer : ''
      setValue(val)
    }
  }, [tested])

  useEffect(() => {
    if (voiceSampleOnCooldown) {
      setIconDisabled(true)
    } else {
      setIconDisabled(false)
    }
  }, [voiceSampleOnCooldown])

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
      if (!tested) setClassName('exercise')
      setTouched(true)
      handleChange(value, word)
    }
    dispatch(setFocusedWord(word))
    if (!focusTimeout && !voiceSampleOnCooldown) {
      if (lastWord === ''){
        setCount(count + 1)
        setLastWord(word)
      }
      else if (word === lastWord) setCount(count + 1)
      else{
        setCount(0)
        setLastWord(word)
      }
      speak(word.audio, voice, 'exercise', resource_usage, count)
      setFocusTimeout(true)
      dispatch(handleVoiceSampleCooldown())
      setTimeout(() => {
        setFocusTimeout(false)
      }, 500)
      setTimeout(() => {
        dispatch(handleVoiceSampleCooldown())
      }, 4000)
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
    const isNextElementInput = nextElement.className.includes('exercise')
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
            width: getTextWidth(word.surface) + 10,
            minWidth: getTextWidth(word.surface) + 10,
            backgroundColor: getWordColor(word.level, grade, skillLevels),
            marginRight: '2px',
            height: '1.5em',
            lineHeight: 'normal',
          }}
        />
        <Icon
          name="volume up"
          link
          onClick={() => speakerClickHandler(word)}
          style={{ marginLeft: '-25px', marginRight: '0.5em' }}
          disabled={iconDisabled}
        />
        {word.negation && <sup style={{ marginLeft: '3px', color: '#0000FF' }}>(neg)</sup>}
      </span>
    </Tooltip>
  )
}

export default ExerciseHearing
