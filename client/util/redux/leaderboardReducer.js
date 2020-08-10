import callBuilder from 'Utilities/apiConnection'
import moment from 'moment'

const toTimeString = date => {
  return moment(date).format('YYYY-MM-DD')
}

export const getLeaderboards = (amount) => {
  const route = '/user/leaderboard'
  const query = {
    top_n: amount,
    sort_by: 'number_of_exercises'
  }
  const prefix = 'GET_LEADERBOARDS'
  return callBuilder(route, prefix, 'get', null, query)
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_LEADERBOARDS_SUCCESS':
      return {
        ...state,
        data: action.response,
      }
    default:
      return state
  }
}
