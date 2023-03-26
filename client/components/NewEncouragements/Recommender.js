import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'
import Draggable from 'react-draggable'
import { Icon } from 'semantic-ui-react'
import { closeEncouragement } from 'Utilities/redux/encouragementsReducer'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import { getIncompleteStories } from 'Utilities/redux/incompleteStoriesReducer'
import { useHistory } from 'react-router-dom'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { dictionaryLanguageSelector } from 'Utilities/common'
import HomeViewFlashcardEncouragement from './SubComponents/HomeViewFlashcardEncouragement'
import ReviewStoriesEncouragement from './SubComponents/ReviewStoriesEncouragement'
import UnseenStoriesInGroup from './SubComponents/UnseenStoriesInGroup'
import LatestIncompleteStory from './SubComponents/LatestIncompleteStory'
import TurnOffRecommendations from './SubComponents/TurnOffRecommendations'
import LeaderboardEncouragement from './SubComponents/LeaderboardEncouragement'
import DailyStoriesEncouragement from './SubComponents/DailyStoriesEncouragement'
import DailyStoriesDraggable from './SubComponents/DailyStoriesDraggable'
import WelcomeBackEncouragement from './SubComponents/WelcomeBackEncouragement'
import SharedIncompleteStoryInGroup from './SubComponents/SharedIncompleteStoryInGroup'
import GrammarReviewExerciseEncouragement from './SubComponents/GrammarReviewExerciseEncouragement'
import WordsSeenExerciseEncouragement from './SubComponents/WordsSeenExerciseEncouragement'
import StoryCompletedToBluecardsExerciseEncouragement from './SubComponents/StoryCompletedToBluecardsExerciseEncouragement'
import ExerciseEncouragementHeader from './SubComponents/ExerciseEncouragementHeader'
import NewWordsInteractedExerciseEncouragement from './SubComponents/NewWordsInteractedExerciseEncouragement'

const Recommender = () => {
  const userData = useSelector(state => state.user.data.user)
  const learningLanguage = userData ? userData.last_used_language : null
  const { cachedStories, pending: metadataPending } = useSelector(({ metadata }) => metadata)
  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)
  const { open } = useSelector(({ encouragement }) => encouragement)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const [dailyStoriesDraggableIsOpen, setDailyStoriesDraggableIsOpen] = useState(false)
  const bigScreen = useWindowDimensions().width > 700
  const dispatch = useDispatch()
  const history = useHistory()
  const isInProgressView = history.location.pathname.includes('profile/progress')
  const isInHomeView = history.location.pathname.includes('/home')
  const isInWelcomeView = history.location.pathname.includes('/welcome')
  const isInPracticeView = history.location.pathname.includes('practice')
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
    /*
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
    if (storyBlueCards?.length > 0) {
      setPrevBlueCards(storyBlueCards[0])
    } else {
      setPrevBlueCards([])
    } */
  }, [])

  const handleDailyStoriesClick = () => {
    if (dailyStoriesDraggableIsOpen) {
      setDailyStoriesDraggableIsOpen(false)
      return
    }
    setDailyStoriesDraggableIsOpen(true)
  }

  const handleCloseClick = () => {
    dispatch(closeEncouragement())
    console.log(isInProgressView, 'on progressissa')
  }
  if (open) {
    return (
      <>
        {isInHomeView || isInWelcomeView ? (
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
                      <LeaderboardEncouragement />
                      <DailyStoriesEncouragement
                        handleDailyStoriesClick={handleDailyStoriesClick}
                      />
                      <LatestIncompleteStory />
                      <HomeViewFlashcardEncouragement />
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
        ) : isInProgressView && storyBlueCards.length > 0 ? (
          // when the user goes to vocabulary chart on progress page and has bluecards to show encouragement
          // this statement cannot be put inside a general draggable, because if the requirements are not met, an empty draggable will be rendered
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
                      <HomeViewFlashcardEncouragement />
                    </div>
                    <TurnOffRecommendations />
                  </div>
                </div>
              </div>
            </Draggable>
          </div>
        ) : isInPracticeView ? (
          // this is the exercise encouragement draggable
          //it differs with css from the basic encouragement draggable
          <div>
            <Draggable cancel=".interactable">
              <div
                className={bigScreen ? 'draggable-ex-encouragement' : 'draggable-ex-encouragement-mobile'}>
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
                      <WordsSeenExerciseEncouragement />
                      <NewWordsInteractedExerciseEncouragement />
                      <GrammarReviewExerciseEncouragement />
                    </div>
                    <TurnOffRecommendations />
                  </div>
                </div>
              </div>
            </Draggable>
          </div>
        ) : null}
      </>
    )
  }
  return null
}
export default Recommender
