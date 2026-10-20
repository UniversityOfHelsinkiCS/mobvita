import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getTranslationAction = ({
  wordLemmas,
  bases,
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
    bases,
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

// Word nest's own lookup, kept in `state.nest` so it never replaces the story word's cards.
export const getNestTranslationAction = ({ wordLemmas, learningLanguage, dictionaryLanguage }) => {
  const query = { w: wordLemmas, lang_learn: learningLanguage, lang_target: dictionaryLanguage }
  return callBuilder('/translate', 'GET_NEST_TRANSLATION', 'get', null, query)
}

// Multi-word expression the clicked word belongs to (BE attaches `word.mwe` as a string).
// Fetched alongside the single-word translation and kept in `state.mwe` so it never replaces it.
export const getMweTranslationAction = ({
  mwe,
  learningLanguage,
  dictionaryLanguage,
  storyId,
  wordId,
}) => {
  const query = {
    MWE: mwe,
    lang_learn: learningLanguage,
    lang_target: dictionaryLanguage,
    story_id: storyId,
    word_id: wordId,
  }
  const route = '/mwe'
  const prefix = 'GET_MWE_TRANSLATION'
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

export const clearTranslationAction = () => ({ type: 'CLEAR_TRANSLATION' })

export const setWords = ({ surface, lemmas, clue, maskSymbol, snippet_id, sentence_id, word_id, session_id, storyid }) => {
  const words = { surface, lemmas }
  return {
    type: 'SET_WORDS',
    words,
    clue,
    maskSymbol,
    snippet_id,
    sentence_id,
    word_id,
    session_id,
    storyid 
  }
}

const initialNest = { data: [], pending: false, error: false }

// `stage` is set locally by know / don't know (SET_TRANSLATION_STAGE); /mwe itself returns none.
const initialMwe = {
  expression: null,
  glosses: [],
  langLearn: null,
  langTarget: null,
  stage: undefined,
  pending: false,
  error: false,
}

// Sets the know / don't know stage on the matching lemma card.
const withStage = (data, action) =>
  Array.isArray(data)
    ? data.map(translated =>
        translated.lemma === action.lemma &&
        translated.language_in === action.lang_learn &&
        translated.language_out === action.lang_target
          ? { ...translated, stage: action.stage, is_new_word: false }
          : translated,
      )
    : data

export default (
  state = { data: [], showDictionaryBox: true, mwe: initialMwe, nest: initialNest },
  action,
) => {
  switch (action.type) {
    case 'GET_MWE_TRANSLATION_ATTEMPT':
      return {
        ...state,
        mwe: {
          ...initialMwe,
          expression: action.requestSettings.query.MWE,
          langLearn: action.requestSettings.query.lang_learn,
          langTarget: action.requestSettings.query.lang_target,
          pending: true,
        },
      }
    case 'GET_MWE_TRANSLATION_SUCCESS':
      // A later click may have moved on to another expression (or a word without one).
      if (action.query?.MWE !== state.mwe?.expression) return state
      return {
        ...state,
        mwe: { ...state.mwe, glosses: action.response?.glosses || [], pending: false },
      }
    case 'GET_MWE_TRANSLATION_FAILURE':
      if (action.query?.MWE !== state.mwe?.expression) return state
      return {
        ...state,
        mwe: { ...state.mwe, pending: false, error: true },
      }
    case 'GET_NEST_TRANSLATION_ATTEMPT':
      return { ...state, nest: { ...(state.nest || initialNest), pending: true, error: false } }
    case 'GET_NEST_TRANSLATION_SUCCESS':
      return {
        ...state,
        nest: { data: action.response['responses'], pending: false, error: false },
      }
    case 'GET_NEST_TRANSLATION_FAILURE':
      return { ...state, nest: { ...(state.nest || initialNest), pending: false, error: true } }
    case 'GET_TRANSLATION_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_TRANSLATION_SUCCESS':
      return {
        ...state,
        data: action.response['responses'],
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
    case 'GET_CLUE_TRANSLATION_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_CLUE_TRANSLATION_SUCCESS':
      if (!action.response['responses']) {
        return {
          ...state,
          data: 'no-clue-translation',
          pending: false,
          error: false,
        }
      }
      return {
        ...state,
        data: action.response['responses'],
        pending: false,
        error: false,
      }
    case 'GET_CLUE_TRANSLATION_FAILURE':
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
        snippet_id: action.snippet_id,
        sentence_id: action.sentence_id,
        word_id: action.word_id,
        session_id: action.session_id,
        storyid: action.storyid,  
        // A new word was clicked: drop the previous word's expression. The click handler
        // dispatches `getMweTranslationAction` right after when the new word has one.
        mwe: initialMwe,
      }
    case 'CLEAR_TRANSLATION': {
      return {
        ...state,
        data: [],
        surfaceWord: '',
        lemmas: '',
        clue: undefined,
        maskSymbol: false,
        type: null,
        snippet_id: null,
        sentence_id: null,
        word_id: null,
        session_id: null,
        storyid: null,
        mwe: initialMwe,
      }
    }
    case 'SET_TRANSLATION_STAGE': {
      return {
        ...state,
        data: withStage(state.data, action),
        nest: state.nest && { ...state.nest, data: withStage(state.nest.data, action) },
        mwe:
          state.mwe?.expression === action.lemma &&
          state.mwe.langLearn === action.lang_learn &&
          state.mwe.langTarget === action.lang_target
            ? { ...state.mwe, stage: action.stage }
            : state.mwe,
      }
    }

    case 'SHOW_DICTIONARY_BOX':
      return {
        ...state,
        showDictionaryBox: true
      }
    case 'CLOSE_DICTIONARY_BOX':
      return {
        ...state,
        showDictionaryBox: false
      }

    default:
      return state
  }
}
