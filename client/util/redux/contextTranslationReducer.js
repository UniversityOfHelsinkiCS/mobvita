import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */


export const getContextTranslation = (
  sentence,
  learningLanguage,
  dictionaryLanguage,
) => {
  const data = {
    source: sentence,
    from: learningLanguage,
    to: dictionaryLanguage,
  }

  const route = '/ctxTranslate'
  const prefix = 'GET_CONTEXT_TRANSLATION'
  return callBuilder(route, prefix, 'post', data)
}

export const clearContextTranslation = () => ({ type: 'CLEAR_CONTEXT_TRANSLATION' })


export default (state = { data: null }, action) => {
  switch (action.type) {
    case 'GET_CONTEXT_TRANSLATION_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_CONTEXT_TRANSLATION_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_CONTEXT_TRANSLATION_FAILURE':
      return {
        ...state,
        focused: action.response,
        pending: false,
        error: true,
      }
    case 'CLEAR_CONTEXT_TRANSLATION': {
      return {
        ...state,
        data: null,
      }
    }
    default:
      return state
  }
}
