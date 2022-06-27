/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import {
  getTextStyle,
  learningLanguageSelector,
  dictionaryLanguageSelector,
  speak,
  voiceLanguages,
  formatGreenFeedbackText,
  hiddenFeatures,
} from 'Utilities/common'
import { setReferences, setExplanation } from 'Utilities/redux/practiceReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import {
  setFocusedSpan,
  setHighlightRange,
  addAnnotationCandidates,
  resetAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'
import Tooltip from 'Components/PracticeView/Tooltip'

const PreviousExerciseWord = ({ word, answer, tiedAnswer }) => {
  const {
    surface,
    isWrong,
    tested,
    wrong,
    lemmas,
    ref,
    explanation,
    ID: wordId,
    inflection_ref: inflectionRef,
  } = word

  const [show, setShow] = useState(false)
  const history = useHistory()
  const isPreviewMode = history.location.pathname.includes('preview')
  const learningLanguage = useSelector(learningLanguageSelector)
  const { resource_usage, autoSpeak } = useSelector(state => state.user.data.user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { spanAnnotations, highlightRange } = useSelector(({ annotations }) => annotations)
  const { id: storyId } = useParams()
  const { correctAnswerIDs } = useSelector(({ practice }) => practice)
  const [allowTranslating, setAllowTranslating] = useState(true)
  const { grade } = useSelector(state => state.user.data.user)

  const intl = useIntl()
  const dispatch = useDispatch()
  const skillLevels = [
    'A1',
    'A1/A2',
    'A2',
    'A2/B1',
    'B1',
    'B1/B2',
    'B2',
    'B2/C1',
    'C1',
    'C1/C2',
    'C2',
  ]

  const voice = voiceLanguages[learningLanguage]
  let color = ''
  if (tested || typeof wrong !== 'undefined') color = isWrong ? 'wrong-text' : 'right-text'
  if (correctAnswerIDs.includes(word.ID.toString())) color = 'right-text'
  if (isPreviewMode && (word.concepts || word.id)) color = 'preview-text'
  if (isPreviewMode && hiddenFeatures && word.concepts?.length === 0)
    color = 'preview-text-no-concepts'
  const wordClass = `word-interactive ${color}`

  const wordIsInSpan = word => {
    return spanAnnotations.some(span => word.ID >= span.startId && word.ID <= span.endId)
  }

  const handleClick = () => {
    if (word.isWrong) setShow(true)
    if (isPreviewMode && word.concepts) setShow(true)
    if (autoSpeak === 'always' && voice) speak(surface, voice, 'dictionary', resource_usage)
    if (lemmas) {
      dispatch(setWords({ surface, lemmas }))

      if (allowTranslating) {
        dispatch(
          getTranslationAction({
            learningLanguage,
            wordLemmas: lemmas,
            dictionaryLanguage,
            storyId,
            wordId,
            inflectionRef,
          })
        )

        setAllowTranslating(false)
        setTimeout(() => {
          setAllowTranslating(true)
        }, 1000)
      }
    }

    if (wordIsInSpan(word)) {
      const span = spanAnnotations.find(a => word.ID >= a.startId && word.ID <= a.endId)
      dispatch(setFocusedSpan(span))
      dispatch(setHighlightRange(span.startId, span.endId))
    } else {
      dispatch(setFocusedSpan(null))
      dispatch(resetAnnotationCandidates())
      dispatch(setHighlightRange(null, null))
      dispatch(setHighlightRange(word.ID, word.ID))
      dispatch(addAnnotationCandidates(word))
    }
  }

  const getSuperscript = word => spanAnnotations.findIndex(a => a.startId === word.ID) + 1

  const handleTooltipClick = () => {
    if (ref) dispatch(setReferences(ref))
    if (explanation) dispatch(setExplanation(explanation))
  }

  const wordShouldBeHighlighted = word => {
    return word.ID >= highlightRange?.start && word.ID <= highlightRange?.end
  }

  const wordStartsSpan = word => !!word?.annotation

  const youAnsweredTooltip = answer || tiedAnswer

  const getDifficultyColor = () => {
    if (!word.level || !grade) {
      return 'tooltip-green'
    }
    const wordDifficulty = skillLevels.findIndex(level => {
      return level === word.level
    })
    const userGrade = skillLevels.findIndex(level => {
      return level === grade
    })

    const difference = wordDifficulty - userGrade

    if (difference < -3) {
      return 'tooltip-green'
    }
    if (difference < -2) {
      return 'tooltip-greenish'
    }
    if (difference < 2) {
      return 'tooltip-yellow'
    }
    if (difference < 3) {
      return 'tooltip-orange'
    }

    return 'tooltip-red'
  }

  // coloring difficulty
  function getRgb(color) {
    const [r, g, b] = color
      .replace('rgb(', '')
      .replace(')', '')
      .split(',')
      .map(str => Number(str))
    return { r, g, b }
  }

  function colorInterpolate(colorA, colorB, intval) {
    const rgbA = getRgb(colorA)
    const rgbB = getRgb(colorB)
    const colorVal = prop => Math.round(rgbA[prop] * (1 - intval) + rgbB[prop] * intval)
    return {
      r: colorVal('r'),
      g: colorVal('g'),
      b: colorVal('b'),
    }
  }

  function ColorToHex(color) {
    const hexadecimal = color.toString(16)
    return hexadecimal.length == 1 ? `0${hexadecimal}` : hexadecimal
  }

  function ConvertRGBtoHex(red, green, blue) {
    return `#${ColorToHex(red)}${ColorToHex(green)}${ColorToHex(blue)}`
  }

  function getWordColor(word_level, user_grade) {
    if (!word.level || !grade) {
      return '#FFFFFF' // white background
    }
    const wordDifficulty = skillLevels.findIndex(level => {
      return level === word_level
    })
    const userGrade = skillLevels.findIndex(level => {
      return level === user_grade
    })
    const difference = userGrade - wordDifficulty
    const difference_intval = Math.abs(difference) / skillLevels.length

    const rgbMin = 'rgb(255, 255, 255)'
    let rgbMax = 'rgb(255, 255, 255)'
    if (difference <= 0) rgbMax = 'rgb(252, 108, 133)'
    // '#90ef90',
    else rgbMax = 'rgb(144, 239, 144)' // '#fc6c85',

    // (difference + skillLevels.length) / (2*skillLevels.length)
    const word_rgb = colorInterpolate(rgbMin, rgbMax, difference_intval)
    console.log(difference, word_rgb)
    return ConvertRGBtoHex(word_rgb.r, word_rgb.g, word_rgb.b)
  }

  const wordColorStyle = {
    backgroundColor: getWordColor(word.level, grade),
  }

  const tooltip = (
    <div
      className="tooltip-diff"
      style={{ cursor: 'pointer', backgroundColor: getWordColor(word.level, grade) }}
      onMouseDown={handleTooltipClick}
    >
      {word.message && !isPreviewMode && (
        <div className="flex">
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message)} />{' '}
          {ref && (
            <Icon name="external" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
          )}
          {explanation && (
            <Icon name="info circle" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
          )}
        </div>
      )}
      {youAnsweredTooltip && (
        <div>
          {`${intl.formatMessage({ id: 'you-used' })}: `}
          <span style={getTextStyle(learningLanguage, 'tooltip')}>
            {youAnsweredTooltip.users_answer}
          </span>
        </div>
      )}
      {isPreviewMode && word.concepts?.length === 0 && hiddenFeatures && (
        <div style={{ textAlign: 'left' }}>
          <FormattedMessage id="no-topics-available" />
        </div>
      )}

      {isPreviewMode && word.concepts?.length > 0 && (
        <div style={{ textAlign: 'left' }}>
          <FormattedMessage id="topics" />:
          <ul className="mb-0">
            {word.concepts.map(concept => (
              <li>{concept}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )

  return (
    <Tooltip placement="top" tooltipShown={show} trigger="none" tooltip={tooltip}>
      {wordStartsSpan(word) && <sup className="notes-superscript">{getSuperscript(word)}</sup>}
      <span
        className={`${wordClass} ${wordShouldBeHighlighted(word) && 'notes-highlighted-word'}`}
        style={wordColorStyle}
        role="button"
        // style={'fill: blue;'}
        onClick={handleClick}
        onKeyDown={handleClick}
        tabIndex={-1}
        onBlur={() => setShow(false)}
      >
        {surface}
      </span>
    </Tooltip>
  )
}

export default PreviousExerciseWord
