import produce from 'immer'
import callBuilder from '../apiConnection'

export const setPrevious = previous => ({ type: 'SET_PREVIOUS', payload: previous })
export const addToPrevious = sentence => ({ type: 'ADD_TO_PREVIOUS', sentence })
export const setFocusedSentence = sentence => ({ type: 'SET_FOCUSED_SENTENCE', sentence })
export const clearFocusedSentence = () => ({ type: 'CLEAR_FOCUSED_SENTENCE' })

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
      console.log(' act ', action)
      return {
        ...state,
        focused: action.sentence,
      }
    case 'CLEAR_FOCUSED_SENTENCE':
      return {
        ...state,
        focused: undefined,
      }
    default:
      return state
  }
}
