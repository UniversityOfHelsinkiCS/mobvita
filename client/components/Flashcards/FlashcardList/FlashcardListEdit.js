import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateFlashcard } from 'Utilities/redux/flashcardReducer'
import Template from 'Components/Flashcards/Template'

const FlashcardListEdit = ({
  id,
  originalWord,
  originalHints,
  originalTranslations,
  setEditableCard,
}) => {
  const [hints, setHints] = useState(originalHints.map(h => h.hint))
  const [translations, setTranslations] = useState(originalTranslations)

  const dispatch = useDispatch()

  useEffect(() => window.scrollTo(0, 0), [])

  const getRemovedHints = () => originalHints.filter(h => !hints.includes(h.hint))
  const getNewHints = unSavedHint => {
    const newSavedHints = hints.filter(h => !originalHints.some(oh => oh.hint === h))
    return unSavedHint ? newSavedHints.concat(unSavedHint) : newSavedHints
  }

  const saveAction = unSavedHint => {
    dispatch(updateFlashcard(id, getRemovedHints(), getNewHints(unSavedHint), translations))
    setHints([])
    setTranslations([])
    setEditableCard(null)
  }

  const clearAction = () => {
    setHints([])
    setTranslations([])
    setEditableCard(null)
  }

  return (
    <Template
      word={originalWord}
      translations={translations}
      hints={hints}
      setTranslations={setTranslations}
      setHints={setHints}
      saveAction={saveAction}
      clearAction={clearAction}
      editing
    />
  )
}

export default FlashcardListEdit
