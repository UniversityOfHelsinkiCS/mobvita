import callBuilder from 'Utilities/apiConnection'

export const getCrossword = (storyId) => {
  const route = `/stories/${storyId}/crossword`
  const prefix = 'GET_CROSSWORD'
  return callBuilder(route, prefix)
}

const initialState = { data: {}, pending: false, error: false }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CROSSWORD_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_CROSSWORD_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_CROSSWORD_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
