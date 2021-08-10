import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  speak,
  respVoiceLanguages,
} from 'Utilities/common'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { setFocusedWord, setHighlightedWord } from 'Utilities/redux/annotationsReducer'

const PlainWord = ({ word, annotatingAllowed, ...props }) => {
  const { lemmas, ID: wordId, surface, inflection_ref: inflectionRef, name_token: isName } = word

  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const { highlightedWord, annotations } = useSelector(({ annotations }) => annotations)

  const dispatch = useDispatch()
  const { id: storyId } = useParams()

  const getSuperscript = word => {
    const existingAnnotations = annotations.filter(word =>
      word.annotation.every(annotation => annotation.annotation !== '<removed>')
    )
    return existingAnnotations.findIndex(a => a.ID === word.ID) + 1
  }

  const voice = respVoiceLanguages[learningLanguage]

  if (surface === '\n\n') {
    return (
      <div style={{ lineHeight: '50%' }}>
        <br />
      </div>
    )
  }

  const wordHasAnnotations = word => {
    const matchingAnnotationInStore = annotations.find(w => w.ID === word.ID)
    const allAreRemoved = matchingAnnotationInStore?.annotation?.every(
      annotation => annotation.annotation === '<removed>'
    )
    if (!matchingAnnotationInStore || allAreRemoved) return false

    return true
  }

  const consistsOfOnlyWhitespace = word => !!word.match(/^\s+$/g)

  const handleNonRecognizedWordclick = word => {
    if (annotatingAllowed && !consistsOfOnlyWhitespace(word.surface)) {
      dispatch(setHighlightedWord(word))
      const annotationInStore = annotations.find(w => w.ID === word.ID)

      if (annotationInStore) dispatch(setFocusedWord(annotationInStore))
      else dispatch(setFocusedWord(word))
    }
  }

  if (!lemmas || isName)
    return (
      <>
        <span
          className={`${word.ID === highlightedWord?.ID && 'notes-highlighted-word'}`}
          role={annotatingAllowed && 'button'}
          tabIndex="-1"
          onClick={() => handleNonRecognizedWordclick(word)}
          onKeyDown={() => handleNonRecognizedWordclick(word)}
          {...props}
        >
          {surface}
        </span>
        {wordHasAnnotations(word) && (
          <sup className="notes-superscript">{getSuperscript(word)}</sup>
        )}
      </>
    )

  const handleWordClick = () => {
    if (autoSpeak === 'always' && voice) speak(surface, voice)
    if (lemmas) {
      dispatch(setWords({ surface, lemmas }))
      if (annotatingAllowed) {
        dispatch(setHighlightedWord(word))
        const annotationInStore = annotations.find(w => w.ID === word.ID)

        if (annotationInStore) dispatch(setFocusedWord(annotationInStore))
        else dispatch(setFocusedWord(word))
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
      <span
        role="button"
        tabIndex={-1}
        onKeyDown={() => handleWordClick()}
        onClick={() => handleWordClick()}
        className={`word-interactive${
          word.ID === highlightedWord?.ID ? ' notes-highlighted-word' : ''
        }`}
        {...props}
      >
        {surface}
      </span>
      {wordHasAnnotations(word) && <sup className="notes-superscript">{getSuperscript(word)}</sup>}
    </>
  )
}

export default PlainWord
