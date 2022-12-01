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

export const postAnswers = (lessonId, answersObject, compete = false) => {
  const payload = answersObject
  payload.compete = compete
  const route = `/lesson/${lessonId}/exercise`
  const prefix = 'GET_LESSON_ANSWERS'

  return callBuilder(route, prefix, 'post', payload)
}

const initialState = {
  lessons: [],
  lesson_instance: {},
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
        lessons: action.response.lessons //.sort((a, b) => (a.lesson_metadata.index < b.lesson_metadata.index) ? 1 : -1),
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
      return {
        ...state,
        pending: false,
        focused: action.response.exercises,
        sessionId: action.response.session_id,
        starttime: action.response.starttime,
      }
    case 'GET_LESSON_ANSWERS_ATTEMPT':
      return {
        ...state,
        answersPending: true,
      }
    case 'GET_LESSON_ANSWERS_FAILURE':
      return {
        ...state,
        answersPending: false,
        pending: false,
        error: true,
      }
    case 'GET_LESSON_ANSWERS_SUCCESS':
      return {
        ...state,
        focused: action.response,
        answersPending: false,
      }
    default:
      return state
  }
}
