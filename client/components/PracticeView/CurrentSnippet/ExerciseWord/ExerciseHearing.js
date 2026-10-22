import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import {
  useTextWidth,
  speak,
  learningLanguageSelector,
  voiceLanguages,
  formatGreenFeedbackText,
  getWordColor,
  skillLevels,
  getMode
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
  const inputRef = useRef(null)
  const skipFocusSample = useRef(false)
  const { voiceSampleOnCooldown, focusedWord } = useSelector(({ practice }) => practice)
  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[`${word.ID}-${word.id}`])
  const { answersPending } = useSelector(({ snippets }) => snippets)
  const learningLanguage = useSelector(learningLanguageSelector)
  const mode = getMode()
  const { resource_usage, show_review_diff, show_preview_exer, grade } = useSelector(state => state.user.data.user)
  const listeningHighlighting = focusedWord.audio_wids?.start <= word.ID && word.ID <= focusedWord.audio_wids?.end || word.ID === focusedWord.ID

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
    const val = currentAnswer ? currentAnswer.users_answer : ''
    setValue(val)
  }, [currentAnswer])

  useEffect(() => {
    setClassName(getExerciseClass(tested, isWrong))
  }, [tested])

  useEffect(() => {
    if (voiceSampleOnCooldown) {
      setIconDisabled(true)
    } else {
      setIconDisabled(false)
    }
  }, [voiceSampleOnCooldown])

  // Returning to the tab or window re-fires focus on the blank; that is no new visit, so no audio.
  useEffect(() => {
    const onWindowBlur = () => {
      if (document.activeElement === inputRef.current) skipFocusSample.current = true
    }
    const onWindowFocus = () => setTimeout(() => (skipFocusSample.current = false))
    window.addEventListener('blur', onWindowBlur)
    window.addEventListener('focus', onWindowFocus)
    return () => {
      window.removeEventListener('blur', onWindowBlur)
      window.removeEventListener('focus', onWindowFocus)
    }
  }, [])

  // Plays the exercise audio; the repeat counter switches between the fast and slow speeds.
  const playSample = () => {
    if (lastWord === '') {
      setCount(count + 1)
      setLastWord(word)
    } else if (word === lastWord) setCount(count + 1)
    else {
      setCount(0)
      setLastWord(word)
    }
    speak(word.audio, voice, 'exercise', resource_usage, count)
  }

  // One request per click: the focus this triggers must not play the audio a second time.
  const speakerClickHandler = () => {
    playSample()
    if (document.activeElement === inputRef.current) return
    skipFocusSample.current = true
    inputRef.current.focus()
    skipFocusSample.current = false
  }

  // Font is changed to 16px and back to disable iOS safari zoom in effect
  const changeElementFont = (element, size = '') => {
    element.style.fontSize = size
  }

  // Focusing the blank plays its audio, unless the icon already did, focus came back with the
  // window, or the cooldown is on.
  const handleInputFocus = e => {
    if (!touched) {
      if (!tested) setClassName('exercise')
      setTouched(true)
      handleChange(value, word)
    }
    dispatch(setFocusedWord(word))
    if (!skipFocusSample.current && !focusTimeout && !voiceSampleOnCooldown) {
      playSample()
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

  // Measured off the input itself, so the blank is sized in the font it actually renders in.
  const inputWidth = useTextWidth(word.surface, inputRef) + 30

  const tooltip = (
    <div>
      {word.message && (
        <div className="tooltip-green">
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message.easy)} />
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
          data-cy={!answersPending && 'exercise-hearing' || 'exercise-hearing-pending'}
          readOnly={tested && !isWrong || answersPending}
          ref={inputRef}
          key={word.ID}
          onChange={handle}
          value={value}
          onFocus={handleInputFocus}
          onBlur={handleBlur}
          onMouseDown={handleMouseDown}
          className={className}
          disabled={answersPending}
          style={{
            width: inputWidth,
            minWidth: 120,
            backgroundColor: !listeningHighlighting && getWordColor(
              word.level, grade, skillLevels, show_review_diff, show_preview_exer, mode) || 'rgba(255, 152, 0, 0.71)',
            marginRight: '2px',
            height: '1.5em',
            lineHeight: 'normal',
          }}
        />
        <VolumeUpIcon
          data-cy="exercise-hearing-speaker"
          fontSize="small"
          // Keeps focus and the caret in the blank, so the click doesn't blur and re-focus it.
          onMouseDown={e => e.preventDefault()}
          onClick={speakerClickHandler}
          sx={{
            cursor: 'pointer',
            opacity: iconDisabled ? 0.45 : 1,
            marginLeft: '-25px',
            marginRight: '0.5em',
            verticalAlign: 'middle',
          }}
        />
        {word.negation && <sup style={{ marginLeft: '3px', color: '#0000FF' }}>(neg)</sup>}
      </span>
    </Tooltip>
  )
}

export default ExerciseHearing
