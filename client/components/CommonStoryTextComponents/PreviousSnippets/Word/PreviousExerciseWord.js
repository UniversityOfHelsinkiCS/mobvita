/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  speak,
  voiceLanguages,
  hiddenFeatures,
  getWordColor,
  skillLevels,
  getMode,
  useMTAvailableLanguage,
  learningLanguageLocaleCodes
} from 'Utilities/common'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { getContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import {
  setFocusedSpan,
  setHighlightRange,
  addAnnotationCandidates,
  resetAnnotationCandidates } from 'Utilities/redux/annotationsReducer'
import { setNotes, buildWordNotes } from 'Utilities/redux/notesReducer'
import { setHelperSidebarTab } from 'Utilities/redux/helperSidebarReducer'

const PreviousExerciseWord = ({ word, answer, tiedAnswer, focusedConcept, snippet, hideDifficulty }) => {
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
    sentence_id } = word

  if (surface === '\n\n') {
    return (
      <div style={{ lineHeight: '50%' }}>
        <br />
      </div>
    )
  }


  const location = useLocation()
  const isPreviewMode = location.pathname.includes('preview')
  const learningLanguage = useSelector(learningLanguageSelector)
  const { resource_usage, autoSpeak, show_review_diff, show_preview_exer, grade } = useSelector(
    state => state.user.data.user
  )
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const mtLanguages = useMTAvailableLanguage()
  const { spanAnnotations, highlightRange } = useSelector(({ annotations }) => annotations)
  const session_id = useSelector(({ snippets }) => snippets.focused?.session_id || snippets.session_id || snippets.sessionId)
  const { id: storyId } = useParams()
  const { correctAnswerIDs } = useSelector(({ practice }) => practice)
  const [allowTranslating, setAllowTranslating] = useState(true)
  const mode = getMode()
  const conceptHighlighting = word.concepts?.map(x=>x.concept).includes(focusedConcept) || word.analytic_concepts?.includes(focusedConcept)
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
    dispatch(setHelperSidebarTab('translation'))
    dispatch(setNotes(buildWordNotes(word, { answer, tiedAnswer, isPreviewMode, hiddenFeatures })))
    if (autoSpeak === 'always' && voice) speak(surface, voice, 'dictionary', resource_usage)
    if (lemmas) {
      dispatch(setWords({ surface, lemmas, snippet_id, sentence_id, word_id: wordId, session_id, storyid: storyId }))
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
            prefLemma })
        )
        if (mtLanguages.includes([learningLanguage, dictionaryLanguage].join('-'))) {
          const safeSnippet = Array.isArray(snippet) ? snippet : []
          const sentence = safeSnippet.filter(
            s => sentence_id - 1 <= s.sentence_id && s.sentence_id <= sentence_id + 1).map(t=>t.surface).join('').replaceAll('\n', ' ').trim()
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

  const getSuperscript = word => spanAnnotations.findIndex(a => a.startId === word.ID) + 1

  const wordShouldBeHighlighted = word => {
    return word.ID >= highlightRange?.start && word.ID <= highlightRange?.end
  }

  const wordStartsSpan = word => !!word?.annotation

  const wordColorStyle = hideDifficulty
    ? {}
    : {
        backgroundColor: getWordColor(
          word.level,
          grade,
          skillLevels,
          show_review_diff,
          show_preview_exer,
          mode
        ) }

  return (
    <>
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
      >
        {surface}
      </span>
    </>
  )
}

export default PreviousExerciseWord
