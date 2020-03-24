import moment from 'moment'
import callBuilder from '../apiConnection'


export const getSummary = (groupId, language, startDate, endDate) => {
  const start = moment(startDate).format('YYYY-MM-DD')
  const end = moment(endDate).format('YYYY-MM-DD')

  const route = `/groups/${groupId}/summary?start_time=${start}&end_time=${end}&language=${language}`
  const prefix = 'GET_SUMMARY'
  return callBuilder(route, prefix, 'get')
}

export const getWeekSummary = (groupId, language) => {
  const end = moment().toDate()
  const start = moment().subtract(7, 'days').toDate()
  return getSummary(groupId, language, start, end)
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_SUMMARY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_SUMMARY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_SUMMARY_SUCCESS':
      return {
        ...state,
        summary: action.response.summary,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
