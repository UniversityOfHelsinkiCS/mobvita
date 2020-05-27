import React, { useState, useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { virtualize, bindKeyboard } from 'react-swipeable-views-utils'
import flowRight from 'lodash/flowRight'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { getFlashcards, recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'
import { getSelf } from 'Utilities/redux/userReducer'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import useWindowDimension from 'Utilities/windowDimensions'
import Spinner from 'Components/Spinner'
import FlashcardEndView from './FlashcardEndView'
import FlashcardNoCards from './FlashCardNoCards'
import Fillin from './Fillin'
import Article from './Article'

const VirtualizeSwipeableViews = flowRight(
  bindKeyboard,
  virtualize,
)(SwipeableViews)

const Practice = ({ mode }) => {
  const [swipeIndex, setSwipeIndex] = useState(0)
  const [editing, setEditing] = useState(false)
  const [amountAnswered, setAmountAnswered] = useState(0)

  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { flashcardArticles } = useSelector(({ metadata }) => metadata)
  const { cards, pending, deletePending, sessionId } = useSelector(({ flashcards }) => {
    const { pending, deletePending, sessionId } = flashcards

    let cards
    if (mode === 'article') {
      cards = flashcards.nounCards
        && flashcards.nounCards.filter(card => card.gender !== 'mf')
    } else {
      ({ cards } = flashcards)
    }

    return { cards, pending, deletePending, sessionId }
  }, shallowEqual)

  const bigScreen = useWindowDimension().width >= 415
  const { storyId } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getFlashcards(learningLanguage, dictionaryLanguage, storyId))
  }, [storyId])

  useEffect(() => {
    setSwipeIndex(0)
  }, [pending, mode])

  // Updates elo after every 10 answers
  useEffect(() => {
    if (amountAnswered % 10 === 0) dispatch(getSelf())
  }, [amountAnswered])

  // Limits so that you cant swipe back more than once.
  // React-swipeable-views has some weird behaviour with its index. This tries to fix it.
  let oldIndex
  const handleIndexChange = (index) => {
    if (swipeIndex < index) setSwipeIndex(index)
    if (index - oldIndex === 2) setSwipeIndex(swipeIndex)
    oldIndex = index
  }

  const handleNewDeck = () => {
    setSwipeIndex(0)
    dispatch(getFlashcards(learningLanguage, dictionaryLanguage, storyId))
  }

  const answerCard = (answer, correct) => {
    const { _id: flashcard_id, story, lemma, lan_in, lan_out } = cards[swipeIndex]
    const answerDetails = {
      flashcard_id,
      correct,
      answer,
      exercise: mode,
      mode: 'trans',
      story,
      lemma,
      session_id: sessionId,
    }
    dispatch(recordFlashcardAnswer(lan_in, lan_out, answerDetails))
    setAmountAnswered(amountAnswered + 1)
  }

  if (mode === 'article' && !flashcardArticles) return null

  if (pending || deletePending || !cards) return <Spinner />

  if (!cards[0] || cards[0].format === 'no-cards') {
    return (
      <FlashcardNoCards setSwipeIndex={setSwipeIndex} />
    )
  }

  const slideRenderer = ({ key, index }) => {
    if (index >= cards.length) {
      return (
        <FlashcardEndView key="end-view" handleNewDeck={handleNewDeck} />
      )
    }

    switch (mode) {
      case 'article':
        return (
          <Article
            key={key}
            card={cards[index]}
            cardNumbering={`${index + 1} / ${cards.length}`}
            answerCard={answerCard}
          />
        )
      default:
        return (
          <Fillin
            key={key}
            card={cards[index]}
            cardNumbering={`${index + 1} / ${cards.length}`}
            swipeIndex={swipeIndex}
            setSwipeIndex={setSwipeIndex}
            editing={editing && swipeIndex === index}
            setEditing={setEditing}
            focusedAndBigScreen={swipeIndex === index && bigScreen}
            answerCard={answerCard}
          />
        )
    }
  }

  return (
    <div className="component-container flex">
      <VirtualizeSwipeableViews
        index={swipeIndex}
        onChangeIndex={handleIndexChange}
        containerStyle={{ maxWidth: '45em' }}
        slideRenderer={slideRenderer}
        slideCount={cards.length + 1}
        overscanSlideAfter={1}
        overscanSlideBefore={1}
        enableMouseEvents={!bigScreen}
        disabled={editing}
      />
      {!editing
        && (
          <button
            type="button"
            onClick={() => handleIndexChange(swipeIndex + 1)}
            disabled={swipeIndex === cards.length || cards[0].format === 'no-cards'}
            className="flashcard-arrow-button"
            style={{ marginLeft: 0 }}
          >
            <Icon name="angle double right" size="huge" />
          </button>
        )
      }
    </div>
  )
}

export default Practice
