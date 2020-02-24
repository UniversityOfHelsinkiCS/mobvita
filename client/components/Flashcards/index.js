import React, { useState, useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { getFlashcards, getStoryFlashcards } from 'Utilities/redux/flashcardReducer'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import Flashcard from './Flashcard'

const Flashcards = ({ match }) => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { cards, pending } = useSelector(({ flashcards }) => flashcards)
  const [swipeIndex, setSwipeIndex] = useState(0)
  const { storyId } = match.params

  useEffect(() => {
    if (storyId) {
      dispatch(getStoryFlashcards(learningLanguage, dictionaryLanguage, storyId))
    } else {
      dispatch(getFlashcards(learningLanguage, dictionaryLanguage))
    }
  }, [])

  if (pending || !cards) {
    return <div>loading</div>
  }

  const handleIndexChange = (index) => {
    setSwipeIndex(index)
  }

  return (
    <div id="flashcardsContainer">
      <button
        type="button"
        onClick={() => handleIndexChange(swipeIndex - 1)}
        disabled={swipeIndex === 0}
        className="flashcardNextPreviousButtons"
        id="flashcardPreviousButton"
        style={{ marginRight: 0 }}
      >
        <Icon name="angle double left" size="huge" />
      </button>
      <SwipeableViews index={swipeIndex} onChangeIndex={handleIndexChange} style={{ width: '30em' }}>
        {cards.all.map(card => <Flashcard key={card._id} card={card} />)}
      </SwipeableViews>
      <button
        type="button"
        onClick={() => handleIndexChange(swipeIndex + 1)}
        disabled={swipeIndex === cards.all.length - 1}
        className="flashcardNextPreviousButtons"
        id="flashcardNextButton"
      >
        <Icon name="angle double right" size="huge" />
      </button>
    </div>
  )
}

export default Flashcards
