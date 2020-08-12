import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { learningLanguageSelector, dictionaryLanguageSelector, capitalize } from 'Utilities/common'
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
      dispatch(
        getTranslationAction(capitalize(learningLanguage), word, capitalize(dictionaryLanguage))
      )
    }
  }

  const saveAction = () => {
    const cardObject = {
      word,
      glosses: translations,
      hints,
    }
    dispatch(createFlashcard(learningLanguage, dictionaryLanguage, cardObject))
    setWord('')
    setHints([])
    setTranslations([])
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
    />
  )
}

export default FlashcardCreation
