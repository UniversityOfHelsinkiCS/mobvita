import produce from 'immer'
import callBuilder from '../apiConnection'


export const getLessonTopics = () => {
  const route = '/lesson_topics'
  const prefix = 'GET_LESSONS'

  return callBuilder(route, prefix)
}

const initialState = {
  topics: [],
  pending: false,
  focused: null,
  error: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_LESSONS_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_LESSONS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_LESSONS_SUCCESS':
      return {
        ...state,
        pending: false,
        topics: action.response.topics
      }
    default:
      return state
  }
}
