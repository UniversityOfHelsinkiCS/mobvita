import callBuilder from '../apiConnection'

export const getConcepts = (language) => {
  const route = `/concept_metadata/${language}`
  const prefix = 'GET_CONCEPTS'
  return callBuilder(route, prefix, 'get')
}

export default (state = { data: [], pending: false, error: false }, action) => {
  switch (action.type) {
    case 'GET_CONCEPTS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_CONCEPTS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_CONCEPTS_SUCCESS':
      return {
        ...state,
        concepts: action.response.concept_list,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
