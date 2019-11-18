import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getTranslationAction = (language,wordLemmas) => {
  const route = `/translation/${language}/${wordLemmas}`
  const prefix = 'GET_TRANSLATION'
  return callBuilder(route, prefix)
}

export default (state = { data: [] }, action) => {
  switch (action.type) {
    case 'GET_TRANSLATION_SUCCESS':
      return {
        ...state,
        data: action.response['responses-json'],
        pending: false,
        error: false,
      }
    case 'GET_TRANSLATION_FAILURE':
      return {
        ...state,
        focused: action.response,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
