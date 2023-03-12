import { combineReducers } from 'redux'

import stories from './storiesReducer'
import annotations from './annotationsReducer'
import snippets from './snippetsReducer'
import translation from './translationReducer'
import locale from './localeReducer'
import user from './userReducer'
import compete from './competitionReducer'
import sidebar from './sidebarReducer'
import email from './emailReducer'
import register from './registerReducer'
import notification from './notificationReducer'
import uploadProgress from './uploadProgressReducer'
import flashcards from './flashcardReducer'
import groups from './groupsReducer'
import share from './shareReducer'
import metadata from './metadataReducer'
import summary from './groupSummaryReducer'
import encouragement from './encouragementsReducer'
import practice from './practiceReducer'
import progress from './progressReducer'
import passwordReset from './passwordResetReducer'
import studentProgress from './groupProgressReducer'
import studentHistory from './groupHistoryReducer'
import studentVocabulary from './groupVocabularyReducer'
import tests from './testReducer'
import exerciseHistory from './exerciseHistoryReducer'
import crossword from './crosswordReducer'
import serverError from './serverErrorReducer'
import leaderboard from './leaderboardReducer'
import newAchievements from './newAchievementsReducer'
import flashcardList from './flashcardListReducer'
import tour from './tourReducer'
import news from './newsReducer'
import wordNest from './wordNestReducer'
import controlledPractice from './controlledPracticeReducer'
import constructionTest from './constructionTestReducer'
import incomplete from './incompleteStoriesReducer'
import newVocabulary from './newVocabularyReducer'
import debugFeedback from './feedbackDebuggerReducer'
import lessons from './lessonsReducer'
import lessonInstance from './lessonInstanceReducer'
import lessonExercises from './lessonExercisesReducer'
import dropdown from './dropdownReducer'
import modal from './modalReducer'

const rootReducer = combineReducers({
  stories,
  annotations,
  snippets,
  translation,
  user,
  locale,
  compete,
  sidebar,
  email,
  register,
  notification,
  uploadProgress,
  flashcards,
  groups,
  share,
  metadata,
  summary,
  practice,
  progress,
  passwordReset,
  studentProgress,
  tests,
  exerciseHistory,
  crossword,
  serverError,
  leaderboard,
  newAchievements,
  studentHistory,
  flashcardList,
  tour,
  news,
  wordNest,
  controlledPractice,
  constructionTest,
  incomplete,
  newVocabulary,
  studentVocabulary,
  debugFeedback,
  encouragement,
  lessons,
  lessonInstance,
  lessonExercises,
  dropdown,
  modal
})

export default (state, action) =>
  action.type === 'LOGOUT_SUCCESS' ? rootReducer(undefined, action) : rootReducer(state, action)
