import callBuilder from '../apiConnection'
import { learningLanguageLocaleCodes } from '../common'
/**
 * Actions and reducers are in the same file for readability
 */

const loadAvailableLanguage = ({languages}) => {
  const availableLanguage = []
  const langCode2Language = {}
  Object.entries(learningLanguageLocaleCodes).forEach(([from, to]) => {
    langCode2Language[to] = from
  })
  Object.entries(languages).forEach(([from, to]) => {
    to.forEach(lang => {
      availableLanguage.push([langCode2Language[from], langCode2Language[lang]].join('-'))
    })
  })
  return availableLanguage
}

export const getMTAvailableLanguage = () => {
  const route = '/mtStatus'
  const prefix = 'GET_CONTEXT_TRANSLATION_STATUS'
  return callBuilder(route, prefix, 'get')
}

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


export default (state = { data: null, avail: [] }, action) => {
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
    case 'GET_CONTEXT_TRANSLATION_STATUS_ATTEMPT':
      return {
        ...state,
      }
    case 'GET_CONTEXT_TRANSLATION_STATUS_SUCCESS':
      return {
        ...state,
        avail: loadAvailableLanguage(action.response),
      }
    case 'GET_CONTEXT_TRANSLATION_STATUS_FAILURE':
      return {
        ...state,
        avail: []
      }
    default:
      return state
  }
}
