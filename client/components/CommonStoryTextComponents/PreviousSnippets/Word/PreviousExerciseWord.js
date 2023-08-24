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
  getWordColor,
  skillLevels,
  getMode,
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

const PreviousExerciseWord = ({ word, answer, tiedAnswer, focusedConcept }) => {
  const {
    surface,
    isWrong,
    tested,
    wrong,
    lemmas,
    ref,
    explanation,
    translation_lemmas,
    ID: wordId,
    inflection_ref: inflectionRef,
  } = word

  const [show, setShow] = useState(false)
  const history = useHistory()
  const isPreviewMode = history.location.pathname.includes('preview')
  const learningLanguage = useSelector(learningLanguageSelector)
  const { resource_usage, autoSpeak, show_review_diff, show_preview_exer } = useSelector(
    state => state.user.data.user
  )
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { spanAnnotations, highlightRange } = useSelector(({ annotations }) => annotations)
  const { id: storyId } = useParams()
  const { correctAnswerIDs } = useSelector(({ practice }) => practice)
  const [allowTranslating, setAllowTranslating] = useState(true)
  const { grade } = useSelector(state => state.user.data.user)
  const mode = getMode()
  const conceptHighlighting = word.concepts?.includes(focusedConcept) || word.analytic_concepts?.includes(focusedConcept)
  const intl = useIntl()
  const dispatch = useDispatch()

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
        const prefLemma = word.pref_lemma
        dispatch(
          getTranslationAction({
            learningLanguage,
            wordLemmas: translation_lemmas || lemmas,
            dictionaryLanguage,
            storyId,
            wordId,
            inflectionRef,
            prefLemma,
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

  const checkString = hint => {
    if (explanation) {
      const explanationKey = Object.keys(explanation)[0]
      if (hint?.includes(explanationKey)) {
        return <Icon name="info circle" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
      }
    } else if (ref) {
      const refKey = Object.keys(ref)[0]
      if (hint?.includes(refKey)) {
        return <Icon name="info circle" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
      }
    }

    return null
  }

  const wordStartsSpan = word => !!word?.annotation

  const youAnsweredTooltip = answer || tiedAnswer

  const wordColorStyle = {
    backgroundColor: getWordColor(
      word.level,
      grade,
      skillLevels,
      show_review_diff,
      show_preview_exer,
      mode
    ),
  }
  // console.log('one of these? ', word)

  const tooltip = (
    <div
      className="tooltip-green"
      style={{ cursor: 'pointer', textAlign: 'left', padding: '15px' }}
      // backgroundColor: getWordColor(word.level, grade, skillLevels)
      onMouseDown={handleTooltipClick}
    >
      {/* word.message && !isPreviewMode && (
        <div className="flex">
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message)} />{' '}
          {ref && (
            <Icon name="info circle" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
          )}
          {explanation && (
            <Icon name="info circle" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
          )}
        </div>
          ) */}
      {word.hints?.length > 0 && !isPreviewMode && (
        <div>
          {word.hints.map(hint => (
            <span className="flex"><li dangerouslySetInnerHTML={formatGreenFeedbackText(hint)} />{(ref || explanation) && (
              checkString(hint)
            )}
            </span>
          ))}
        </div>
      )}
      {youAnsweredTooltip && (
        <div>
          <br />
          {`${intl.formatMessage({ id: 'you-used' })}: `}
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(youAnsweredTooltip.users_answer)}  
          style={getTextStyle(learningLanguage, 'tooltip')} />
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
        className={`${wordClass}${
          wordShouldBeHighlighted(word) && ' notes-highlighted-word' || conceptHighlighting && ' concept-highlighted-word' || ''
        }`}
        style={wordColorStyle}
        role="button"
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
