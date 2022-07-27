import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import { createFlashcard } from 'Utilities/redux/flashcardReducer'
import { getTranslationAction, clearTranslationAction } from 'Utilities/redux/translationReducer'
import Template from './Template'

const FlashcardCreation = () => {
  const [word, setWord] = useState('')
  const [hints, setHints] = useState([])

  const { glosses, pending } = useSelector(({ translation }) => {
    const glosses = translation.data && translation.data[0] && translation.data[0].glosses
    const { pending } = translation
    return { glosses, pending }
  }, shallowEqual)
  const [translations, setTranslations] = useState([])

  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const dispatch = useDispatch()

  const wordRef = useRef()

  useEffect(() => {
    if (glosses) {
      setTranslations(glosses)
    } else {
      setTranslations([])
    }
  }, [glosses])

  useEffect(() => () => dispatch(clearTranslationAction()), [])

  const getTranslations = () => {
    dispatch(clearTranslationAction())
    if (word) {
      const prefLemma = word.pref_lemma
      dispatch(
        getTranslationAction({ learningLanguage, wordLemmas: word, dictionaryLanguage, prefLemma })
      )
    }
  }

  const saveAction = hint => {
    const cardObject = {
      word,
      glosses: translations,
      hints: hint ? hints.concat(hint) : hints,
    }
    dispatch(createFlashcard(learningLanguage, dictionaryLanguage, cardObject))
    setWord('')
    setHints([])
    setTranslations([])
    wordRef.current.focus()
  }

  const clearAction = () => {
    setWord('')
    setHints([])
    setTranslations([])
  }

  return (
    <Template
      word={word}
      translations={translations}
      hints={hints}
      setWord={setWord}
      setTranslations={setTranslations}
      setHints={setHints}
      saveAction={saveAction}
      clearAction={clearAction}
      getTranslations={getTranslations}
      pending={pending}
      wordRef={wordRef}
    />
  )
}

export default FlashcardCreation
