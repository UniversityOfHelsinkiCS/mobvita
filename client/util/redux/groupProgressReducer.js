import callBuilder from '../apiConnection'


export const getStudentProgress = (userId, groupId, language) => {
  const route = `/groups/${groupId}/progress?uid=${userId}&language=${language}`
  const prefix = 'GET_STUDENT_PROGRESS'
  return callBuilder(route, prefix, 'get')
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_STUDENT_PROGRESS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_STUDENT_PROGRESS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_STUDENT_PROGRESS_SUCCESS':
      return {
        ...state,
        progress: action.response,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
