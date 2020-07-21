import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

const getTranslation = route => {
  const prefix = 'GET_TRANSLATION'
  return callBuilder(route, prefix, 'get')
}

export const getTranslationAction = (language, wordLemmas, locale, storyId, wordId) => {
  const story = storyId ? `&story_id=${storyId}&word_id=${wordId}` : ''
  const route = `/translate?w=${encodeURIComponent(
    wordLemmas
  )}&lang_learn=${language}&lang_target=${locale}${story}`
  return getTranslation(route)
}

export const getTranslationWithoutSaving = (language, wordLemmas, locale, storyId, wordId) => {
  const story = storyId ? `&story_id=${storyId}&word_id=${wordId}` : ''
  const route = `/translate?w=${encodeURIComponent(
    wordLemmas
  )}&lang_learn=${language}&lang_target=${locale}${story}&record=0`
  return getTranslation(route)
}

export const clearTranslationAction = () => ({ type: 'CLEAR_TRANSLATION' })

export const setWords = (surface, lemmas, hideLemma = false) => {
  const words = { surface, lemmas }
  return {
    type: 'SET_WORDS',
    words,
    hideLemma,
  }
}

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
    case 'SET_WORDS':
      return {
        ...state,
        surfaceWord: action.words.surface,
        lemmas: action.words.lemmas,
        hideLemma: action.hideLemma,
      }
    case 'CLEAR_TRANSLATION': {
      return {
        ...state,
        data: [],
        surfaceWord: '',
        lemmas: '',
      }
    }
    default:
      return state
  }
}
