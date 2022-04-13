import callBuilder from '../apiConnection'

export const getStudentVocabulary = (userId, groupId, endDate) => {
  const route = `/groups/${groupId}/vocabulary?uid=${userId}&date=${endDate}`
  const prefix = 'GET_STUDENT_VOCABULARY'
  return callBuilder(route, prefix, 'get')
}

export const getPreviousStudentVocabulary = (userId, groupId, startDate) => {
  const route = `/groups/${groupId}/vocabulary?uid=${userId}&date=${startDate}`
  const prefix = 'GET_PREVIOUS_STUDENT_VOCABULARY'
  return callBuilder(route, prefix, 'get')
}

const initialState = {
  studentVocabulary: { stats: [] },
  previousStudentVocabulary: { prevStats: [] },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_STUDENT_VOCABULARY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_STUDENT_VOCABULARY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_STUDENT_VOCABULARY_SUCCESS':
      return {
        ...state,
        studentVocabulary: action.response,
        pending: false,
        error: false,
      }
    case 'GET_PREVIOUS_STUDENT_VOCABULARY_ATTEMPT':
      return {
        ...state,
        previousPending: true,
        error: false,
      }
    case 'GET_PREVIOUS_STUDENT_VOCABULARY_FAILURE':
      return {
        ...state,
        previousPending: false,
        error: true,
      }
    case 'GET_PREVIOUS_STUDENT_VOCABULARY_SUCCESS':
      return {
        ...state,
        previousStudentVocabulary: action.response,
        previousPending: false,
        error: false,
      }
    default:
      return state
  }
}
