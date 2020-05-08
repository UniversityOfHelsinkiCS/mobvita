import { translatableLanguages } from 'Utilities/common'
import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getTranslationAction = (language, wordLemmas, locale, storyId, wordId) => {
  const story = storyId ? `&story_id=${storyId}&word_id=${wordId}` : ''
  const route = `/translate?w=${encodeURIComponent(wordLemmas)}&lang_learn=${language}&lang_target=${locale}${story}`
  const prefix = 'GET_TRANSLATION'
  return callBuilder(route, prefix, 'get')
}

export const clearTranslationAction = () => ({ type: 'CLEAR_TRANSLATION' })

export const setSurfaceWord = word => ({ type: 'SET_SURFACE_WORD', word })


export default (state = { data: [] }, action) => {
  switch (action.type) {
    case 'GET_TRANSLATION_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
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
        error: true,
      }
    case 'SET_SURFACE_WORD':
      return {
        ...state,
        surfaceWord: action.word,
      }
    case 'CLEAR_TRANSLATION': {
      return {
        ...state,
        data: [],
        surfaceWord: '',
      }
    }
    default:
      return state
  }
}
