import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import {
  useTextWidth,
  speak,
  isProtectedSpeechPlaying,
  learningLanguageSelector,
  voiceLanguages,
  formatGreenFeedbackText,
  getWordColor,
  skillLevels,
  getMode
} from 'Utilities/common'
import { setFocusedWord } from 'Utilities/redux/practiceReducer'
import Tooltip from 'Components/PracticeView/Tooltip'

const ExerciseHearing = ({ word, handleChange }) => {
  const [value, setValue] = useState('')
  const [className, setClassName] = useState('exercise')
  const [touched, setTouched] = useState(false)
  const [show, setShow] = useState(false)
  const [count, setCount] = useState(0)
  const inputRef = useRef(null)
  const skipFocusSample = useRef(false)
  const leftWithWindow = useRef(false)
  const { focusedWord } = useSelector(({ practice }) => practice)
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

  // Focus landing anywhere else means the learner moved on, so a later focus here is a real visit.
  useEffect(() => {
    const onFocusElsewhere = e => {
      if (e.target !== inputRef.current) leftWithWindow.current = false
    }
    document.addEventListener('focusin', onFocusElsewhere)
    return () => document.removeEventListener('focusin', onFocusElsewhere)
  }, [])

  // Plays this blank's audio, cutting off any other; its replays alternate fast and slow.
  const playSample = () => {
    speak(word.audio, voice, 'exercise', resource_usage, count)
    setCount(count + 1)
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

  // Focusing the blank plays its audio, unless the icon already did, the browser is restoring it
  // after a tab switch, or the sentence read after a check is still playing.
  const handleInputFocus = e => {
    const restored = leftWithWindow.current
    leftWithWindow.current = false
    if (!touched) {
      if (!tested) setClassName('exercise')
      setTouched(true)
      handleChange(value, word)
    }
    dispatch(setFocusedWord(word))
    if (!restored && !skipFocusSample.current && !isProtectedSpeechPlaying()) playSample()
    setShow(!show)
    changeElementFont(e.target)
  }

  const handleMouseDown = e => {
    changeElementFont(e.target, '16px')
  }

  const handle = e => {
    setValue(e.target.value)
  }

  // Saves the answer; blurring because the whole page lost focus marks the next focus as restored.
  const handleBlur = () => {
    leftWithWindow.current = !document.hasFocus()
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
