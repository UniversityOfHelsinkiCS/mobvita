import callBuilder from 'Utilities/apiConnection'
import moment from 'moment'

export const getLeaderboards = amount => {
  const route = '/user/leaderboard'
  const startTime = moment().format('YYYY-MM-DD')
  const endTime = moment().add(7, 'd').format('YYYY-MM-DD')
  const query = {
    top_n: amount,
    sort_by: 'weekly_time_spent',
    start_time: startTime,
    end_time: endTime,
  }
  const prefix = 'GET_LEADERBOARDS'
  return callBuilder(route, prefix, 'get', null, query)
}

const initialState = { data: {} }

export default (state = initialState, action) => {
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
