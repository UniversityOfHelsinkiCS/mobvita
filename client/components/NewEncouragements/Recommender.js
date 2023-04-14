import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'
import Draggable from 'react-draggable'
import { Icon } from 'semantic-ui-react'
import { closeEncouragement, closeFCEncouragement } from 'Utilities/redux/encouragementsReducer'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import { getIncompleteStories } from 'Utilities/redux/incompleteStoriesReducer'
import { useHistory, useParams } from 'react-router-dom'
import {
  getStoriesBlueFlashcards,
  getFlashcards,
  getBlueFlashcards,
} from 'Utilities/redux/flashcardReducer'
import { dictionaryLanguageSelector } from 'Utilities/common'
import FlashcardsHeaderChooser from 'Components/NewEncouragements/SubComponents/FlashcardView/FlashcardsHeaderChooser'
import ListOfRecentStoriesFlashcardsEncouragement from 'Components/NewEncouragements/SubComponents/FlashcardView/ListOfRecentStoriesFlashcardsEncouragement'
import PreviousStoriesBlueFlashcards from 'Components/NewEncouragements/SubComponents/FlashcardView/PreviousStoriesBlueFlashcards'
import ConfirmBlueCardsEncouragement from './SubComponents/MultiPurpose/ConfirmBlueCardsEncouragement'
import ReviewStoriesEncouragement from './SubComponents/HomeView/ReviewStoriesEncouragement'
import UnseenStoriesInGroup from './SubComponents/HomeView/UnseenStoriesInGroup'
import LatestIncompleteStory from './SubComponents/MultiPurpose/LatestIncompleteStory'
import TurnOffRecommendations from './SubComponents/MultiPurpose/TurnOffRecommendations'
import LeaderboardEncouragement from './SubComponents/MultiPurpose/LeaderboardEncouragement'
import StreakEncouragement from './SubComponents/HomeView/StreakEncouragement'
import DailyStoriesEncouragement from './SubComponents/HomeView/DailyStoriesEncouragement'
import DailyStoriesDraggable from './SubComponents/HomeView/DailyStoriesDraggable'
import WelcomeBackEncouragement from './SubComponents/HomeView/WelcomeBackEncouragement'
import SharedIncompleteStoryInGroup from './SubComponents/HomeView/SharedIncompleteStoryInGroup'
import GrammarReviewExerciseEncouragement from './SubComponents/PracticeView/GrammarReviewExerciseEncouragement'
import WordsSeenEncouragement from './SubComponents/MultiPurpose/WordsSeenEncouragement'
import StoryCompletedToBluecardsExerciseEncouragement from './SubComponents/PracticeView/StoryCompletedToBluecardsExerciseEncouragement'
import ExerciseEncouragementHeader from './SubComponents/PracticeView/ExerciseEncouragementHeader'
import NewWordsInteractedExerciseEncouragement from './SubComponents/PracticeView/NewWordsInteractedExerciseEncouragement'
import BackToLibraryFromFlashcards from './SubComponents/FlashcardView/BackToLibraryFromFlashcards'
import TryAnotherBatch from './SubComponents/FlashcardView/TryAnotherBatch'
import FlashcardsProgress from './SubComponents/FlashcardView/FlashcardsProgress'

