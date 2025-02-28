import React, { useState, useEffect, useRef } from 'react'
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
import { dictionaryLanguageSelector, showAllEncouragements } from 'Utilities/common'
import FlashcardsHeaderChooser from 'Components/NewEncouragements/SubComponents/FlashcardView/FlashcardsHeaderChooser'
import ListOfRecentStoriesFlashcardsEncouragement from 'Components/NewEncouragements/SubComponents/FlashcardView/ListOfRecentStoriesFlashcardsEncouragement'
import PreviousStoriesBlueFlashcards from 'Components/NewEncouragements/SubComponents/FlashcardView/PreviousStoriesBlueFlashcards'
import ConfirmBlueCardsEncouragement from './SubComponents/MultiPurpose/ConfirmBlueCardsEncouragement'
import ReviewStoriesEncouragement from './SubComponents/HomeView/ReviewStoriesEncouragement'
import UnseenStoriesInGroup from './SubComponents/HomeView/UnseenStoriesInGroup'
import LatestIncompleteStory from './SubComponents/MultiPurpose/LatestIncompleteStory'
import TurnOffRecommendations from './SubComponents/MultiPurpose/TurnOffRecommendations'
import LeaderboardEncouragement from './SubComponents/MultiPurpose/LeaderboardEncouragement'
import GoodJobEncouragement from './SubComponents/MultiPurpose/GoodJobEncouragement'
import RedirectHomeEncouragement from './SubComponents/MultiPurpose/RedirectHomeEncouragement'
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
import RecommendSlider from './RecommendSlider'

