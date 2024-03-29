import moment from 'moment'
import callBuilder from '../apiConnection'

export const getSummary = (groupId, startDate, endDate) => {
  const start = moment(startDate).format('YYYY-MM-DD')
  const end = moment(endDate).format('YYYY-MM-DD')

  const route = `/groups/${groupId}/summary?start_time=${start}&end_time=${end}`
  const prefix = 'GET_SUMMARY'
  return callBuilder(route, prefix, 'get')
}

export const getInitSummary = groupId => {
  const route = `/groups/${groupId}/summary`
  const prefix = 'GET_INIT_SUMMARY'
  return callBuilder(route, prefix, 'get')
}

export const getPersonalSummary = (language, startDate, endDate) => {
  const start = moment(startDate).format('YYYY-MM-DD')
  const end = moment(endDate).format('YYYY-MM-DD')

  const route = `/user/summary?start_time=${start}&end_time=${end}&language=${language}`
  const prefix = 'GET_PERSONAL_SUMMARY'
  return callBuilder(route, prefix, 'get')
}

export const getPersonalOverallSummary = (language) => {
  const route = `/user/summary?language=${language}`
  const prefix = 'GET_PERSONAL_OVERALL_SUMMARY'
  return callBuilder(route, prefix, 'get')
}

export const getWeekSummary = groupId => {
  const end = moment().toDate()
  const start = moment().subtract(7, 'days').toDate()
  return getSummary(groupId, start, end)
}

export const updateStudentCEFRLevels = (groupId, sid, grades) => {
  const route = `/groups/${groupId}/grade`
  const prefix = 'UPDATE_STUDENT_CEFR'
  const payload = { sid, grades }
  return callBuilder(route, prefix, 'post', payload)
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
    case 'GET_INIT_SUMMARY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_INIT_SUMMARY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_INIT_SUMMARY_SUCCESS':
      return {
        ...state,
        colOrder: action.response.col_order,
        summary: action.response.summary,
        pending: false,
        error: false,
        start_date: action.response.start_date,
        end_date: action.response.end_date,
      }
    case 'GET_PERSONAL_SUMMARY_SUCCESS':
      return {
        ...state,
        summary: [action.response],
        pending: false,
        error: false,
      }
    case 'GET_PERSONAL_OVERALL_SUMMARY_SUCCESS':
      return {
        ...state,
        profile_summary: [action.response],
        pending: false,
        error: false
      }
    case 'UPDATE_STUDENT_CEFR_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'UPDATE_STUDENT_CEFR_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'UPDATE_STUDENT_CEFR_SUCCESS':
      return {
        ...state,
        pending: false,
      }
    default:
      return state
  }
}
