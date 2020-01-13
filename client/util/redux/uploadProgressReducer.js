import callBuilder from '../apiConnection'

export const getProgress = (storyId) => {
  const route = `/api/stories/${storyId}/loading`
  const prefix = 'GET_PROGRESS'
  return callBuilder(route, prefix)
}

export default (state = 0, action) => {
  switch (action.type) {
    case 'GET_PROGRESS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_PROGRESS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_PROGRESS_SUCCESS':
      return {
        state: action.response.progress,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
