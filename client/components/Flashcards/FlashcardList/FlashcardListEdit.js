import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateFlashcard } from 'Utilities/redux/flashcardReducer'
import Template from 'Components/Flashcards/Template'

const FlashcardListEdit = (
  { id, originalWord, originalHints, originalTranslations, setEditableCard },
) => {
  const [word, setWord] = useState(originalWord)
  const [hints, setHints] = useState(originalHints.map(h => h.hint))
  const [translations, setTranslations] = useState(originalTranslations)

  const dispatch = useDispatch()

  useEffect(() => window.scrollTo(0, 0), [])

  const getRemovedHints = () => originalHints.filter(h => !hints.includes(h.hint))
  const getNewHints = () => hints.filter(h => !originalHints.some(oh => oh.hint === h))

  const saveAction = () => {
    dispatch(updateFlashcard(id, getRemovedHints(), getNewHints(), translations))
    setWord('')
    setHints([])
    setTranslations([])
    setEditableCard(null)
  }

  const clearAction = () => {
    setWord('')
    setHints([])
    setTranslations([])
    setEditableCard(null)
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
      editing
    />
  )
}

export default FlashcardListEdit
