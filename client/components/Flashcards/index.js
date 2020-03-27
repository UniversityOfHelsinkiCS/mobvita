import React, { useState, useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { virtualize } from 'react-swipeable-views-utils';
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import { getFlashcards } from 'Utilities/redux/flashcardReducer'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import Flashcard from './Flashcard'
import FlashcardEndView from './FlashcardEndView'
import FlashcardNoCards from './FlashCardNoCards'

const VirtualizeSwipeableViews = virtualize(SwipeableViews)

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
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  const handleIndexChange = (index) => {
    setSwipeIndex(index)
  }

  const handleNewDeck = () => {
    setSwipeIndex(0)
    dispatch(getFlashcards(learningLanguage, dictionaryLanguage, storyId))
  }

  const cardIndex = `${swipeIndex + 1} / ${cards.length}`

  const slideRenderer = ({ key, index }) => {
    if (cards[0].format === 'no-cards') {
      return (
        <FlashcardNoCards setSwipeIndex={setSwipeIndex} />
      )
    }
    if (index < cards.length) {
      return (
        <Flashcard
          key={key}
          card={cards[index]}
          cardIndex={cardIndex}
          setSwipeIndex={setSwipeIndex}
        />
      )
    }
    if (cards.length > 1) {
      return (
        <FlashcardEndView handleNewDeck={handleNewDeck} />
      )
    }
  }

  return (
    <div className="component-container">
      <div className="flashcard-container">
        <VirtualizeSwipeableViews
          index={swipeIndex}
          onChangeIndex={handleIndexChange}
          style={{ width: '30em', marginLeft: 'auto' }}
          slideRenderer={slideRenderer}
          overscanSlideAfter={1}
          overscanSlideBefore={0}
        />
        <button
          type="button"
          onClick={() => handleIndexChange(swipeIndex + 1)}
          disabled={swipeIndex === cards.length || cards[0].format === 'no-cards'}
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
