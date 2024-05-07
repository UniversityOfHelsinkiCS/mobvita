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
  getMode
} from 'Utilities/common'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import { setFocusedWord, handleVoiceSampleCooldown } from 'Utilities/redux/practiceReducer'
import { setCurrentContext } from 'Utilities/redux/chatbotReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import Tooltip from 'Components/PracticeView/Tooltip'


const ExerciseSpeaking = ({ word, handleChange }) => {
  const [recorded, setRecorded] = useState(false)
  const [className, setClassName] = useState('exercise')
  const [touched, setTouched] = useState(false)
  const [iconDisabled, setIconDisabled] = useState(false)
  const [show, setShow] = useState(false)
  const [focusTimeout, setFocusTimeout] = useState(false)
  const [count, setCount] = useState(0)
  const [lastWord, setLastWord] = useState('')
  const inputRef = createRef(null)
  const { voiceSampleOnCooldown, focusedWord } = useSelector(({ practice }) => practice)
  const { answersPending } = useSelector(({ snippets }) => snippets)
  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[`${word.ID}-${word.id}`])
  const learningLanguage = useSelector(learningLanguageSelector)
  const mode = getMode()
  const { resource_usage, show_review_diff, show_preview_exer, grade } = useSelector(state => state.user.data.user)
  const listeningHighlighting = focusedWord.audio_wids?.start <= word.ID && word.ID <= focusedWord.audio_wids?.end || word.ID === focusedWord.ID
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder
  } = useAudioRecorder({
    noiseSuppression: true,
    echoCancellation: true,
  });

  const encoder = new FileReader();
  encoder.onloadend = () => {
    console.log('Recorded')
    handleChange(encoder.result, word)
  }
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
    const val = currentAnswer ? currentAnswer.users_answer : null
    if (val && val.length > 100)  setRecorded(true)
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

  useEffect(() => {
    if(!recordingBlob) return
    console.log(recordingTime, mediaRecorder, recordingBlob.size)
    encoder.readAsDataURL(recordingBlob)
    // if (recordingTime > word.audio_wids.length * 1.5 + 1) dispatch(setNotification('Audio is too long', 'error', { autoClose: 10000 }))
    // else if (recordingTime < 0.5) dispatch(setNotification('Audio is too short', 'error', { autoClose: 10000 }))
    // // else if (!recordingBlob) dispatch(setNotification('Audio is empty', 'error', { autoClose: 10000 }))
    // else encoder.readAsDataURL(recordingBlob)
  }, [recordingBlob])

  const speakerClickHandler = word => {
    if (isRecording){
      stopRecording()
    }
    else{
      startRecording()
    }
  }

  // Font is changed to 16px and back to disable iOS safari zoom in effect
  const changeElementFont = (element, size = '') => {
    element.style.fontSize = size
  }

  const handleInputFocus = e => {
    if (!touched) {
      if (!tested) setClassName('exercise')
      setTouched(true)
      // handleChange(value, word)
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
    dispatch(setCurrentContext(''))
  }

  const handleMouseDown = e => {
    changeElementFont(e.target, '16px')
  }

  const handle = e => {
    // setValue(e.target.value)
  }

  const handleBlur = () => {
    // handleChange(value, word)
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
      {word.wrong && (
        <div className="tooltip-green">
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.wrong)} />
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
          data-cy="exercise-speaking"
          readOnly={tested && !isWrong}
          ref={inputRef}
          key={word.ID}
          onChange={handle}
          value={word.surface}
          onFocus={handleInputFocus}
          onBlur={handleBlur}
          onMouseDown={handleMouseDown}
          className={className}
          disabled={answersPending}
          style={{
            fontFamily: 'monospace',
            width: getTextWidth(word.surface, 'monospace') * 1.25 + 20,
            minWidth: getTextWidth(word.surface, 'monospace') * 1.25 + 20,
            backgroundColor: recorded && 'rgba(152, 255, 0, 0.71)' || 
              !listeningHighlighting && getWordColor(
                word.level, grade, skillLevels, show_review_diff, show_preview_exer, mode) || 'rgba(255, 152, 0, 0.71)',
            marginRight: '2px',
            height: '1.5em',
            lineHeight: 'normal',
          }}
        />
        <Icon
          name={!isRecording ? 'microphone' : 'microphone slash'}
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

export default ExerciseSpeaking
