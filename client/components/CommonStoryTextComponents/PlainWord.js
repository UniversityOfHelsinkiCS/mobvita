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
} from 'Utilities/common'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import {
  setFocusedSpan,
  setHighlightRange,
  setAnnotationvisibilityMobile,
  addAnnotationCandidates,
  resetAnnotationCandidates,
  setAnnotationFormVisibility,
} from 'Utilities/redux/annotationsReducer'

const PlainWord = ({ word, annotatingAllowed, ...props }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const { id: storyId } = useParams()
  const [allowTranslating, setAllowTranslating] = useState(true)
  const mode = getMode()
  const { resource_usage, autoSpeak } = useSelector(state => state.user.data.user)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { spanAnnotations, highlightRange, showAnnotationForm } = useSelector(
    ({ annotations }) => annotations
  )
  const { grade } = useSelector(state => state.user.data.user)
  const { show_review_diff, show_preview_exer } = useSelector(state => state.user.data.user)

  const { lemmas, ID: wordId, surface, inflection_ref: inflectionRef, name_token: isName } = word
  const isCompeteMode = history.location.pathname.includes('compete')
  const bigScreen = width >= 1024
  const voice = voiceLanguages[learningLanguage]

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

  const wordShouldBeHighlighted = word => {
    return (
      word.ID >= highlightRange?.start &&
      word.ID <= highlightRange?.end &&
      highlightRange.start !== null
    )
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
          className={`${wordShouldBeHighlighted(word) && 'notes-highlighted-word'}`}
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
        className={`word-interactive${
          wordShouldBeHighlighted(word) ? ' notes-highlighted-word' : ''
        }`}
        {...props}
      >
        {surface}
      </span>
    </>
  )
}

export default PlainWord