const Recommender = () => {
  const userData = useSelector(state => state.user.data.user)
  const learningLanguage = userData ? userData.last_used_language : null
  const { cachedStories, pending: metadataPending } = useSelector(({ metadata }) => metadata)
  const { storyBlueCards, creditableWordsNum } = useSelector(
    ({ flashcards }) => flashcards
  )
  const { open, fcOpen } = useSelector(({ encouragement }) => encouragement)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { loading, incomplete: incompleteStories } = useSelector(({ incomplete }) => ({
    loading: incomplete.pending,
    incomplete: incomplete.data,
  }))
  const { newVocabulary } = useSelector(({ newVocabulary }) => newVocabulary)
  const { user_rank } = useSelector(({ leaderboard }) => leaderboard.data)
  const stories = useSelector(({ stories }) => stories.data)
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
  const inReviewView = history.location.pathname.includes('review')
  const inLessonPracticeView = history.location.pathname.includes('lesson/practice')

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

  const welcomeback_encourage = history.location.pathname.includes('/welcome') ? <WelcomeBackEncouragement /> : undefined;

  const leader_board_encourage = user_rank && user_rank <= 10 ? <LeaderboardEncouragement /> : undefined;

  const daily_stories_encourage = cachedStories?.length > 0 || showAllEncouragements ?
    <DailyStoriesEncouragement handleDailyStoriesClick={handleDailyStoriesClick} /> : undefined;

  const latest_incomplete_story = incompleteStories && incompleteStories?.filter(
    story => story.last_snippet_id !== story.num_snippets - 1
  ).length > 0 ? <LatestIncompleteStory /> : undefined;

  const words_seen_encourage = userData.vocabulary_seen > 0 ? <WordsSeenEncouragement /> : undefined;

  const new_words_interacted_exercise_encourage = newVocabulary > 0 ? <NewWordsInteractedExerciseEncouragement /> : undefined;

  const prev_stories_blue_cards_encourage = storyBlueCards && storyBlueCards?.find(
    story => story.story_id !== storyId && story.num_of_rewardable_words >= 5
  ) ? <PreviousStoriesBlueFlashcards /> : undefined;

  const confirm_blue_card_encourage = storyBlueCards && storyBlueCards?.length > 0 ? <ConfirmBlueCardsEncouragement /> : undefined;

  const list_of_recent_stories_flashcards_encourage = incompleteStories && incompleteStories?.filter(
    story => story.last_snippet_id !== story.num_snippets - 1
  ).length > 0 ? <ListOfRecentStoriesFlashcardsEncouragement /> : undefined;

  const review_stories_encourage = incompleteStories && incompleteStories?.filter(
    story => story.last_snippet_id === story.num_snippets - 1
  ).length > 0 ? <ReviewStoriesEncouragement /> : undefined;

  const unseen_stories_inGroup_encourage = stories.find(
    story => story.shared && !story.has_read && story.groups?.length > 0 && !story.control_story
  ) ? <UnseenStoriesInGroup /> : undefined;

  const shared_incomplete_story_inGroup_encourage = stories.find(
    story => story.shared && !story.has_read && story.control_story
  ) ? <SharedIncompleteStoryInGroup /> : undefined;

  const num_of_rewardable_words = creditableWordsNum >= 5 || (storyBlueCards?.filter(
    story => story.story_id !== storyId
  ).length > 0 && storyBlueCards?.filter(
    story => story.story_id !== storyId
  )[0]?.num_of_rewardable_words >= 5) ? <StoryCompletedToBluecardsExerciseEncouragement /> : undefined;

  return (
    <>
      {loading ? null : showAllEncouragements && open ? (
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

                <RecommendSlider slides={[
                  welcomeback_encourage,
                  <StreakEncouragement />,
                  leader_board_encourage,
                  daily_stories_encourage,
                  latest_incomplete_story,
                  confirm_blue_card_encourage,
                  unseen_stories_inGroup_encourage,
                  shared_incomplete_story_inGroup_encourage,
                  review_stories_encourage,
                  leader_board_encourage,
                  num_of_rewardable_words,
                  words_seen_encourage,
                  new_words_interacted_exercise_encourage,
                  <GrammarReviewExerciseEncouragement />,
                  prev_stories_blue_cards_encourage,
                  <FlashcardsProgress />,
                  <TryAnotherBatch handleNewDeck={handleNewDeck} />,
                  list_of_recent_stories_flashcards_encourage,
                  <BackToLibraryFromFlashcards />,
                  <GoodJobEncouragement />,
                  <RedirectHomeEncouragement />
                ]} />

                {/* <WelcomeBackEncouragement />
                <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
                  <StreakEncouragement />
                  <LeaderboardEncouragement />
                  <DailyStoriesEncouragement handleDailyStoriesClick={handleDailyStoriesClick} />
                  <LatestIncompleteStory />
                  <ConfirmBlueCardsEncouragement />
                  <UnseenStoriesInGroup />
                  <SharedIncompleteStoryInGroup />
                  <ReviewStoriesEncouragement />
                  <p>end of homeview</p>
                  <LeaderboardEncouragement />
                  <StoryCompletedToBluecardsExerciseEncouragement />
                  <LatestIncompleteStory />
                  <WordsSeenEncouragement />
                  <NewWordsInteractedExerciseEncouragement />
                  <GrammarReviewExerciseEncouragement />
                  <p>end of practise view</p>
                  <PreviousStoriesBlueFlashcards />
                  <WordsSeenEncouragement />
                  <FlashcardsProgress />
                  <p>end of bluecard test view</p>
                  <TryAnotherBatch handleNewDeck={handleNewDeck} />
                  <ListOfRecentStoriesFlashcardsEncouragement />
                  <BackToLibraryFromFlashcards />
                  <p>end of normal flashcard view</p>
                  <GoodJobEncouragement />
                  <RedirectHomeEncouragement />
                  <p>end of lesson</p>
                </div> */}
              </div>
            </div>
          </Draggable>
        </div>
      ) : (isInHomeView || isInWelcomeView) && open ? (
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

                <RecommendSlider slides={[
                  welcomeback_encourage,
                  <StreakEncouragement />,
                  leader_board_encourage,
                  daily_stories_encourage,
                  latest_incomplete_story,
                  confirm_blue_card_encourage,
                  unseen_stories_inGroup_encourage,
                  shared_incomplete_story_inGroup_encourage,
                  review_stories_encourage,
                ]} />
                <TurnOffRecommendations />
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

                <RecommendSlider slides={[
                  confirm_blue_card_encourage,
                ]} />
                <TurnOffRecommendations />

                {/* <div className="col-flex">
                  <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
                    <ConfirmBlueCardsEncouragement />
                  </div>
                  <TurnOffRecommendations />
                </div> */}
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

                <RecommendSlider slides={[
                  leader_board_encourage,
                  num_of_rewardable_words,
                  latest_incomplete_story,
                  words_seen_encourage,
                  new_words_interacted_exercise_encourage,
                  <GrammarReviewExerciseEncouragement />
                ]} />
                <TurnOffRecommendations />

                {/* <div className="col-flex">
                  <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
                    <LeaderboardEncouragement />
                    <StoryCompletedToBluecardsExerciseEncouragement />
                    <LatestIncompleteStory />
                    <WordsSeenEncouragement />
                    <NewWordsInteractedExerciseEncouragement />
                    <GrammarReviewExerciseEncouragement />
                  </div>
                  <TurnOffRecommendations />
                </div> */}
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

                <RecommendSlider slides={[
                  <FlashcardsHeaderChooser handleNewDeck={handleNewDeck} />,
                  <TryAnotherBatch handleNewDeck={handleNewDeck} />,
                  list_of_recent_stories_flashcards_encourage,
                  <BackToLibraryFromFlashcards />
                ]} />
                <TurnOffRecommendations />

                {/* <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
                  <FlashcardsHeaderChooser handleNewDeck={handleNewDeck} />
                  <TryAnotherBatch handleNewDeck={handleNewDeck} />
                  <ListOfRecentStoriesFlashcardsEncouragement />
                  <BackToLibraryFromFlashcards />
                </div>
                <TurnOffRecommendations /> */}
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

                <RecommendSlider slides={[
                  <FlashcardsHeaderChooser handleNewDeck={handleNewDeck} />,
                  prev_stories_blue_cards_encourage,
                  words_seen_encourage,
                  <FlashcardsProgress />
                ]} />
                <TurnOffRecommendations />

                {/* <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
                  <FlashcardsHeaderChooser handleNewDeck={handleNewDeck} />
                  <PreviousStoriesBlueFlashcards />
                  <WordsSeenEncouragement />
                  <FlashcardsProgress />
                </div>
                <TurnOffRecommendations /> */}
              </div>
            </div>
          </Draggable>
        </div>
      ) : inLessonPracticeView && fcOpen ? (
        // lesson practice view related encouragements
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

                <RecommendSlider slides={[
                  <GoodJobEncouragement />,
                  <RedirectHomeEncouragement />
                ]} />
                <TurnOffRecommendations />

                {/* <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
                  <GoodJobEncouragement />
                  <RedirectHomeEncouragement />
                </div>
                <TurnOffRecommendations /> */}
              </div>
            </div>
          </Draggable>
        </div>
      ) : null}
    </>
  )
}
export default Recommender
