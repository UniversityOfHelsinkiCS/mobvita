import callBuilder from 'Utilities/apiConnection'

export const getCrossword = storyId => {
  const route = `/stories/${storyId}/crossword`
  const prefix = 'GET_CROSSWORD'
  return callBuilder(route, prefix)
}

export const revealClue = number => ({ type: 'REVEAL_CLUE', number })

const initialState = { data: {}, dimensions: {}, pending: false, error: false }

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
        clues: action.response.clue,
        entries: action.response.entries,
        dimensions: action.response.dimension,
        pending: false,
        error: false,
      }
    case 'GET_CROSSWORD_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'REVEAL_CLUE':
      return {
        ...state,
        clues: state.clues.map(clue =>
          clue.clue_number === action.number ? { ...clue, show: true } : clue
        ),
      }
    default:
      return state
  }
}
