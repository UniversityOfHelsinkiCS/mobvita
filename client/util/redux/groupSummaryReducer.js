import moment from 'moment'
import callBuilder from '../apiConnection'


export const getSummary = (groupId, startDate, endDate) => {
  const start = moment(startDate).format('YYYY-MM-DD')
  const end = moment(endDate).format('YYYY-MM-DD')

  const route = `/groups/${groupId}/summary?start_time=${start}&end_time=${end}`
  const prefix = 'GET_SUMMARY'
  return callBuilder(route, prefix, 'get')
}

export const getPersonalSummary = (language, startDate, endDate) => {
  const start = moment(startDate).format('YYYY-MM-DD')
  const end = moment(endDate).format('YYYY-MM-DD')


  const route = `/user/summary?start_time=${start}&end_time=${end}&language=${language}`
  const prefix = 'GET_PERSONAL_SUMMARY'
  return callBuilder(route, prefix, 'get')
}

export const getWeekSummary = (groupId) => {
  const end = moment().toDate()
  const start = moment().subtract(7, 'days').toDate()
  return getSummary(groupId, start, end)
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
        colOrder: action.response.col_order,
        summary: action.response.summary,
        pending: false,
        error: false,
      }
    case 'GET_PERSONAL_SUMMARY_SUCCESS':
      return {
        ...state,
        summary: [
          action.response,
        ],
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
