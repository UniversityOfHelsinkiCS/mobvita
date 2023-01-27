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
import {
  setFocusedWord,
  setReferences,
  setExplanation,
  incrementHintRequests,
  mcExerciseTouched,
} from 'Utilities/redux/practiceReducer'
import { decreaseEloHearts } from 'Utilities/redux/snippetsReducer'
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
  const currentAnswer = useSelector(
    ({ practice }) => practice.currentAnswers[`${word.ID}-${word.id}`]
  )
  const { attempt, focusedWord, latestMCTouched } = useSelector(({ practice }) => practice)
  // const { eloHearts } = useSelector(({ snippets }) => snippets)
  const [filteredHintsList, setFilteredHintsList] = useState([])
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
    hints,
    requested_hints,
    frozen_messages,
    hint2penalty,
  } = word

  const [eloScoreHearts, setEloScoreHearts] = useState(Array.from({length: hints ? hints.length : 0}, (_, i) => i + 1))
  const [spentHints, setSpentHints] = useState([])

  const target = useRef()
  const dispatch = useDispatch()
  const [emptyHintsList, setEmptyHintsList] = useState(false)
  const voice = voiceLanguages[learningLanguage]
  const hintButtonVisibility =
    (!hints ||
      (filteredHintsList.length < 1 && !message) ||
      (preHints.length - requested_hints?.length < filteredHintsList?.length &&
        preHints.length < 5)) &&
    !emptyHintsList
      ? { visibility: 'visible' }
      : { visibility: 'hidden' }
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

  const handleHintRequest = newHintList => {
    handleChange(value, word)
    const newRequestNum = preHints.length + 1
    const penalties = newHintList
      ?.filter(hint => hint2penalty[hint])
      .map(hint => hint2penalty[hint])
    dispatch(incrementHintRequests(`${word.ID}-${word.id}`, newRequestNum, newHintList, penalties))

    setSpentHints(spentHints.concat(1))
    setEloScoreHearts(eloScoreHearts.slice(0, -1))
  }

  const handlePreHints = () => {
    if (
      (!hints && !requested_hints) ||
      (filteredHintsList.length < 1 && requested_hints.length < 1) ||
      hints?.length < 1
    ) {
      setEmptyHintsList(true)
      handleHintRequest()
    } else {
      const newHintList = preHints.concat(
        filteredHintsList[preHints.length - requested_hints?.length]
      )
      setPreHints(newHintList)
      handleHintRequest(newHintList)
    }
    setKeepOpen(true)
  }

  const handleTooltipClick = () => {
    if (ref) {
      const requestedRefs = {}
      const refKeys = Object.keys(ref)
      for (let i = 0; i < refKeys.length; i++) {
        for (let j = 0; j < preHints.length; j++) {
          if (!requestedRefs[refKeys[i]] && preHints[j].includes(refKeys[i])) {
            requestedRefs[refKeys[i]] = ref[refKeys[i]]
          }
        }
      }
      if (Object.keys(requestedRefs).length > 0) {
        dispatch(setReferences(requestedRefs))
      }
    }

    if (explanation) {
      const requestedExplanations = {}
      const explKeys = Object.keys(explanation)

      for (let i = 0; i < explKeys.length; i++) {
        for (let j = 0; j < preHints.length; j++) {
          if (!requestedExplanations[explKeys[i]] && preHints[j].includes(explKeys[i])) {
            requestedExplanations[explKeys[i]] = explanation[explKeys[i]]
          }
        }
      }
      if (Object.keys(requestedExplanations).length > 0) {
        dispatch(setExplanation(requestedExplanations))
      }
    }
  }

  const getExerciseClass = (tested, isWrong) => {
    if (!tested) return 'exercise'
    if (isWrong) return 'exercise wrong cloze'
    return 'exercise correct'
  }
  /*
  useEffect(() => {
    if (eloHearts?.hasOwnProperty(wordId) && eloHearts[wordId] >= 0) {
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
  }, [eloHearts ? eloHearts[wordId] : eloHearts])
  */

  useEffect(() => {
    const val = currentAnswer ? currentAnswer.users_answer : ''
    setValue(val)
  }, [currentAnswer])

  useEffect(() => {
    setClassName(getExerciseClass(tested, isWrong))
  }, [tested])

  useEffect(() => {
    if (message && !hints && !requested_hints) {
      setPreHints([])
    } else if (attempt !== 0) {
      setFilteredHintsList(hints)
      setPreHints(requested_hints || [])
      // dispatch(incrementHintRequests(wordId, requested_hints?.length, filteredHintsList[preHints.length - requested_hints?.length]))
    } else {
      setFilteredHintsList(hints?.filter(hint => hint !== message))
      setPreHints(requested_hints || [])
      // dispatch(incrementHintRequests(wordId, requested_hints?.length, filteredHintsList[preHints.length - requested_hints?.length]))
    }
    /*
    if (!hints || !hints.length || message && !hints.filter(hint => hint !== message)) {
      setEmptyHintsList(true)
    }
    */
  }, [message, hints, requested_hints, attempt])

  useEffect(() => {
    if (focusedWord !== word) {
      setShow(false)
    }
  }, [focusedWord])

  useEffect(() => {
    if (latestMCTouched && latestMCTouched !== word) {
      setShow(false)
    }
  }, [latestMCTouched])

  const checkString = hint => {
    const explanationKey = Object.keys(explanation)[0]
    if (hint?.includes(explanationKey)) {
      return <Icon name="info circle" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
    }

    return null
  }

  const showRefIcon = hint => {
    if (Object.keys(ref).find(key => hint.includes(key))) {
      return true
    }

    return false
  }

  let hint_context_box = <div></div>
  if (eloScoreHearts.length + spentHints.length > 0){
    hint_context_box = <div className="tooltip-green flex space-between">
      <Button style={hintButtonVisibility} variant="primary" onMouseDown={handlePreHints}>
        <FormattedMessage id="ask-for-a-hint" />
      </Button>
      <div>
        {eloScoreHearts.map(heart => (
          <Icon size="small" name="heart" style={{ marginLeft: '0.25em' }} />
        ))}
        {spentHints.map(hint => (
          <Icon size="small" name="heart outline" style={{ marginLeft: '0.25em' }} />
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
    <div>
      {/* <div className="tooltip-green flex space-between">
        <Button style={hintButtonVisibility} variant="primary" onMouseDown={handlePreHints}>
          <FormattedMessage id="ask-for-a-hint" />
        </Button>
        <div>
          {eloScoreHearts.map(heart => (
            <Icon size="small" name="heart" style={{ marginLeft: '0.25em' }} />
          ))}
          {spentHints.map(hint => (
            <Icon size="small" name="heart outline" style={{ marginLeft: '0.25em' }} />
          ))}
        </div>
      </div> */}
      {hint_context_box} {' '}
      <div className="tooltip-hint" style={{ textAlign: 'left' }} onMouseDown={handleTooltipClick}>
        <ul>
          {frozen_messages?.map(mess => (
            <span className="flex">
              <li
                style={{ fontWeight: 'bold', fontStyle: 'italic' }}
                dangerouslySetInnerHTML={formatGreenFeedbackText(mess)}
              />
              {ref && showRefIcon(mess) && (
                <Icon
                  name="info circle"
                  style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
                />
              )}
              {explanation && checkString(mess)}
            </span>
          ))}
          {message && attempt === 0 && (
            <span className="flex">
              <li dangerouslySetInnerHTML={formatGreenFeedbackText(message)} />
              {ref && (
                <Icon
                  name="info circle"
                  style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
                />
              )}
              {explanation && (
                <Icon
                  name="info circle"
                  style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
                />
              )}
            </span>
          )}
          {preHints?.map(hint => (
            <span className="flex">
              <li dangerouslySetInnerHTML={formatGreenFeedbackText(hint)} />
              {ref && showRefIcon(hint) && (
                <Icon
                  name="info circle"
                  style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
                />
              )}
              {explanation && checkString(hint)}
            </span>
          ))}
        </ul>
      </div>
      {emptyHintsList && preHints?.length < 1 && (
        <div className="tooltip-hint" style={{ textAlign: 'left' }}>
          <FormattedMessage id="no-hints-available" />
        </div>
      )}
      <div className="tooltip-hint" style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="primary"
          onMouseDown={handleTooltipWordClick}
          onClick={handleTooltipWordClick}
        >
          <span style={getTextStyle(learningLanguage, 'tooltip')}>{word.base || word.bases} </span>
          → <FormattedMessage id={dictionaryLanguage} />
        </Button>
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
        onClick={() => dispatch(mcExerciseTouched(null))}
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
