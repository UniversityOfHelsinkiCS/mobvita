import callBuilder from '../apiConnection'

const PREFIX = 'WRITING_CORRECTION_CHECK'
const DEFAULT_LANGUAGE = 'Finnish'
const WRITING_CORRECTION_CACHE_STORAGE_KEY = 'writing-correction-cache-v3'
const WRITING_CORRECTION_CACHE_MAX_ENTRIES = 200

const hashString = value => {
  let hash = 2166136261

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }

  return (hash >>> 0).toString(36)
}

export const getWritingCorrectionKey = ({ text, context = '' }) =>
  `writing-correction-${hashString(`${context.trim()}\n${text.trim()}`)}`

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

export const useCachedWritingCorrection = ({ key, sentence = '', sentenceId }) => ({
  type: 'WRITING_CORRECTION_USE_CACHED',
  key,
  sentence,
  sentenceId,
})

const getStoredWritingCorrectionCache = () => {
  try {
    if (typeof window === 'undefined') return {}

    const cache = JSON.parse(
      window.localStorage.getItem(WRITING_CORRECTION_CACHE_STORAGE_KEY) || '{}',
    )

    return cache.correctionsByKey || {}
  } catch {
    return {}
  }
}

const saveStoredWritingCorrectionCache = correctionsByKey => {
  try {
    if (typeof window === 'undefined') return

    const cachedCorrectionsByKey = Object.values(correctionsByKey)
      .filter(entry => entry && !entry.pending && !entry.error)
      .sort((firstEntry, secondEntry) => (secondEntry.cachedAt || 0) - (firstEntry.cachedAt || 0))
      .slice(0, WRITING_CORRECTION_CACHE_MAX_ENTRIES)
      .reduce(
        (cache, entry) => ({
          ...cache,
          [entry.key]: entry,
        }),
        {},
      )

    window.localStorage.setItem(
      WRITING_CORRECTION_CACHE_STORAGE_KEY,
      JSON.stringify({ correctionsByKey: cachedCorrectionsByKey }),
    )
  } catch {
    // Ignore storage errors so writing correction still works normally.
  }
}

const initialState = {
  correctionSuggestionSentenceIds: [],
  correctionSuggestionSentenceOrder: [],
  correctionSuggestionsBySentenceId: {},
  correctionsByKey: getStoredWritingCorrectionCache(),
  latestCorrectionKeyBySentenceId: {},
}

// Backend delete/insert placeholder is U+25AC (▬).
const CORRECTION_PLACEHOLDER_VALUES = new Set([String.fromCodePoint(0x25ac)])

const wordValuesMatch = (original, corrected) =>
  String(original).normalize('NFC').trim() === String(corrected).normalize('NFC').trim()

export const normalizeCorrectionWord = word =>
  word.original &&
  word.corrected &&
  !CORRECTION_PLACEHOLDER_VALUES.has(String(word.original).trim()) &&
  !CORRECTION_PLACEHOLDER_VALUES.has(String(word.corrected).trim()) &&
  wordValuesMatch(word.original, word.corrected)
    ? { ...word, corrected: null }
    : word

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

export const getWritingCorrectionCorrectedText = res => res?.corrections?.[0]?.corrected || ''

export const writingCorrectionHasChanges = corrections =>
  getWritingCorrectionWords(corrections).some(word => Boolean(word.corrected))

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
    cachedAt: Date.now(),
    key,
    sentenceId,
    text,
    context,
    language,
    pending: false,
    error: false,
    errorDetails: null,
    corrections: getWritingCorrectionWords(action.response),
    correctedText: getWritingCorrectionCorrectedText(action.response),
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

const getSentenceId = entry => entry.sentenceId || entry.key

const updateLatestCorrectionKey = (state, entry) => ({
  ...state,
  latestCorrectionKeyBySentenceId: {
    ...(state.latestCorrectionKeyBySentenceId || {}),
    [getSentenceId(entry)]: entry.key,
  },
})

const requestIsLatestForSentence = (state, entry) =>
  state.latestCorrectionKeyBySentenceId?.[getSentenceId(entry)] === entry.key

const orderCorrectionSuggestionSentenceIds = (state, sentenceIds) => {
  const sentenceOrder = state.correctionSuggestionSentenceOrder || []
  const fallbackOrderBySentenceId = sentenceIds.reduce(
    (orderBySentenceId, sentenceId, index) => ({
      ...orderBySentenceId,
      [sentenceId]: index,
    }),
    {},
  )
  const essayOrderBySentenceId = sentenceOrder.reduce(
    (orderBySentenceId, sentenceId, index) => ({
      ...orderBySentenceId,
      [sentenceId]: index,
    }),
    {},
  )

  return sentenceIds.slice().sort((firstSentenceId, secondSentenceId) => {
    const firstEssayIndex = essayOrderBySentenceId[firstSentenceId]
    const secondEssayIndex = essayOrderBySentenceId[secondSentenceId]

    if (firstEssayIndex === undefined && secondEssayIndex === undefined) {
      return (
        fallbackOrderBySentenceId[firstSentenceId] - fallbackOrderBySentenceId[secondSentenceId]
      )
    }

    if (firstEssayIndex === undefined) return 1
    if (secondEssayIndex === undefined) return -1

    return firstEssayIndex - secondEssayIndex
  })
}

