import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFlashcards } from 'Utilities/redux/flashcardReducer'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import Flashcard from './Flashcard'

const Flashcards = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  useEffect(() => {
    dispatch(getFlashcards(learningLanguage, dictionaryLanguage))
  }, [])

  const word = {
    root: 'jäsä',
    translations: [
      'javascript',
    ],
  }

  return <Flashcard word={word} />
}

export default Flashcards
