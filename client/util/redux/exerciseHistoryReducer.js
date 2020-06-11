import callBuilder from '../apiConnection'


export const getHistory = (language) => {
  const route = `/user/history/${language}`
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
