import callBuilder from 'Utilities/apiConnection'

export const getLeaderboards = () => {
  const route = '/user/leaderboard'
  const query = {
    top_n: 25,
    sort_by: 'weekly_time_spent',
  }
  const prefix = 'GET_LEADERBOARDS'
  return callBuilder(route, prefix, 'get', null, query)
}

const initialState = { data: {}, pending: false }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_LEADERBOARDS_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_LEADERBOARDS_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
      }
    default:
      return state
  }
}
