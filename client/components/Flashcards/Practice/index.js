import React, { useState, useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { virtualize, bindKeyboard } from 'react-swipeable-views-utils'
import flowRight from 'lodash/flowRight'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import {
  getFlashcards,
  getBlueFlashcards,
  recordFlashcardAnswer,
  addToTotal,
  answerBluecards,
  getStoriesBlueFlashcards,
} from 'Utilities/redux/flashcardReducer'
import { getIncompleteStories } from 'Utilities/redux/incompleteStoriesReducer'
import { closeFCEncouragement, openFCEncouragement } from 'Utilities/redux/encouragementsReducer'
import { closeEncouragement, openEncouragement } from 'Utilities/redux/encouragementsReducer'
import { getSelf } from 'Utilities/redux/userReducer'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import useWindowDimension from 'Utilities/windowDimensions'
import Spinner from 'Components/Spinner'
import FlashcardsEncouragement from 'Components/Encouragements/FlashcardsEncouragement'
import FlashcardEndView from './FlashcardEndView'
import FlashcardNoCards from './FlashCardNoCards'
import Recommender from 'Components/NewEncouragements/Recommender'

import Fillin from './Fillin'
import Article from './Article'
import Quick from './Quick'

const VirtualizeSwipeableViews = flowRight(bindKeyboard, virtualize)(SwipeableViews)

const Practice = ({ mode, open }) => {
  const [swipeIndex, setSwipeIndex] = useState(0)
  const [editing, setEditing] = useState(false)
  const [amountAnswered, setAmountAnswered] = useState(0)
  const history = useHistory()
  const { fcOpen } = useSelector(({ encouragement }) => encouragement)
  const { enable_recmd, vocabulary_seen } = useSelector(({ user }) => user.data.user)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const [blueCardsAnswered, setBlueCardsAnswered] = useState([])
  const blueCardsTest = history.location.pathname.includes('test')
  const [latestStories, setLatestStories] = useState([])
  const [prevBlueCards, setPrevBlueCards] = useState(null)
  const { flashcardArticles } = useSelector(({ metadata }) => metadata)
  const { correctAnswers, totalAnswers, storyBlueCards, storyCardsPending } = useSelector(
    ({ flashcards }) => flashcards
  )
  // console.log('MODE ', mode)
  const { incomplete, loading } = useSelector(({ incomplete }) => ({
    incomplete: incomplete.data,
    loading: incomplete.pending,
  }))
  const { cards, pending, deletePending, sessionId } = useSelector(({ flashcards }) => {
    const { pending, deletePending, sessionId } = flashcards

    let cards
    if (mode === 'article') {
      cards =// Change this to true when developing new encouragement!
        // REMEMBER TO SWITCH BACK TO FALSE BEFORE PUSHING!!!
        flashcards.nounCards &&
        flashcards.nounCards.filter(card =>
          ['Feminine', 'Masculine', 'Neuter', 'ut', 'm', 'f', 'nt', 'Fem', 'Neut', 'Masc'].includes(
            card.gender
          )
        )
    } else {
      ; ({ cards } = flashcards)
    }

    return { cards, pending, deletePending, sessionId }
  }, shallowEqual)

  const bigScreen = useWindowDimension().width >= 415
  const { storyId } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
    if (!pending && !loading) {
      if (totalAnswers === 0) {
        dispatch(openEncouragement())
      }
      //console.log(`en:${open} fc: ${fcOpen}`)
      //console.log(`total:${totalAnswers} deck size: ${cards.length}`)
      if (totalAnswers >= cards.length) {
        //console.log(`total:${totalAnswers} deck size: ${cards.length}`)
        dispatch(openFCEncouragement())
      }
    }
  }, [totalAnswers, cards.length])

  const inFillin = history.location.pathname.includes('test')
  useEffect(() => {
    setSwipeIndex(0)
  }, [pending])

  useEffect(() => {
    dispatch(
      getIncompleteStories(learningLanguage, {
        sort_by: 'access',
      })
    )
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
  }, [])

  useEffect(() => {
    const filteredBlueCards = storyBlueCards?.find(
      story => story.story_id !== storyId && story.num_of_rewardable_words >= 5
    )

    if (filteredBlueCards) {
      setPrevBlueCards(filteredBlueCards)
    }
  }, [storyBlueCards])

  useEffect(() => {
    if (incomplete.length > 0) {
      const latestIncompleteStories = incomplete.filter(
        story => story.last_snippet_id !== story.num_snippets - 1
      )
      const previousStories = []
      for (
        let i = latestIncompleteStories.length - 1;
        i >= 0 && i >= latestIncompleteStories.length - 3;
        i--
      ) {
        previousStories.push(latestIncompleteStories[i])
      }

      setLatestStories(previousStories)
    }
  }, [incomplete])

  useEffect(() => {
    if (blueCardsAnswered.length === cards.length && blueCardsAnswered.length > 0) {
      const answerObj = {
        flashcard_answers: blueCardsAnswered,
      }
      setBlueCardsAnswered([])
      dispatch(answerBluecards(learningLanguage, dictionaryLanguage, answerObj))
    }
  }, [blueCardsAnswered])

  // Updates elo after every 10 answers
  useEffect(() => {
    if (amountAnswered % 10 === 0) dispatch(getSelf())
  }, [amountAnswered])

  useEffect(() => {
    if (inFillin) {
      dispatch(getBlueFlashcards(learningLanguage, dictionaryLanguage, storyId))
      setBlueCardsAnswered([])
    } else {
      dispatch(getFlashcards(learningLanguage, dictionaryLanguage, storyId))
    }
  }, [storyId, dictionaryLanguage, mode])

  // Limits so that you cant swipe back more than once.
  // React-swipeable-views has some weird behaviour with its index. This tries to fix it.
  const handleIndexChange = index => {
    const oldIndex = swipeIndex
    setSwipeIndex(index)

    if (index > blueCardsAnswered.length) {
      const wrongAnswerObj = {
        correct: false,
        story: cards[oldIndex].story,
        flashcard_id: cards[oldIndex]._id,
        session_id: sessionId,
        hints_shown: cards[oldIndex].displayedHints?.length || 0,
        mode: 'trans',
        exercise: 'fillin',
        lemma: cards[oldIndex].lemma,
        answer: '',
      }
      setBlueCardsAnswered(blueCardsAnswered.concat(wrongAnswerObj))
    }
    dispatch(addToTotal())
    setTimeout(() => {
      if (index < oldIndex) setSwipeIndex(oldIndex)
    }, 1)
  }

  const handleNewDeck = () => {
    setSwipeIndex(0)
    setBlueCardsAnswered([])
    dispatch(openFCEncouragement)
    console.log('pop')
    if (!inFillin) {
      dispatch(getFlashcards(learningLanguage, dictionaryLanguage, storyId))
    } else {
      dispatch(getBlueFlashcards(learningLanguage, dictionaryLanguage, storyId))
      dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
    }
  }

  const answerCard = (answer, correct, exercise, displayedHints) => {
    const { _id: flashcard_id, story, lemma, lan_in, lan_out } = cards[swipeIndex]
    const answerDetails = {
      flashcard_id,
      correct,
      answer,
      exercise,
      hints_shown: displayedHints?.length || 0,
      mode: 'trans',
      story,
      lemma,
      session_id: sessionId,
    }
    if (!blueCardsTest) {
      dispatch(recordFlashcardAnswer(lan_in, lan_out, answerDetails))
    } else {
      setBlueCardsAnswered(blueCardsAnswered.concat(answerDetails))
    }

    setAmountAnswered(amountAnswered + 1)
  }

  if (mode === 'article' && !flashcardArticles) return null

  if (pending || deletePending || !cards)
    return (
      <div className="grow flex space-evenly">
        <div className="flashcard">
          <Spinner variant="secondary" />
        </div>
        <button type="button" disabled className="flashcard-arrow-button" style={{ marginLeft: 0 }}>
          <Icon name="angle double right" size="huge" />
        </button>
      </div>
    )

  if (!cards[0] || cards[0].format === 'no-cards') {
    return <FlashcardNoCards setSwipeIndex={setSwipeIndex} />
  }

  const slideRenderer = ({ key, index }) => {
    if (index >= cards.length) {
      return (
        <FlashcardEndView
          key="end-view"
          handleNewDeck={handleNewDeck}
          deckSize={cards.length}
          open={open}
          blueCardsAnswered={blueCardsAnswered}
        />
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
      case 'quick':
        return (
          <Quick
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
            handleIndexChange={handleIndexChange}
            setSwipeIndex={setSwipeIndex}
            editing={editing && swipeIndex === index}
            setEditing={setEditing}
            focusedAndBigScreen={swipeIndex === index && bigScreen}
            answerCard={answerCard}
            deckSize={cards.length}
          />
        )
    }
  }

  // Change this to true when developing new encouragement!
  // REMEMBER TO SWITCH BACK TO FALSE BEFORE PUSHING!!!
  const TESTING_NEW_ENCOURAGEMENT = false

  return (
    <div className="cont grow flex space-evenly">
      {TESTING_NEW_ENCOURAGEMENT && (
        <Recommender />
      )}
      {!TESTING_NEW_ENCOURAGEMENT && (
        <FlashcardsEncouragement
          open={open}
          correctAnswers={correctAnswers}
          deckSize={cards.length}
          enable_recmd={enable_recmd}
          handleNewDeck={handleNewDeck}
          vocabularySeen={vocabulary_seen}
          latestStories={latestStories}
          prevBlueCards={prevBlueCards}
          loading={loading}
          storyCardsPending={storyCardsPending}
          totalAnswers={totalAnswers}
        />
      )}
      <VirtualizeSwipeableViews
        index={swipeIndex}
        onChangeIndex={handleIndexChange}
        containerStyle={{ maxWidth: '40em' }}
        slideRenderer={slideRenderer}
        slideCount={cards.length + 1}
        overscanSlideAfter={1}
        overscanSlideBefore={1}
        enableMouseEvents={!bigScreen}
        disabled={editing}
      />
      {!editing && swipeIndex !== cards.length && cards[0].format !== 'no-cards' && (
        <button
          type="button"
          onClick={() => handleIndexChange(swipeIndex + 1)}
          disabled={swipeIndex === cards.length || cards[0].format === 'no-cards'}
          className="flashcard-arrow-button"
          style={{ marginLeft: 0 }}
        >
          <Icon name="angle double right" size="huge" />
        </button>
      )}
    </div>
  )
}

export default Practice