const upsertCorrectionSuggestion = (state, entry) => {
  const sentenceId = getSentenceId(entry)
  const correctionSuggestionSentenceIds = state.correctionSuggestionSentenceIds.includes(sentenceId)
    ? state.correctionSuggestionSentenceIds
    : state.correctionSuggestionSentenceIds.concat(sentenceId)

  return {
    ...state,
    correctionSuggestionSentenceIds: orderCorrectionSuggestionSentenceIds(
      state,
      correctionSuggestionSentenceIds,
    ),
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
    correctionSuggestionSentenceIds: state.correctionSuggestionSentenceIds.filter(
      id => id !== sentenceId,
    ),
    correctionSuggestionsBySentenceId: nextCorrectionSuggestionsBySentenceId,
  }
}

const syncCorrectionSuggestions = (state, sentenceIds) => {
  const sentenceIdSet = new Set(sentenceIds)
  const correctionSuggestionSentenceIds = sentenceIds.filter(
    sentenceId => state.correctionSuggestionsBySentenceId[sentenceId],
  )

  const correctionSuggestionsBySentenceId = correctionSuggestionSentenceIds.reduce(
    (suggestions, sentenceId) => ({
      ...suggestions,
      [sentenceId]: state.correctionSuggestionsBySentenceId[sentenceId],
    }),
    {},
  )
  const latestCorrectionKeyBySentenceId = Object.entries(
    state.latestCorrectionKeyBySentenceId || {},
  ).reduce(
    (latestKeys, [sentenceId, key]) =>
      sentenceIdSet.has(sentenceId)
        ? {
            ...latestKeys,
            [sentenceId]: key,
          }
        : latestKeys,
    {},
  )

  return {
    ...state,
    correctionSuggestionSentenceOrder: sentenceIds,
    correctionSuggestionSentenceIds,
    correctionSuggestionsBySentenceId,
    latestCorrectionKeyBySentenceId,
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case `${PREFIX}_ATTEMPT`: {
      const entry = createPendingEntry(action)

      return upsertCorrectionSuggestion(
        updateLatestCorrectionKey(
          {
            ...state,
            correctionsByKey: {
              ...state.correctionsByKey,
              [entry.key]: entry,
            },
          },
          entry,
        ),
        entry,
      )
    }

    case `${PREFIX}_SUCCESS`: {
      const entry = createSuccessEntry(action)
      const correctionsByKey = {
        ...state.correctionsByKey,
        [entry.key]: entry,
      }

      saveStoredWritingCorrectionCache(correctionsByKey)

      const nextState = {
        ...state,
        correctionsByKey,
      }

      if (!requestIsLatestForSentence(nextState, entry)) {
        return nextState
      }

      return writingCorrectionHasChanges(entry.corrections)
        ? upsertCorrectionSuggestion(nextState, entry)
        : removeCorrectionSuggestion(nextState, entry.sentenceId)
    }

    case `${PREFIX}_FAILURE`: {
      const entry = createFailureEntry(action)
      const nextState = {
        ...state,
        correctionsByKey: {
          ...state.correctionsByKey,
          [entry.key]: entry,
        },
      }

      return requestIsLatestForSentence(nextState, entry)
        ? upsertCorrectionSuggestion(nextState, entry)
        : nextState
    }

    case 'WRITING_CORRECTION_CLEAR': {
      const nextCorrectionsByKey = { ...state.correctionsByKey }
      delete nextCorrectionsByKey[action.key]
      saveStoredWritingCorrectionCache(nextCorrectionsByKey)

      const nextState = {
        ...state,
        correctionsByKey: nextCorrectionsByKey,
      }

      const suggestion = Object.values(state.correctionSuggestionsBySentenceId).find(
        correctionSuggestion => correctionSuggestion.key === action.key,
      )

      return suggestion ? removeCorrectionSuggestion(nextState, suggestion.sentenceId) : nextState
    }

    case 'WRITING_CORRECTION_SYNC_SUGGESTIONS':
      return syncCorrectionSuggestions(state, action.sentenceIds || [])

    case 'WRITING_CORRECTION_USE_CACHED': {
      const entry = state.correctionsByKey[action.key]

      if (!entry) return state

      const suggestionEntry = {
        ...entry,
        sentenceId: action.sentenceId || entry.sentenceId,
        text: action.sentence || entry.text,
      }
      const nextState = updateLatestCorrectionKey(state, suggestionEntry)

      if (entry.pending || entry.error || writingCorrectionHasChanges(entry.corrections)) {
        return upsertCorrectionSuggestion(nextState, suggestionEntry)
      }

      return removeCorrectionSuggestion(nextState, suggestionEntry.sentenceId)
    }

    default:
      return state
  }
}
