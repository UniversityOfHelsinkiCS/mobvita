import moment from 'moment'
import callBuilder from '../apiConnection'

export const getHistory = (language, startDate, endDate) => {
  const route = `/user/history/${language}?start_time=${moment(startDate).format(
    'YYYY-MM-DD'
  )}&end_time=${moment(endDate).format('YYYY-MM-DD')}`
  const prefix = 'GET_EXERCISE_HISTORY'
  return callBuilder(route, prefix, 'get')
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_EXERCISE_HISTORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_EXERCISE_HISTORY_SUCCESS':
      return {
        ...state,
        history: action.response.history,
        pending: false,
        error: false,
      }
    case 'GET_EXERCISE_HISTORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
