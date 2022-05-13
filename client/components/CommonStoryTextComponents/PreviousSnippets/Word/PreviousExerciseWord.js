/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react'
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
import { addExercise, removeExercise } from 'Utilities/redux/controlledPracticeReducer'
import {
  setFocusedSpan,
  setHighlightRange,
  addAnnotationCandidates,
  resetAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'
import Tooltip from 'Components/PracticeView/Tooltip'
import ExerciseCloze from 'Components/ControlledStoryEditView/CurrentSnippet/ControlExerciseWord/ExerciseCloze'

const PreviousExerciseWord = ({ word, tokenWord, answer, tiedAnswer }) => {
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
  const [showEditorTooltip, setShowEditorTooltip] = useState(false)
  const [showExericseOptions, setShowExerciseOptions] = useState(false)
  const [chosen, setChosen] = useState(false)
  const history = useHistory()
  const isPreviewMode =
    history.location.pathname.includes('preview') ||
    history.location.pathname.includes('controlled-story')
  const controlledStory = history.location.pathname.includes('controlled-story')
  const learningLanguage = useSelector(learningLanguageSelector)
  const controlledPractice = useSelector(({ controlledPractice }) => controlledPractice)
  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { spanAnnotations, highlightRange } = useSelector(({ annotations }) => annotations)
  const { id: storyId } = useParams()
  const { correctAnswerIDs } = useSelector(({ practice }) => practice)
  const [allowTranslating, setAllowTranslating] = useState(true)

  const intl = useIntl()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!controlledPractice.inProgress) {
      setChosen(false)
    }
  }, [controlledPractice?.inProgress])

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

  const handleActionClick = () => {
    if (controlledStory && word?.concepts?.length > 0 && tokenWord) {
      setShowEditorTooltip(true)
    }
  }

  const handleAddHearingExercise = () => {
    if (controlledStory && word?.concepts?.length > 0 && tokenWord) {
      const tokenizedWord = {
        ...word,
        id: word.candidate_id,
        audio: word.surface,
        listen: true,
        isWrong: false,
        mark: 'correct',
      }

      if (!chosen) {
        setChosen(true)
        dispatch(addExercise(tokenizedWord))
      } else {
        setChosen(false)
        dispatch(removeExercise(tokenizedWord))
      }
    }
    setShowEditorTooltip(false)
    setShowExerciseOptions(false)
  }

  const handleAddClozeExercise = () => {
    if (controlledStory && word?.concepts?.length > 0 && tokenWord) {
      const tokenizedWord = {
        ...word,
        id: word.candidate_id,
        isWrong: false,
        mark: 'correct',
      }

      if (!chosen) {
        setChosen(true)
        dispatch(addExercise(tokenizedWord))
      } else {
        setChosen(false)
        dispatch(removeExercise(tokenizedWord))
      }
    }
    setShowEditorTooltip(false)
    setShowExerciseOptions(false)
  }

  const handleClick = () => {
    if (word.isWrong) setShow(true)
    if (isPreviewMode && word.concepts) setShow(true)
    if (autoSpeak === 'always' && voice) speak(surface, voice, 'dictionary')
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
    setShowEditorTooltip(false)
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

  const tooltip = (
    <div className="tooltip-green" style={{ cursor: 'pointer' }} onMouseDown={handleTooltipClick}>
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

  const exerciseOptionsToolTip = (
    <div onBlur={() => setShowExerciseOptions(false)}>
      <div>
        <FormattedMessage id="choose-exercise-type" />
      </div>
      <div
        className="select-exercise"
        onClick={handleAddClozeExercise}
        onKeyDown={handleAddClozeExercise}
      >
        <FormattedMessage id="choose-cloze-exercise" />
      </div>
      <div
        className="select-preview"
        onClick={handleAddHearingExercise}
        onKeyDown={handleAddHearingExercise}
      >
        <FormattedMessage id="choose-listening-exercise" />
      </div>
    </div>
  )

  const editorTooltip = (
    <div onBlur={() => setShowEditorTooltip(false)}>
      <Tooltip
        placement="top"
        tooltipShown={showExericseOptions}
        trigger="none"
        tooltip={exerciseOptionsToolTip}
      >
        <div
          className="select-exercise"
          onClick={() => setShowExerciseOptions(true)}
          onKeyDown={() => setShowExerciseOptions(true)}
        >
          <FormattedMessage id="click-to-add-exercise" />
        </div>
      </Tooltip>
      <div className="select-preview" onClick={handleClick} onKeyDown={handleClick}>
        Show concepts attached to this word
      </div>
    </div>
  )

  if (chosen && controlledPractice) {
    return (
      <span onClick={handleAddClozeExercise} onKeyDown={handleAddClozeExercise}>
        <ExerciseCloze tabIndex={word.ID} key={word.ID} word={word} />
      </span>
    )
  }

  if (controlledPractice) {
    return (
      <Tooltip
        placement="top"
        tooltipShown={showEditorTooltip}
        trigger="none"
        tooltip={editorTooltip}
      >
        <span
          className={`${wordClass} ${wordShouldBeHighlighted(word) && 'notes-highlighted-word'}`}
          role="button"
          onClick={handleActionClick}
          onKeyDown={handleActionClick}
          tabIndex={-1}
        >
          {surface}
        </span>
      </Tooltip>
    )
  }

  return (
    <Tooltip placement="top" tooltipShown={show} trigger="none" tooltip={tooltip}>
      {wordStartsSpan(word) && <sup className="notes-superscript">{getSuperscript(word)}</sup>}
      <span
        className={`${wordClass} ${wordShouldBeHighlighted(word) && 'notes-highlighted-word'}`}
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
