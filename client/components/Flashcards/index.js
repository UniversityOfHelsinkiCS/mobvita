import React, { useState, useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { useDispatch, useSelector } from 'react-redux'
import { getFlashcards } from 'Utilities/redux/flashcardReducer'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import Flashcard from './Flashcard'

const Flashcards = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { cards, pending } = useSelector(({ flashcards }) => flashcards)
  const [swipeIndex, setSwipeIndex] = useState(0)

  useEffect(() => {
    dispatch(getFlashcards(learningLanguage, dictionaryLanguage))
  }, [])

  if (pending || !cards) {
    return <div>loading</div>
  }

  const handleIndexChange = (index) => {
    setSwipeIndex(index)
  }

  return (
    <>
      <SwipeableViews index={swipeIndex} onChangeIndex={handleIndexChange}>
        {cards.all.map(card => <Flashcard key={card._id} card={card} />)}
      </SwipeableViews>
      <button
        type="button"
        onClick={() => handleIndexChange(swipeIndex - 1)}
        disabled={swipeIndex === 0}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={() => handleIndexChange(swipeIndex + 1)}
        disabled={swipeIndex === cards.all.length - 1}
      >
        Next
      </button>
    </>
  )
}

export default Flashcards
