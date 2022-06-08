import callBuilder from 'Utilities/apiConnection'
import produce from 'immer'

export const getCrossword = (storyId, options = {}) => {
  const { density, size, width, height } = options
  const query = {
    candidate_density: density,
    size,
    width: width || 15,
    height: height || 38,
  }

  const route = `/stories/${storyId}/crossword`
  const prefix = 'GET_CROSSWORD'
  return callBuilder(route, prefix, 'get', null, query)
}

export const sendActivity = (
  storyId,
  crossword_id,
  learningLanguage,
  entry,
  entries,
  start_time,
) => {
  const route = `/stories/${storyId}/crossword`
  const prefix = 'SEND_ACTIVITY'

  const payload = {
    crossword_id,
    language: learningLanguage,
    num_total: Object.keys(entries).length,
    answers: entry,
    start_time,
    end_time: new Date(),
  }

  return callBuilder(route, prefix, 'post', payload)
}

export const revealClue = (direction, number) => ({ type: 'REVEAL_CLUE', direction, number })

const initialState = {
  data: {},
  dimensions: {},
  title: '',
  pending: false,
  error: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CROSSWORD_ATTEMPT':
      return {
        ...initialState,
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
        title: action.response.title,
        crossword_id: action.response.crossword_id,
        pending: false,
        error: false,
        start_time: new Date(),
      }
    case 'GET_CROSSWORD_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'REVEAL_CLUE':
      return produce(state, draft => {
        const clue = draft.clues.find(
          clue => clue.clue_number === action.number && clue.clue_direction === action.direction
        )
        clue.show = true
      })
    default:
      return state
  }
}
