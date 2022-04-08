import callBuilder from '../apiConnection'

export const getStudentVocabulary = (userId, groupId, earlierDate) => {
  const route = `/groups/${groupId}/vocabulary?uid=${userId}&earlier_date=${earlierDate}`
  const prefix = 'GET_STUDENT_VOCABULARY'
  return callBuilder(route, prefix, 'get')
}

const initialState = { studentVocabulary: { stats: [] } }

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
    default:
      return state
  }
}