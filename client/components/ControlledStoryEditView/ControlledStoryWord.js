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
  learningLanguageLocaleCodes,
  useMTAvailableLanguage
} from 'Utilities/common'
import { setReferences, setExplanation } from 'Utilities/redux/practiceReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { getContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import { addExercise, removeExercise } from 'Utilities/redux/controlledPracticeReducer'
import {
  setFocusedSpan,
  setHighlightRange,
  addAnnotationCandidates,
  resetAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'
import Tooltip from 'Components/PracticeView/Tooltip'
import SelectExerciseTypeModal from 'Components/ControlledStoryEditView/SelectExerciseTypeModal'
import ControlExerciseWord from 'Components/ControlledStoryEditView/CurrentSnippet/ControlExerciseWord'
import PlainWord from 'Components/CommonStoryTextComponents/PlainWord'

const ControlledStoryWord = ({ word, snippet, focusedConcept }) => {
  const {
    surface,
    isWrong,
    tested,
    wrong,
    lemmas,
    translation_lemmas,
    bases,
    ID: wordId,
    inflection_ref: inflectionRef,
    snippet_id,
    sentence_id,
  } = word
  const ref = word.hints && word.hints.filter(
    hint => hint.ref?.length).reduce((obj, v) => ({ ...obj, [v.keyword || v.easy]: v.ref}), {}) 
  const explanation = word.hints && word.hints.filter(
    hint => hint.explanation?.length || hint.meta !== hint.easy).reduce((obj, v) => ({ 
      ...obj, 
      [v.keyword || v.easy]: v.easy === v.meta && v.explanation || [v.meta, ...(v.explanation || [])]}), {})
  const [showValidationMessage, setShowValidationMessage] = useState(false)
  const [showRemoveTooltip, setShowRemoveTooltip] = useState(false)
  const [showEditorTooltip, setShowEditorTooltip] = useState(false)
  const [showExerciseOptionsModal, setShowExerciseOptionsModal] = useState(false)
  const [analyticChunkWord, setAnalyticChunkWord] = useState(null)
  const [chosen, setChosen] = useState(false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const controlledPractice = useSelector(({ controlledPractice }) => controlledPractice)
  const { resource_usage, autoSpeak } = useSelector(state => state.user.data.user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const mtLanguages = useMTAvailableLanguage()
  const { spanAnnotations, highlightRange } = useSelector(({ annotations }) => annotations)
  const { id: storyId } = useParams()
  const { correctAnswerIDs } = useSelector(({ practice }) => practice)
  const [allowTranslating, setAllowTranslating] = useState(true)
  const dispatch = useDispatch()
  const conceptHighlighting = word.concepts?.map(x=>x.concept).includes(focusedConcept) || word.analytic_concepts?.includes(focusedConcept)
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
    let wordFoundInDB = false
    let wordFoundinFE = false
    if (controlledPractice.reset && controlledPractice.frozen_snippets[word.snippet_id]) {
      wordFoundInDB = controlledPractice.frozen_snippets[word.snippet_id].find(
        frozenTokenWord => frozenTokenWord.ID === word.ID
      )
    }
    if (controlledPractice.snippets[word.snippet_id]){
      wordFoundinFE = controlledPractice.snippets[word.snippet_id].find(
        frozenTokenWord => frozenTokenWord.ID === word.ID
      )
    }
    setChosen(wordFoundInDB || wordFoundinFE)
  }, [controlledPractice.frozen_snippets, controlledPractice.reset, Object.values(controlledPractice.snippets).flat(1).length])

  const voice = voiceLanguages[learningLanguage]
  let color = ''
  if (tested || typeof wrong !== 'undefined') color = isWrong ? 'wrong-text' : 'right-text'
  if (correctAnswerIDs.includes(word.ID.toString())) color = 'right-text'
  if (word.concepts) color = 'preview-text'
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
      // setChosen(true)
      setShowExerciseOptionsModal(false)
      dispatch(addExercise(tokenizedWord))
    } else {
      // setChosen(false)
      setShowExerciseOptionsModal(false)
      dispatch(removeExercise(tokenizedWord))
    }

    setShowEditorTooltip(false)
  }

  const handleAddHearingExercise = () => {
    const { choices: removedProperty, ...wordRest } = word
    const generatedID = `custom_${storyId}_${word.ID}`

    const tokenizedWord = {
      ...wordRest,
      id: word.candidate_id || word.id || generatedID,
      audio: word.audio || word.surface,
      base: getWordBase(word),
      listen: true,
    }

    choicesMade(tokenizedWord)
  }

  const handleAddMultichoiceExercise = (choicesSet, correct_form, concept_id, feedbackList) => {
    const { audio: removedAudio, audio_wids: removedWids, alter_correct, mc_correct , ...wordRest } = word
    const generatedID = `custom_${storyId}_${word.ID}`

    if (choicesSet?.length > 1) {
      const tokenizedWord = {
        ...wordRest,
        surface: correct_form,
        id: word.candidate_id || word.id || generatedID,
        base: getWordBase(word),
        choices: choicesSet,
        concept: `concept_id: ${concept_id}`,
        custom_feedback: feedbackList,
        alter_correct: alter_correct && alter_correct[concept_id],
        mc_correct: mc_correct && mc_correct[concept_id],
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
    const { choices: removedProperty, audio: removedAudio, audio_wids: removedWids, ...wordRest } = word

    const tokenizedWord = {
      ...wordRest,
      id: word.candidate_id,
      base: getWordBase(word),
    }

    choicesMade(tokenizedWord)
  }

  const handleClick = () => {
    // if (word.isWrong) setShow(true)
    // if (isPreviewMode && word.concepts) setShow(true)
    if (autoSpeak === 'always' && voice) speak(surface, voice, 'dictionary', resource_usage)
    if (lemmas) {
      dispatch(setWords({ surface, lemmas }))

      if (allowTranslating) {
        const prefLemma = word.pref_lemma
        dispatch(
          getTranslationAction({
            learningLanguage,
            wordLemmas: translation_lemmas || lemmas,
            bases,
            dictionaryLanguage,
            storyId,
            wordId,
            inflectionRef,
            prefLemma,
          })
        )
        if (mtLanguages.includes([learningLanguage, dictionaryLanguage].join('-'))) {
          const sentence = snippet.filter(
            s => sentence_id - 1 < s.sentence_id && s.sentence_id < sentence_id + 1).map(t=>t.surface).join('').replaceAll('\n', ' ').trim()
          dispatch(
            getContextTranslation(sentence,
              learningLanguageLocaleCodes[learningLanguage],
              learningLanguageLocaleCodes[dictionaryLanguage])
          )
        }
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
    handleClick()
    setShowEditorTooltip(true)
  }

  const handleTooltipClick = () => {
    if (ref && Object.keys(ref).length) dispatch(setReferences(ref))
    if (explanation && Object.keys(explanation).length) dispatch(setExplanation(explanation))
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
          <FormattedMessage id="topics-header" />:
          <ul className="mb-0">
            {word.concepts.map(concept => (
              <li>{concept.concept}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )

  const editorTooltip = (
    <div>
      {word.concepts?.length > 0 && <div>{tooltip}</div>}
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

    const showAnalyticChunk = !exerciseWord.listen && analyticChunkWord

    return (
      <Tooltip
        placement="top"
        tooltip={removalTooltip}
        trigger="none"
        tooltipShown={showRemoveTooltip}
      >
        <span onClick={handleRemovalTooltip} onBlur={() => setShowRemoveTooltip(false)}>
          <ControlExerciseWord
            word={showAnalyticChunk ? analyticChunkWord : exerciseWord}
            handleAddClozeExercise={handleAddClozeExercise}
            exerChoices={exerciseWord.choices}
            setShowRemoveTooltip={setShowRemoveTooltip}
          />
        </span>
      </Tooltip>
    )
  }

  if (word.concepts) {
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
              className={`${wordClass}${
                wordShouldBeHighlighted(word) && ' notes-highlighted-word' || conceptHighlighting && ' concept-highlighted-word'  || ''
              }`}
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

  return (
    <span>
      <SelectExerciseTypeModal
        showExerciseOptionsModal={showExerciseOptionsModal}
        setShowExerciseOptionsModal={setShowExerciseOptionsModal}
        handleAddHearingExercise={handleAddHearingExercise}
        handleAddMultichoiceExercise={handleAddMultichoiceExercise}
        word={word}
        showValidationMessage={showValidationMessage}
        noConcepts
      />
      <span onBlur={() => setShowEditorTooltip(false)}>
        <Tooltip
          placement="top"
          tooltipShown={showEditorTooltip}
          trigger="none"
          tooltip={editorTooltip}
        >
          <span
            role="button"
            onClick={handleActionClick}
            onKeyDown={handleActionClick}
            tabIndex={-1}
          >
            <PlainWord word={word} annotatingAllowed snippet={snippet}/>
          </span>
        </Tooltip>
      </span>
    </span>
  )
}

export default ControlledStoryWord
