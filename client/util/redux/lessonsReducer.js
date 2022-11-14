import produce from 'immer'
import callBuilder from '../apiConnection'

export const getLessons = () => {
  const route = '/lesson'
  const prefix = 'GET_LESSONS'

  return callBuilder(route, prefix)
}

export const getExerciseLesson = lessonId => {
  const route = `/lesson/${lessonId}/exercise`
  const prefix = 'GET_EXERCISE_LESSON'

  return callBuilder(route, prefix)
}

const initialState = {
  lessons: [],
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
        lessons: action.response.lessons,
      }
    case 'GET_EXERCISE_LESSON_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_EXERCISE_LESSON_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_EXERCISE_LESSON_SUCCESS':
      console.log(' act ', action.response)
      return {
        ...state,
        pending: false,
        focused: action.response.exercises,
      }
    default:
      return state
  }
}
