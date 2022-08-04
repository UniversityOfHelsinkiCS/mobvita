import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  getTextWidth,
  dictionaryLanguageSelector,
  rightAlignedLanguages,
  learningLanguageSelector,
  getTextStyle,
  exerciseMaskedLanguages,
  voiceLanguages,
  speak,
  formatGreenFeedbackText,
  getWordColor,
  skillLevels,
} from 'Utilities/common'
import { setFocusedWord, setReferences, setExplanation } from 'Utilities/redux/practiceReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import Tooltip from 'Components/PracticeView/Tooltip'

const ExerciseCloze = ({ word, handleChange }) => {
  const [value, setValue] = useState('')
  const [className, setClassName] = useState('exercise')
  const [touched, setTouched] = useState(false)
  const [show, setShow] = useState(false)
  const { grade } = useSelector(state => state.user.data.user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { resource_usage, autoSpeak } = useSelector(state => state.user.data.user)
  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])
  const [preHints, setPreHints] = useState([])
  const [keepOpen, setKeepOpen] = useState(false)
  const {
    isWrong,
    tested,
    surface,
    ref,
    explanation,
    lemmas,
    ID: wordId,
    id: storyId,
    message,
  } = word

  const target = useRef()
  const dispatch = useDispatch()

  const voice = voiceLanguages[learningLanguage]

  const handleTooltipWordClick = () => {
    const showAsSurface = exerciseMaskedLanguages.includes(learningLanguage)
      ? word.surface
      : word.base || word.bases
    const maskSymbol = exerciseMaskedLanguages.includes(learningLanguage)
      ? word.base || word.bases
      : null
    if (autoSpeak === 'always' && voice) speak(surface, voice, 'dictionary', resource_usage)
    if (lemmas) {
      const prefLemma = word.pref_lemma
      dispatch(setWords({ surface: showAsSurface, lemmas, maskSymbol }))
      dispatch(
        getTranslationAction({
          learningLanguage,
          wordLemmas: lemmas,
          dictionaryLanguage,
          storyId,
          wordId,
          prefLemma,
        })
      )
    }
  }

  const changeValue = e => {
    setValue(e.target.value)
  }

  const handlePreHints = () => {
    setPreHints(preHints.concat(word.hints[preHints.length]))
    setKeepOpen(true)
  }

  const handleTooltipClick = () => {
    if (ref) dispatch(setReferences(ref))
    if (explanation) dispatch(setExplanation(explanation))
  }

  const getExerciseClass = (tested, isWrong) => {
    if (!tested) return 'exercise'
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

  useEffect(() => {
    if (message) {
      setPreHints([])
    }
  }, [message])

  const tooltip = (
    <div>
      {word.message && !word.hints && (
        <div
          className="tooltip-green"
          style={{ cursor: 'pointer' }}
          // style={{ cursor: 'pointer', background: getWordColor(word.level, grade, skillLevels) }}
          onMouseDown={handleTooltipClick}
        >
          {word.message && (
            <div className="flex">
              <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message)} />{' '}
              {ref && (
                <Icon name="external" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
              )}
              {explanation && (
                <Icon
                  name="info circle"
                  style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
                />
              )}
            </div>
          )}
        </div>
      )}{' '}
      {word.hints?.length > 0 && preHints.length < word.hints?.length && (
        <div className="tooltip-green" style={{ cursor: 'pointer' }} onMouseDown={handlePreHints}>
          <FormattedMessage id="ask-for-a-hint" />
        </div>
      )}{' '}
      {preHints?.length > 0 && (
        <div className="tooltip-hint" style={{ textAlign: 'left' }}>
          {preHints.map(hint => (
            <li dangerouslySetInnerHTML={formatGreenFeedbackText(hint)} />
          ))}
          {ref && (
            <Icon name="external" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
          )}
          {explanation && (
            <Icon name="info circle" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
          )}
        </div>
      )}
      <div
        className="tooltip-blue"
        // style={{ backgroundColor: getWordColor(word.level, grade, skillLevels) }}
        onMouseDown={handleTooltipWordClick}
        onClick={handleTooltipWordClick}
      >
        <span style={getTextStyle(learningLanguage, 'tooltip')}>{word.base || word.bases}</span>
        → <FormattedMessage id={dictionaryLanguage} />
      </div>
    </div>
  )

  // Font is changed to 16px and back to disable iOS safari zoom in effect
  const changeElementFont = (element, size = '') => {
    element.style.fontSize = size
  }

  const handleBlur = () => {
    handleChange(value, word)

    if (!keepOpen) {
      setShow(false)
    }
    setKeepOpen(false)
  }

  const handleFocus = e => {
    if (!touched) {
      setTouched(true)
      if (!tested) setClassName('exercise')
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
          backgroundColor: getWordColor(word.level, grade, skillLevels),
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
