import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import useWindowDimensions from 'Utilities/windowDimensions'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  speak,
  respVoiceLanguages,
} from 'Utilities/common'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import {
  setFocusedSpan,
  setHighlightRange,
  setAnnotationvisibilityMobile,
  addAnnotationCandidates,
  resetAnnotationCandidates,
} from 'Utilities/redux/annotationsReducer'

const PlainWord = ({ word, annotatingAllowed, ...props }) => {
  const { lemmas, ID: wordId, surface, inflection_ref: inflectionRef, name_token: isName } = word

  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const { spanAnnotations, highlightRange } = useSelector(({ annotations }) => annotations)

  const dispatch = useDispatch()
  const { id: storyId } = useParams()
  const { width } = useWindowDimensions()
  const bigScreen = width >= 1024

  const voice = respVoiceLanguages[learningLanguage]

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

  if (!lemmas || isName)
    return (
      <>
        {wordStartsSpan(word) && annotatingAllowed && (
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
    if (autoSpeak === 'always' && voice) speak(surface, voice)
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
    }
  }

  return (
    <>
      {wordStartsSpan(word) && annotatingAllowed && (
        <sup className="notes-superscript">{getSuperscript(word)}</sup>
      )}
      <span
        role="button"
        tabIndex={-1}
        onKeyDown={() => handleWordClick()}
        onClick={() => handleWordClick()}
        className={`word-interactive ${wordShouldBeHighlighted(word) && 'notes-highlighted-word'}`}
        {...props}
      >
        {surface}
      </span>
    </>
  )
}

export default PlainWord
