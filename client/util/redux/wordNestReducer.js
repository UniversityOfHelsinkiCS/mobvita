import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getWordNestAction = ({ word, language }) => {
  const query = {
    word,
    language,
  }
  const route = '/nests'
  const prefix = 'GET_WORD_NEST'
  return callBuilder(route, prefix, 'get', null, query)
}

export default (state = { data: [] }, action) => {
  switch (action.type) {
    case 'GET_WORD_NEST_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_WORD_NEST_SUCCESS':
      return {
        ...state,
        data: action.response.words,
        pending: false,
        error: false,
      }
    case 'GET_WORD_NEST_FAILURE':
      return {
        ...state,
        focused: action.response,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
