import callBuilder from '../apiConnection'

const PREFIX = 'WRITING_CORRECTION_CHECK'
const DEFAULT_LANGUAGE = 'Finnish'

const hashString = value => {
  let hash = 2166136261

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }

  return (hash >>> 0).toString(36)
}

export const getWritingCorrectionKey = ({ text, context = '' }) => (
  `writing-correction-${hashString(`${context.trim()}\n${text.trim()}`)}`
)

export const checkWritingCorrection = ({
  language = DEFAULT_LANGUAGE,
  sentenceId,
  text,
  context = '',
}) => {
  const normalizedText = text.trim()
  const normalizedContext = context.trim()
  const key = getWritingCorrectionKey({
    text: normalizedText,
    context: normalizedContext,
  })

  return callBuilder(
    `/writing/${language}/correction`,
    PREFIX,
    'post',
    {
      text: normalizedText,
      context: normalizedContext,
    },
    {
      key,
      sentenceId: sentenceId || key,
      language,
      text: normalizedText,
      context: normalizedContext,
    },
  )
}

export const clearWritingCorrection = key => ({
  type: 'WRITING_CORRECTION_CLEAR',
  key,
})

export const syncWritingCorrectionSuggestions = sentenceIds => ({
  type: 'WRITING_CORRECTION_SYNC_SUGGESTIONS',
  sentenceIds,
})

export const hideWritingCorrectionSuggestion = sentenceId => ({
  type: 'WRITING_CORRECTION_HIDE_SUGGESTION',
  sentenceId,
})

export const useCachedWritingCorrection = ({ key, sentence = '', sentenceId }) => ({
  type: 'WRITING_CORRECTION_USE_CACHED',
  key,
  sentence,
  sentenceId,
})

const initialState = {
  correctionSuggestionSentenceIds: [],
  correctionSuggestionsBySentenceId: {},
  correctionsByKey: {},
}

const wordValuesMatch = (original, corrected) => (
  String(original).trim() === String(corrected).trim()
)

export const normalizeCorrectionWord = word => (
  word.original && word.corrected && word.original !== '-' &&
  word.corrected !== '-' && wordValuesMatch(word.original, word.corrected)
    ? { ...word, corrected: null }
    : word
)

export const getWritingCorrectionWords = res => {
  const corrections = Array.isArray(res?.[0]?.corrections)
    ? res[0].corrections
    : Array.isArray(res?.corrections?.[0]?.corrections)
      ? res.corrections[0].corrections
      : Array.isArray(res?.[0])
        ? res[0]
        : Array.isArray(res?.corrections)
          ? res.corrections
          : Array.isArray(res)
            ? res
            : []

  return corrections.map(normalizeCorrectionWord)
}

export const writingCorrectionHasChanges = corrections => (
  getWritingCorrectionWords(corrections).some(word => Boolean(word.corrected))
)

const getActionQuery = action => action.query || action.requestSettings?.query || {}

const createPendingEntry = action => {
  const { key, sentenceId, text, context, language } = getActionQuery(action)

  return {
    key,
    sentenceId,
    text,
    context,
    language,
    pending: true,
    error: false,
    errorDetails: null,
    corrections: [],
    requestId: action.requestId,
  }
}

const createSuccessEntry = action => {
  const { key, sentenceId, text, context, language } = getActionQuery(action)

  return {
    key,
    sentenceId,
    text,
    context,
    language,
    pending: false,
    error: false,
    errorDetails: null,
    corrections: getWritingCorrectionWords(action.response),
    requestId: action.requestId,
  }
}

const createFailureEntry = action => {
  const { key, sentenceId, text, context, language } = getActionQuery(action)

  return {
    key,
    sentenceId,
    text,
    context,
    language,
    pending: false,
    error: true,
    errorDetails: action.response || true,
    requestId: action.requestId,
  }
}

