import callBuilder from 'Utilities/apiConnection'
import moment from 'moment'

const initialState = {
  exerciseHistory: [],
  flashcardHistory: [],
  testHistory: [],
  xpHistory: [],
  practiceTimeHistory: [],
  streakToday: null,
  daysStreaked: null,
}

export const getPracticeHistory = (startDate, endDate) => {
  const route = `/user/practice_history?start_time=${moment(startDate).format(
    'YYYY-MM-DD'
  )}&end_time=${moment(endDate).format('YYYY-MM-DD')}`
  const prefix = 'GET_PRACTICE_HISTORY'
  return callBuilder(route, prefix, 'get')
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PRACTICE_HISTORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_PRACTICE_HISTORY_SUCCESS':
      return {
        ...state,
        eloExerciseHistory: action.response.elo_exercise_history,
        irtExerciseHistory: action.response.irt_exercise_history,
        flashcardHistory: action.response.flashcard_history,
        testHistory: action.response.test_history,
        xpHistory: action.response.xp_history,
        practiceTimeHistory: action.response.practice_time_history,
        streakToday: action.response.is_today_streaked,
        daysStreaked: action.response.num_streaked_days,
        pending: false,
        error: false,
      }
    case 'GET_PRACTICE_HISTORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
