import moment from 'moment'
import callBuilder from '../apiConnection'


export const getHistory = (language) => {
  const now = moment().format('YYYY-MM-DD')
  const route = `/user/history/${language}?start_time=2019-01-01&end_time=${now}`
  const prefix = 'GET_EXERCISE_HISTORY'
  return callBuilder(route, prefix, 'get')
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_EXERCISE_HISTORY_SUCCESS':
      return {
        ...state,
        history: action.response.history,
        error: false,
      }
    case 'GET_EXERCISE_HISTORY_FAILURE':
      return {
        ...state,
        error: true,
      }
    default:
      return state
  }
}
