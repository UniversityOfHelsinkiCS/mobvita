import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getTranslationAction = ({
  wordLemmas,
  learningLanguage,
  dictionaryLanguage,
  storyId,
  wordId,
  record,
  inflectionRef,
}) => {
  const query = {
    w: encodeURIComponent(wordLemmas),
    lang_learn: learningLanguage,
    lang_target: dictionaryLanguage,
    story_id: storyId,
    word_id: wordId,
    record,
    ref: inflectionRef,
  }
  const route = '/translate'
  const prefix = 'GET_TRANSLATION'
  return callBuilder(route, prefix, 'get', null, query)
}

export const clearTranslationAction = () => ({ type: 'CLEAR_TRANSLATION' })

export const setWords = (surface, lemmas, clue, maskSymbol) => {
  const words = { surface, lemmas }
  return {
    type: 'SET_WORDS',
    words,
    clue,
    maskSymbol,
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
        clue: action.clue,
        maskSymbol: action.maskSymbol,
      }
    case 'CLEAR_TRANSLATION': {
      return {
        ...state,
        data: [],
        surfaceWord: '',
        lemmas: '',
        clue: undefined,
        maskSymbol: false,
      }
    }
    default:
      return state
  }
}
