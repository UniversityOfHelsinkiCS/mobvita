import callBuilder from '../apiConnection'

export const setPrevious = previous => ({ type: 'SET_PREVIOUS', payload: previous })
export const addToPrevious = sentence => ({ type: 'ADD_TO_PREVIOUS', sentence })
export const setFocusedSentence = sentence => ({ type: 'SET_FOCUSED_SENTENCE', sentence })
export const clearFocusedSentence = () => ({ type: 'CLEAR_FOCUSED_SENTENCE' })

export const getExerciseLesson = lessonId => {
  const route = `/lesson/${lessonId}/exercise`
  const prefix = 'GET_EXERCISE_LESSON'

  return callBuilder(route, prefix)
}

export const postLessonExerciseAnswers = (lessonId, answersObject, compete = false) => {
  const payload = answersObject
  payload.compete = compete
  const route = `/lesson/${lessonId}/exercise`
  const prefix = 'GET_LESSON_ANSWERS'

  return callBuilder(route, prefix, 'post', payload)
}

const initialState = {
  lesson_exercises: [],
  session_id: '',
  starttime: null,
  pending: false,
  error: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
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
      let lesson_exercises = []
      action.response.exercises.forEach(exercise => {
        let exercise_tokens = []
        exercise.sent.forEach(token => {
          token['story_id'] = exercise['story_id']
          exercise_tokens.push(token)
        })
        exercise['sent'] = exercise_tokens
        lesson_exercises.push(exercise)
      })
      return {
        ...state,
        pending: false,
        lesson_exercises: lesson_exercises,
        session_id: action.response.session_id,
        starttime: action.response.starttime,
      }
    case 'SET_PREVIOUS':
      return {
        ...state,
        previous: action.payload,
      }
    case 'ADD_TO_PREVIOUS':
      return {
        ...state,
        previous: state.previous.concat(action.sentence),
      }
    case 'SET_FOCUSED_SENTENCE':
      return {
        ...state,
        focused: action.sentence,
      }
    case 'CLEAR_FOCUSED_SENTENCE':
      return {
        ...state,
        focused: undefined,
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
