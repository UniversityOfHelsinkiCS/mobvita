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
  prefLemma,
}) => {
  const query = {
    w: wordLemmas,
    lang_learn: learningLanguage,
    lang_target: dictionaryLanguage,
    story_id: storyId,
    word_id: wordId,
    record,
    ref: inflectionRef,
    pref_lemma: prefLemma,
  }
  const route = '/translate'
  const prefix = 'GET_TRANSLATION'
  return callBuilder(route, prefix, 'get', null, query)
}

export const getClueTranslationAction = ({
  wordLemmas,
  learningLanguage,
  dictionaryLanguage,
  storyId,
  wordId,
  record,
  inflectionRef,
}) => {
  const query = {
    w: wordLemmas,
    lang_learn: learningLanguage,
    lang_target: dictionaryLanguage,
    story_id: storyId,
    word_id: wordId,
    record,
    ref: inflectionRef,
  }
  const route = '/translate'
  const prefix = 'GET_CLUE_TRANSLATION'
  return callBuilder(route, prefix, 'get', null, query)
}

export const changeTranslationStageAction = (lemma, lang_learn, lang_target, stage) => ({
  type: 'SET_TRANSLATION_STAGE',
  lemma,
  lang_learn,
  lang_target,
  stage
})

export const getSentenceTranslation = (
  sentence,
  learningLanguage,
  dictionaryLanguage,
) => {
  const data = {
    source: sentence,
    from: learningLanguage,
    to: dictionaryLanguage,
  }

  const route = '/sentTranslate'
  const prefix = 'GET_SENT_TRANSLATION'
  return callBuilder(route, prefix, 'post', data)
}

export const clearTranslationAction = () => ({ type: 'CLEAR_TRANSLATION' })

export const setWords = ({ surface, lemmas, clue, maskSymbol }) => {
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
        type: 'word',
        pending: true,
        error: false,
      }
    case 'GET_TRANSLATION_SUCCESS':
      return {
        ...state,
        data: action.response['responses'],
        type: 'word',
        pending: false,
        error: false,
      }
    case 'GET_TRANSLATION_FAILURE':
      return {
        ...state,
        focused: action.response,
        type: 'word',
        pending: false,
        error: true,
      }
    case 'GET_SENT_TRANSLATION_ATTEMPT':
      return {
        ...state,
        type: 'sent',
        pending: true,
        error: false,
      }
    case 'GET_SENT_TRANSLATION_SUCCESS':
      return {
        ...state,
        data: action.response,
        type: 'sent',
        pending: false,
        error: false,
      }
    case 'GET_SENT_TRANSLATION_FAILURE':
      return {
        ...state,
        focused: action.response,
        type: 'sent',
        pending: false,
        error: true,
      }
    case 'GET_CLUE_TRANSLATION_ATTEMPT':
      return {
        ...state,
        type: 'word',
        pending: true,
        error: false,
      }
    case 'GET_CLUE_TRANSLATION_SUCCESS':
      if (!action.response['responses']) {
        return {
          ...state,
          type: 'word',
          data: 'no-clue-translation',
          pending: false,
          error: false,
        }
      }
      return {
        ...state,
        type: 'word',
        data: action.response['responses'],
        pending: false,
        error: false,
      }
    case 'GET_CLUE_TRANSLATION_FAILURE':
      return {
        ...state,
        type: 'word',
        focused: action.response,
        pending: false,
        error: true,
      }
    case 'SET_WORDS':
      return {
        ...state,
        type: 'word',
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
        type: null
      }
    }
    case 'SET_TRANSLATION_STAGE': {
      return {
        ...state,
        type: 'word',
        data: state.data.map(
          translated => (translated.lemma !== action.lemma || 
            translated.language_in !== action.lang_learn || 
            translated.language_out !== action.lang_target)
          && translated || { ...translated, stage: action.stage, is_new_word: false }),
      }
    }
    default:
      return state
  }
}
