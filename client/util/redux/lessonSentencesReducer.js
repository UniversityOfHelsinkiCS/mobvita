import produce from 'immer'
import callBuilder from '../apiConnection'

export const setPrevious = previous => ({ type: 'SET_PREVIOUS', payload: previous })
export const addToPrevious = sentence => ({ type: 'ADD_TO_PREVIOUS', sentence })
export const setFocusedSentence = sentence => ({ type: 'SET_FOCUSED_SENTENCE', sentence })
export const clearFocusedSentence = () => ({ type: 'CLEAR_FOCUSED_SENTENCE' })

export const postAnswers = lessonId => {
  const route = `/lesson/${lessonId}/exercise`
  const prefix = 'GET_LESSON_ANSWERS'

  return callBuilder(route, prefix, 'post')
}

export default (state = { previous: [], pending: false, error: false }, action) => {
  switch (action.type) {
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
