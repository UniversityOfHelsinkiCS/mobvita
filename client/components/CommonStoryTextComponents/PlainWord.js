import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import useWindowDimensions from 'Utilities/windowDimensions'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  speak,
  voiceLanguages,
  getWordColor,
  skillLevels,
  getMode,
  learningLanguageLocaleCodes,
  useMTAvailableLanguage,
  hiddenFeatures
} from 'Utilities/common'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { getContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import {
  setFocusedSpan,
  setHighlightRange,
  setAnnotationvisibilityMobile,
  addAnnotationCandidates,
  resetAnnotationCandidates,
  setAnnotationFormVisibility,
} from 'Utilities/redux/annotationsReducer'

const PlainWord = ({ word, snippet, annotatingAllowed, focusedConcept, hideDifficulty, ...props }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const { id: storyId } = useParams()
  const [allowTranslating, setAllowTranslating] = useState(true)
  const mode = getMode()
  const { resource_usage, autoSpeak } = useSelector(state => state.user.data.user)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const mtLanguages = useMTAvailableLanguage()
  const { spanAnnotations, highlightRange, showAnnotationForm } = useSelector(
    ({ annotations }) => annotations
  )

  const { show_review_diff, show_preview_exer, grade } = useSelector(state => state.user.data.user)
  const { focusedWord } = useSelector(({ practice }) => practice)
  const { 
    translation_lemmas, 
    bases,
    lemmas, 
    ID: wordId, 
    surface, 
    inflection_ref: inflectionRef, 
    name_token: isName,
    sentence_id,
    snippet_id
  } = word
  const isCompeteMode = history.location.pathname.includes('compete')
  const bigScreen = width >= 1024
  const voice = voiceLanguages[learningLanguage]
  const conceptHighlighting = word.concepts?.map(x=>x.concept).includes(focusedConcept) || word.analytic_concepts?.includes(focusedConcept)
  const listeningHighlighting = focusedWord.audio_wids?.start <= wordId && wordId <= focusedWord.audio_wids?.end

  if (surface === '\n\n') {
    return (
      <div style={{ lineHeight: '50%' }}>
        <br />
      </div>
    )
  }

  const wordStartsSpan = word => !!word?.annotation

  const getSuperscript = word => {
    return spanAnnotations.findIndex(a => a.startId === word.ID) + 1
  }

  const getSpanthatIncludesWord = word => {
    return spanAnnotations.find(span => word.ID >= span.startId && word.ID <= span.endId)
  }

  const wordShouldBeHighlighted = (word, conceptHighlighting, listeningHighlighting) => {
    if (
      word.ID >= highlightRange?.start &&
      word.ID <= highlightRange?.end &&
      highlightRange.start !== null
    ) return 'notes-highlighted-word'
    else if (conceptHighlighting) return 'concept-highlighted-word'
    else if (listeningHighlighting) return 'listening-highlighted-word'
    else return ''
  }
  
  const consistsOfOnlyWhitespace = word => !!word.match(/^\s+$/g)

  const handleNonRecognizedWordClick = word => {
    if (showAnnotationForm) dispatch(setAnnotationFormVisibility(false))
    if (!bigScreen) dispatch(setAnnotationvisibilityMobile(false))
    if (annotatingAllowed && !consistsOfOnlyWhitespace(word.surface)) {
      const spanThatIncludesWord = getSpanthatIncludesWord(word)
      if (spanThatIncludesWord) {
        dispatch(setFocusedSpan(spanThatIncludesWord))
        dispatch(setHighlightRange(spanThatIncludesWord.startId, spanThatIncludesWord.endId))
      } else {
        dispatch(setFocusedSpan(null))
        dispatch(setHighlightRange(null, null))
        dispatch(resetAnnotationCandidates())
        dispatch(setHighlightRange(word.ID, word.ID))
        dispatch(addAnnotationCandidates(word))
      }
    }
  }

  if ((!lemmas || isName) & !word.level)
    return (
      <>
        {wordStartsSpan(word) && annotatingAllowed && !isCompeteMode && (
          <sup className="notes-superscript">{getSuperscript(word)}</sup>
        )}
        <span
          className={`word-interactive ${wordShouldBeHighlighted(word, conceptHighlighting, listeningHighlighting)}`}
          role={annotatingAllowed && 'button'}
          tabIndex="-1"
          onClick={() => handleNonRecognizedWordClick(word)}
          onKeyDown={() => handleNonRecognizedWordClick(word)}
          {...props}
        >
          {surface}
        </span>
      </>
    )

  const handleWordClick = () => {
    dispatch(setFocusedSpan(null))
    if (showAnnotationForm) dispatch(setAnnotationFormVisibility(false))
    if (autoSpeak === 'always' && voice) speak(surface, voice, 'dictionary', resource_usage)
    if (lemmas) {
      dispatch(setWords({ surface, lemmas }))
      if (annotatingAllowed && !consistsOfOnlyWhitespace(word.surface)) {
        const spanThatIncludesWord = getSpanthatIncludesWord(word)
        if (spanThatIncludesWord) {
          dispatch(setFocusedSpan(spanThatIncludesWord))
          dispatch(setHighlightRange(spanThatIncludesWord.startId, spanThatIncludesWord.endId))
        } else {
          dispatch(setFocusedSpan(null))
          dispatch(setHighlightRange(null, null))
          dispatch(resetAnnotationCandidates())
          dispatch(setHighlightRange(word.ID, word.ID))
          dispatch(addAnnotationCandidates(word))
        }
      }

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
        if (mtLanguages.includes([learningLanguage, dictionaryLanguage].join('-')) && snippet) {
          const sentence = snippet.filter(
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
  }

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

  return (
    <>
      {wordStartsSpan(word) && annotatingAllowed && !isCompeteMode && (
        <sup className="notes-superscript">{getSuperscript(word)}</sup>
      )}
      <span
        role="button"
        style={wordColorStyle}
        tabIndex={-1}
        onKeyDown={() => handleWordClick()}
        onClick={() => handleWordClick()}
        className={`word-interactive mobile-practice-tour-word ${
          wordShouldBeHighlighted(word, conceptHighlighting, listeningHighlighting)}` }
        {...props}
      >
        {surface}
      </span>
    </>
  )
}

export default PlainWord