const upsertCorrectionSuggestion = (state, entry) => {
  const sentenceId = entry.sentenceId || entry.key

  return {
    ...state,
    correctionSuggestionSentenceIds: state.correctionSuggestionSentenceIds.includes(sentenceId)
      ? state.correctionSuggestionSentenceIds
      : state.correctionSuggestionSentenceIds.concat(sentenceId),
    correctionSuggestionsBySentenceId: {
      ...state.correctionSuggestionsBySentenceId,
      [sentenceId]: {
        key: entry.key,
        sentence: entry.text,
        sentenceId,
      },
    },
  }
}

const removeCorrectionSuggestion = (state, sentenceId) => {
  if (!sentenceId || !state.correctionSuggestionsBySentenceId[sentenceId]) {
    return state
  }

  const nextCorrectionSuggestionsBySentenceId = {
    ...state.correctionSuggestionsBySentenceId,
  }

  delete nextCorrectionSuggestionsBySentenceId[sentenceId]

  return {
    ...state,
    correctionSuggestionSentenceIds: state.correctionSuggestionSentenceIds.filter(id => id !== sentenceId),
    correctionSuggestionsBySentenceId: nextCorrectionSuggestionsBySentenceId,
  }
}

const syncCorrectionSuggestions = (state, sentenceIds) => {
  const sentenceIdSet = new Set(sentenceIds)
  const correctionSuggestionSentenceIds = state.correctionSuggestionSentenceIds
    .filter(sentenceId => sentenceIdSet.has(sentenceId))

  const correctionSuggestionsBySentenceId = correctionSuggestionSentenceIds
    .reduce((suggestions, sentenceId) => ({
      ...suggestions,
      [sentenceId]: state.correctionSuggestionsBySentenceId[sentenceId],
    }), {})

  return {
    ...state,
    correctionSuggestionSentenceIds,
    correctionSuggestionsBySentenceId,
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case `${PREFIX}_ATTEMPT`: {
      const entry = createPendingEntry(action)

      return {
        ...state,
        correctionsByKey: {
          ...state.correctionsByKey,
          [entry.key]: entry,
        },
      }
    }

    case `${PREFIX}_SUCCESS`: {
      const entry = createSuccessEntry(action)
      const nextState = {
        ...state,
        correctionsByKey: {
          ...state.correctionsByKey,
          [entry.key]: entry,
        },
      }

      return writingCorrectionHasChanges(entry.corrections)
        ? upsertCorrectionSuggestion(nextState, entry)
        : removeCorrectionSuggestion(nextState, entry.sentenceId)
    }

    case `${PREFIX}_FAILURE`: {
      const entry = createFailureEntry(action)

      return upsertCorrectionSuggestion({
        ...state,
        correctionsByKey: {
          ...state.correctionsByKey,
          [entry.key]: entry,
        },
      }, entry)
    }

    case 'WRITING_CORRECTION_CLEAR': {
      const nextCorrectionsByKey = { ...state.correctionsByKey }
      delete nextCorrectionsByKey[action.key]

      const nextState = {
        ...state,
        correctionsByKey: nextCorrectionsByKey,
      }

      const suggestion = Object.values(state.correctionSuggestionsBySentenceId)
        .find(correctionSuggestion => correctionSuggestion.key === action.key)

      return suggestion
        ? removeCorrectionSuggestion(nextState, suggestion.sentenceId)
        : nextState
    }

    case 'WRITING_CORRECTION_SYNC_SUGGESTIONS':
      return syncCorrectionSuggestions(state, action.sentenceIds || [])

    case 'WRITING_CORRECTION_HIDE_SUGGESTION':
      return removeCorrectionSuggestion(state, action.sentenceId)

    case 'WRITING_CORRECTION_USE_CACHED': {
      const entry = state.correctionsByKey[action.key]

      if (!entry) return state

      const suggestionEntry = {
        ...entry,
        sentenceId: action.sentenceId || entry.sentenceId,
        text: action.sentence || entry.text,
      }

      if (entry.error || writingCorrectionHasChanges(entry.corrections)) {
        return upsertCorrectionSuggestion(state, suggestionEntry)
      }

      return removeCorrectionSuggestion(state, suggestionEntry.sentenceId)
    }

    default:
      return state
  }
}
