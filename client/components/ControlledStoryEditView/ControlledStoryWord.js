/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  speak,
  voiceLanguages,
  hiddenFeatures,
} from 'Utilities/common'
import { setReferences, setExplanation } from 'Utilities/redux/practiceReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import {
  addExercise,
  removeExercise,
} from 'Utilities/redux/controlledPracticeReducer'
import {
  setFocusedSpan,
  setHighlightRange,
  addAnnotationCandidates,
  resetAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'
import Tooltip from 'Components/PracticeView/Tooltip'
import SelectExerciseTypeModal from 'Components/ControlledStoryEditView/SelectExerciseTypeModal'
import ControlExerciseWord from 'Components/ControlledStoryEditView/CurrentSnippet/ControlExerciseWord'

const ControlledStoryWord = ({ word, snippet }) => {
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

  const [showValidationMessage, setShowValidationMessage] = useState(false)
  const [showRemoveTooltip, setShowRemoveTooltip] = useState(false)
  const [showEditorTooltip, setShowEditorTooltip] = useState(false)
  const [showExerciseOptionsModal, setShowExerciseOptionsModal] = useState(false)
  const [analyticChunkWord, setAnalyticChunkWord] = useState(null)
  const [chosen, setChosen] = useState(false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const controlledPractice = useSelector(({ controlledPractice }) => controlledPractice)
  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { spanAnnotations, highlightRange } = useSelector(({ annotations }) => annotations)
  const { id: storyId } = useParams()
  const { correctAnswerIDs } = useSelector(({ practice }) => practice)
  const [allowTranslating, setAllowTranslating] = useState(true)

  const dispatch = useDispatch()

  useEffect(() => {
    if (word.analytic && word.is_head) {
      const intersection = snippet.filter(wordInSnippet =>
        word.cand_index.includes(wordInSnippet.ID)
      )

      if (intersection) {
        intersection.sort((a, b) => a.ID - b.ID)
        let concatChunk = ''
        for (let i = 0; i < intersection.length; i++) {
          concatChunk += `${intersection[i].surface} `
        }

        const updatedWord = {
          ...word,
          surface: concatChunk,
        }
        setAnalyticChunkWord(updatedWord)
      }
    }
  }, [])

  useEffect(() => {
    if (!controlledPractice.inProgress && !controlledPractice.finished) {
      setChosen(false)
    }
  }, [controlledPractice?.inProgress])



  useEffect(() => {
    if (controlledPractice.reset && controlledPractice.frozen_snippets[word.snippet_id]) {
      const wordFound = controlledPractice.frozen_snippets[word.snippet_id].find(
        frozenTokenWord => frozenTokenWord.ID === word.ID
      )
      if (wordFound) {
        setChosen(true)
      }
    }
  }, [controlledPractice.frozen_snippets, controlledPractice.reset])

  const voice = voiceLanguages[learningLanguage]
  let color = ''
  if (tested || typeof wrong !== 'undefined') color = isWrong ? 'wrong-text' : 'right-text'
  if (correctAnswerIDs.includes(word.ID.toString())) color = 'right-text'
  if (word.concepts || word.id) color = 'preview-text'
  if (hiddenFeatures && word.concepts?.length === 0) color = 'preview-text-no-concepts'
  const wordClass = `word-interactive ${color}`

  const wordIsInSpan = word => {
    return spanAnnotations.some(span => word.ID >= span.startId && word.ID <= span.endId)
  }

  const handleRemovalTooltip = () => {
    setShowRemoveTooltip(!showRemoveTooltip)
  }

  const getWordBase = word => {
    const splitBases = word.bases.split('|')
    const splitConcatenations = splitBases[0].split('+')
    return splitConcatenations[0]
  }

  const choicesMade = tokenizedWord => {
    if (!chosen) {
      setChosen(true)
      setShowExerciseOptionsModal(false)
      dispatch(addExercise(tokenizedWord))
    } else {
      setChosen(false)
      setShowExerciseOptionsModal(false)
      dispatch(removeExercise(tokenizedWord))
    }

    setShowEditorTooltip(false)
  }

  const handleAddHearingExercise = () => {
    if (word?.concepts?.length > 0) {
      const { choices: removedProperty, ...wordRest } = word

      const tokenizedWord = {
        ...wordRest,
        id: word.candidate_id,
        audio: word.audio || word.surface,
        base: getWordBase(word),
        listen: true,
      }

      choicesMade(tokenizedWord)
    }
  }

  const handleAddMultichoiceExercise = (choicesSet, correct_form) => {
    const { audio: removedAudio, ...wordRest } = word

    if (choicesSet?.length > 1) {
      const tokenizedWord = {
        ...wordRest,
        surface: correct_form,
        id: word.candidate_id,
        base: getWordBase(word),
        choices: choicesSet,
      }

      choicesMade(tokenizedWord)
    } else {
      setShowValidationMessage(true)
      setTimeout(() => {
        setShowValidationMessage(false)
      }, 5000)
    }
  }

  const handleAddClozeExercise = () => {
    if (word?.concepts?.length > 0) {
      const { choices: removedProperty, audio: removedAudio, ...wordRest } = word

      const tokenizedWord = {
        ...wordRest,
        id: word.candidate_id,
        base: getWordBase(word),
      }

      choicesMade(tokenizedWord)
    }
  }

  const handleClick = () => {
    // if (word.isWrong) setShow(true)
    // if (isPreviewMode && word.concepts) setShow(true)
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
  }

  const handleExerciseOptionsModal = () => {
    setShowExerciseOptionsModal(true)
    setShowEditorTooltip(false)
  }

  const handleActionClick = () => {
    if (word?.concepts?.length > 0) {
      handleClick()
      setShowEditorTooltip(true)
    }
  }

  const handleTooltipClick = () => {
    if (ref) dispatch(setReferences(ref))
    if (explanation) dispatch(setExplanation(explanation))
  }

  const wordShouldBeHighlighted = word => {
    return word.ID >= highlightRange?.start && word.ID <= highlightRange?.end
  }

  const tooltip = (
    <div className="tooltip-green" style={{ cursor: 'pointer' }} onMouseDown={handleTooltipClick}>
      {word.concepts?.length === 0 && hiddenFeatures && (
        <div style={{ textAlign: 'left' }}>
          <FormattedMessage id="no-topics-available" />
        </div>
      )}

      {word.concepts?.length > 0 && (
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

  const editorTooltip = (
    <div>
      <div>{tooltip}</div>
      <div
        style={{ cursor: 'pointer', margin: '0.5em' }}
        className="select-exercise"
        onClick={handleExerciseOptionsModal}
        onKeyDown={handleExerciseOptionsModal}
        onMouseDown={handleExerciseOptionsModal}
      >
        <FormattedMessage id="click-to-add-exercise" />
      </div>
    </div>
  )

  const removalTooltip = (
    <div style={{ cursor: 'pointer', margin: '0.5em' }} onMouseDown={handleAddClozeExercise}>
      <FormattedMessage id="click-to-remove-exercise" />
    </div>
  )

  if (chosen) {
    const exerciseWord = controlledPractice.snippets[word.snippet_id].find(
      tokenizedWord => tokenizedWord.ID === word.ID
    )

    if (!exerciseWord) {
      return null
    }

    return (
      <Tooltip
        placement="top"
        tooltip={removalTooltip}
        trigger="none"
        tooltipShown={showRemoveTooltip}
      >
        <span onClick={handleRemovalTooltip} onBlur={() => setShowRemoveTooltip(false)}>
          <ControlExerciseWord
            word={analyticChunkWord ? analyticChunkWord : exerciseWord}
            handleAddClozeExercise={handleAddClozeExercise}
            exerChoices={exerciseWord.choices}
            setShowRemoveTooltip={setShowRemoveTooltip}
          />
        </span>
      </Tooltip>
    )
  }

  return (
    <span>
      <SelectExerciseTypeModal
        showExerciseOptionsModal={showExerciseOptionsModal}
        setShowExerciseOptionsModal={setShowExerciseOptionsModal}
        handleAddClozeExercise={handleAddClozeExercise}
        handleAddHearingExercise={handleAddHearingExercise}
        handleAddMultichoiceExercise={handleAddMultichoiceExercise}
        word={word}
        analyticChunkWord={analyticChunkWord}
        showValidationMessage={showValidationMessage}
      />
      <span onBlur={() => setShowEditorTooltip(false)}>
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
      </span>
    </span>
  )
}

export default ControlledStoryWord
