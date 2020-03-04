import React, { useState, useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import { getFlashcards } from 'Utilities/redux/flashcardReducer'
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
    dispatch(getFlashcards(learningLanguage, dictionaryLanguage, storyId))
  }, [])

  if (pending || !cards) {
    return (
      <div
        style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  const handleIndexChange = (index) => {
    setSwipeIndex(index)
  }

  const cardIndex = `${swipeIndex + 1} / ${cards.length}`

  return (
    <div className="component-container">
      <div className="flashcard-container">
        <button
          type="button"
          onClick={() => handleIndexChange(swipeIndex - 1)}
          disabled={swipeIndex === 0}
          className="flashcard-arrow-button"
          style={{ marginRight: 0 }}
        >
          <Icon name="angle double left" size="huge" />
        </button>
        <SwipeableViews
          index={swipeIndex}
          onChangeIndex={handleIndexChange}
          style={{ width: '30em' }}
        >
          {cards.map(card => (
            <Flashcard
              key={card._id}
              card={card}
              cardIndex={cardIndex}
              setSwipeIndex={setSwipeIndex}
            />
          ))}
        </SwipeableViews>
        <button
          type="button"
          onClick={() => handleIndexChange(swipeIndex + 1)}
          disabled={swipeIndex === cards.length - 1}
          className="flashcard-arrow-button"
          style={{ marginLeft: 0 }}
        >
          <Icon name="angle double right" size="huge" />
        </button>

      </div>
    </div>
  )
}

export default Flashcards
