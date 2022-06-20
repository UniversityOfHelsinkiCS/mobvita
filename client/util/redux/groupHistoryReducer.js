import moment from 'moment'
import callBuilder from '../apiConnection'

export const getStudentHistory = (student_id, group_id, startDate, endDate, view) => {
  const route = `/groups/${group_id}/${view}?uid=${student_id}&start_time=${moment(
    startDate
  ).format('YYYY-MM-DD')}&end_time=${moment(endDate).format('YYYY-MM-DD')}`
  const prefix = `GET_GROUP_${view.toUpperCase()}_HISTORY`
  return callBuilder(route, prefix, 'get')
}

export const getGroupHistory = (group_id, startDate, endDate, view) => {
  const route = `groups/${group_id}/${view}?start_time=${moment(startDate).format(
    'YYYY-MM-DD'
  )}&end_time=${moment(endDate).format('YYYY-MM-DD')}`
  const prefix = `GET_WHOLE_GROUP_${view.toUpperCase()}_HISTORY`
  return callBuilder(route, prefix, 'get')
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_GROUP_TEST_HISTORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_GROUP_TEST_HISTORY_SUCCESS':
      return {
        ...state,
        history: action.response.test_history,
        pending: false,
        error: false,
      }
    case 'GET_GROUP_TEST_HISTORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_WHOLE_GROUP_TEST_HISTORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_WHOLE_GROUP_TEST_HISTORY_SUCCESS':
      return {
        ...state,
        history: action.response.test_history,
        pending: false,
        error: false,
      }
    case 'GET_WHOLE_GROUP_TEST_HISTORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_GROUP_EXERCISE_HISTORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_GROUP_EXERCISE_HISTORY_SUCCESS':
      return {
        ...state,
        history: action.response.exercise_history,
        pending: false,
        error: false,
      }
    case 'GET_GROUPP_EXERCISE_HISTORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_WHOLE_GROUP_EXERCISE_HISTORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_WHOLE_GROUP_EXERCISE_HISTORY_SUCCESS':
      return {
        ...state,
        history: action.response.exercise_history,
        pending: false,
        error: false,
      }
    case 'GET_WHOLE_GROUP_EXERCISE_HISTORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
