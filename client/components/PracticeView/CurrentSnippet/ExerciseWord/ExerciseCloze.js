import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getTextWidth,
  dictionaryLanguageSelector,
  rightAlignedLanguages,
  learningLanguageSelector,
  getTextStyle,
  exerciseMaskedLanguages,
  respVoiceLanguages,
  speak,
} from 'Utilities/common'
import { setFocusedWord } from 'Utilities/redux/practiceReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import Tooltip from 'Components/PracticeView/Tooltip'

const ExerciseCloze = ({ word, handleChange }) => {
  const [value, setValue] = useState('')
  const [className, setClassName] = useState('exercise cloze-untouched')
  const [touched, setTouched] = useState(false)
  const [show, setShow] = useState(false)

  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const learningLanguage = useSelector(learningLanguageSelector)
  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])

  const { isWrong, tested, surface, lemmas, ID: wordId, id: storyId } = word

  const target = useRef()
  const dispatch = useDispatch()

  const voice = respVoiceLanguages[learningLanguage]

  const handleTooltipWordClick = () => {
    const showAsSurface = exerciseMaskedLanguages.includes(learningLanguage)
      ? word.surface
      : word.base || word.bases
    const maskSymbol = exerciseMaskedLanguages.includes(learningLanguage)
      ? word.base || word.bases
      : null
    if (autoSpeak === 'always' && voice) speak(surface, voice)
    if (lemmas) {
      dispatch(setWords({ surface: showAsSurface, lemmas, maskSymbol }))
      dispatch(
        getTranslationAction({
          learningLanguage,
          wordLemmas: lemmas,
          dictionaryLanguage,
          storyId,
          wordId,
        })
      )
    }
  }

  const changeValue = e => {
    setValue(e.target.value)
  }

  const getExerciseClass = (tested, isWrong) => {
    if (!tested) return 'exercise cloze-untouched'
    if (isWrong) return 'exercise wrong cloze'
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
      {word.message && <div className="tooltip-green">{word.message}</div>}
      <div
        className="tooltip-blue"
        onMouseDown={handleTooltipWordClick}
        onClick={handleTooltipWordClick}
      >
        <span style={getTextStyle(learningLanguage, 'tooltip')}>{word.base || word.bases}</span>
        {` → ${dictionaryLanguage}`}
      </div>
    </div>
  )

  // Font is changed to 16px and back to disable iOS safari zoom in effect
  const changeElementFont = (element, size = '') => {
    element.style.fontSize = size
  }

  const handleBlur = () => {
    handleChange(value, word)
    setShow(false)
  }

  const handleFocus = e => {
    if (!touched) {
      setTouched(true)
      if (!tested) setClassName('exercise cloze-touched')
      handleChange(value, word)
    }
    setShow(!show)
    dispatch(setFocusedWord(word))
    changeElementFont(e.target)
  }

  const handleMouseDown = e => {
    changeElementFont(e.target, '16px')
  }

  const focusNextClozeOrHearing = element => {
    const { form } = element
    const nextInput = form.elements[Array.prototype.indexOf.call(form, element) + 1]
    changeElementFont(nextInput, '16px')
    nextInput.focus()
  }

  const handleKeyDown = e => {
    const isEnterPressed = e.keyCode === 13
    if (isEnterPressed) {
      focusNextClozeOrHearing(e.target)
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
        onMouseDown={handleMouseDown}
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
