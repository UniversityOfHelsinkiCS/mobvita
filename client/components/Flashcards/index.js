import React, { useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views';
import { useDispatch, useSelector } from 'react-redux'
import { getFlashcards } from 'Utilities/redux/flashcardReducer'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import Flashcard from './Flashcard'

const Flashcards = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { cards, pending } = useSelector(({ flashcards }) => flashcards)

  useEffect(() => {
    dispatch(getFlashcards(learningLanguage, dictionaryLanguage))
  }, [])

  if (pending || !cards) {
    return <div>loading</div>
  }

  return (
    <SwipeableViews enableMouseEvents>
      {cards.all.map(card => <Flashcard key={card._id} card={card} />)}
    </SwipeableViews>
  )
}

export default Flashcards