const Recommender = () => {
  const userData = useSelector(state => state.user.data.user)
  const learningLanguage = userData ? userData.last_used_language : null
  const { cachedStories, pending: metadataPending } = useSelector(({ metadata }) => metadata)
  const { storyBlueCards, prevStoryBlueCards, storyCardsPending } = useSelector(({ flashcards }) => flashcards)
  const { open, fcOpen } = useSelector(({ encouragement }) => encouragement)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { loading } = useSelector(({ incomplete }) => ({
    loading: incomplete.pending,
  }))
  const [dailyStoriesDraggableIsOpen, setDailyStoriesDraggableIsOpen] = useState(false)
  const bigScreen = useWindowDimensions().width > 700
  const dispatch = useDispatch()
  const history = useHistory()
  const isInProgressView = history.location.pathname.includes('profile/progress')
  const isInHomeView = history.location.pathname.includes('/home')
  const isInWelcomeView = history.location.pathname.includes('/welcome')
  const isInPracticeView = history.location.pathname.includes('practice')
  const isInFlashcardsView = history.location.pathname.includes('flashcards')
  const inBlueCardsTest = history.location.pathname.includes('test')
  const { storyId } = useParams()

  // See default_activity_modal row 260
  // This is probably necessary to get the data from BE??
  // Or would it be better to dispatch these in the individual sub components?
  useEffect(() => {
    dispatch(
      getIncompleteStories(learningLanguage, {
        sort_by: 'access',
      })
    )
    dispatch(getLeaderboards())
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
  }, [])

  const handleNewDeck = () => {
    // setSwipeIndex(0)
    // setBlueCardsAnswered([])
    dispatch(closeFCEncouragement())
    dispatch(closeEncouragement())
    if (!inBlueCardsTest) {
      dispatch(getFlashcards(learningLanguage, dictionaryLanguage, storyId))
    } else {
      dispatch(getBlueFlashcards(learningLanguage, dictionaryLanguage, storyId))
      dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
    }
  }

  const handleDailyStoriesClick = () => {
    if (dailyStoriesDraggableIsOpen) {
      setDailyStoriesDraggableIsOpen(false)
      return
    }
    setDailyStoriesDraggableIsOpen(true)
  }

  const handleCloseClick = () => {
    dispatch(closeEncouragement())
    dispatch(closeFCEncouragement())
  }

  return (
    <>
      {loading ?
        null
        : (isInHomeView || isInWelcomeView) && open ? (
          // home- and welcomeView related encouragements
          <div>
            <Draggable cancel=".interactable">
              <div
                className={bigScreen ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}
              >
                <div className="col-flex">
                  <div className="flex-reverse">
                    <Icon
                      className="interactable"
                      style={{
                        cursor: 'pointer',
                        marginBottom: '.25em',
                      }}
                      size="large"
                      name="close"
                      onClick={handleCloseClick}
                    />
                  </div>
                  <div className="col-flex">
                    <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
                      <WelcomeBackEncouragement />
                      <StreakEncouragement />
                      <LeaderboardEncouragement />
                      <DailyStoriesEncouragement handleDailyStoriesClick={handleDailyStoriesClick} />
                      <LatestIncompleteStory />
                      <ConfirmBlueCardsEncouragement />
                      <UnseenStoriesInGroup />
                      <SharedIncompleteStoryInGroup />
                      <ReviewStoriesEncouragement />
                    </div>
                    <TurnOffRecommendations />
                  </div>
                </div>
              </div>
            </Draggable>
            <DailyStoriesDraggable
              cachedStories={cachedStories}
              bigScreen={bigScreen}
              open={dailyStoriesDraggableIsOpen}
              setOpen={setDailyStoriesDraggableIsOpen}
            />
          </div>
        ) : open &&
          storyBlueCards &&
          storyBlueCards.length > 0 &&
          (isInProgressView || isInFlashcardsView) ? (
          // when the user goes to vocabulary chart on progress page and has bluecards to show encouragement
          // also comes up when user enters the flashcards tab
          <div>
            <Draggable cancel=".interactable">
              <div
                className={bigScreen ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}
              >
                <div className="col-flex">
                  <div className="flex-reverse">
                    <Icon
                      className="interactable"
                      style={{
                        cursor: 'pointer',
                        marginBottom: '.25em',
                      }}
                      size="large"
                      name="close"
                      onClick={handleCloseClick}
                    />
                  </div>
                  <div className="col-flex">
                    <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
                      <ConfirmBlueCardsEncouragement />
                    </div>
                    <TurnOffRecommendations />
                  </div>
                </div>
              </div>
            </Draggable>
          </div>
        ) : isInPracticeView && open ? (
          // practice view related encouragements
          // this is the exercise encouragement draggable
          // it differs with css from the basic encouragement draggable
          <div>
            <Draggable cancel=".interactable">
              <div
                className={
                  bigScreen ? 'draggable-ex-encouragement' : 'draggable-ex-encouragement-mobile'
                }
              >
                <div className="col-flex">
                  <div className="flex">
                    <ExerciseEncouragementHeader />
                    <Icon
                      className="interactable"
                      style={{
                        cursor: 'pointer',
                        marginBottom: '.25em',
                      }}
                      size="large"
                      name="close"
                      onClick={handleCloseClick}
                    />
                  </div>
                  <div className="col-flex">
                    <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
                      <LeaderboardEncouragement />
                      <StoryCompletedToBluecardsExerciseEncouragement />
                      <LatestIncompleteStory />
                      <WordsSeenEncouragement />
                      <NewWordsInteractedExerciseEncouragement />
                      <GrammarReviewExerciseEncouragement />
                    </div>
                    <TurnOffRecommendations />
                  </div>
                </div>
              </div>
            </Draggable>
          </div>
        ) : isInFlashcardsView && !inBlueCardsTest && fcOpen ? (
          // "normal" flashcard view related encouragements
          <div>
            <Draggable cancel=".interactable">
              <div
                className={bigScreen ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}
              >
                <div className="col-flex">
                  <div className="flex-reverse">
                    <Icon
                      className="interactable"
                      style={{
                        cursor: 'pointer',
                        marginBottom: '.25em',
                      }}
                      size="large"
                      name="close"
                      onClick={handleCloseClick}
                    />
                  </div>
                  <FlashcardsHeaderChooser handleNewDeck={handleNewDeck} />
                  <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
                    <TryAnotherBatch handleNewDeck={handleNewDeck} />
                    <ListOfRecentStoriesFlashcardsEncouragement />
                    <BackToLibraryFromFlashcards />
                  </div>
                  <TurnOffRecommendations />
                </div>
              </div>
            </Draggable>
          </div>
        ) : isInFlashcardsView && inBlueCardsTest && fcOpen ? (
          // bluecards test view related encouragements
          <div>
            <Draggable cancel=".interactable">
              <div
                className={bigScreen ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}
              >
                <div className="col-flex">
                  <div className="flex-reverse">
                    <Icon
                      className="interactable"
                      style={{
                        cursor: 'pointer',
                        marginBottom: '.25em',
                      }}
                      size="large"
                      name="close"
                      onClick={handleCloseClick}
                    />
                  </div>
                  <FlashcardsHeaderChooser handleNewDeck={handleNewDeck} />
                  <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
                    <PreviousStoriesBlueFlashcards />
                    <WordsSeenEncouragement />
                    <FlashcardsProgress />
                  </div>
                </div>
              </div>
            </Draggable>
          </div>
        ) : null}
    </>
  )
}
export default Recommender
