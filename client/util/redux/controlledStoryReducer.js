import { ACTIONS } from 'react-joyride'
import callBuilder from '../apiConnection'

export const getStoryTokensAction = (storyId, mode) => {
  const route = `/stories/${storyId}?user_mode=${mode}`
  const prefix = 'GET_ACCEPTED_TOKENS'
  return callBuilder(route, prefix)
}

const initialState = {
  data: [],
  pending: false,
  error: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ACCEPTED_TOKENS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_ACCEPTED_TOKENS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_ACCEPTED_TOKENS_SUCCESS':
      return {
        ...state,
        data: action.response.paragraph,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
