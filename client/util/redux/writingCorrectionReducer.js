import callBuilder from '../apiConnection'

const PREFIX = 'WRITING_CORRECTION_CHECK'
const DEFAULT_LANGUAGE = 'Finnish'
const WRITING_CORRECTION_CACHE_STORAGE_KEY = 'writing-correction-cache-v14'
const WRITING_CORRECTION_CACHE_MAX_ENTRIES = 200

// FNV-1a hash of a string, returned base-36.
const hashString = value => {
  let hash = 2166136261

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }

  return (hash >>> 0).toString(36)
}

// Cache key for a sentence's correction: a hash of its context + text.
export const getWritingCorrectionKey = ({ text, context = '' }) =>
  `writing-correction-${hashString(`${context.trim()}\n${text.trim()}`)}`

// Fetch a backend session id that groups this session's correction + chatbot calls.
export const getWritingCorrectionSession = (language = DEFAULT_LANGUAGE) =>
  callBuilder(`/writing/${language}/session`, 'WRITING_CORRECTION_SESSION', 'get')

const SAVE_PREFIX = 'WRITING_ESSAY_SAVE'

// Build the essay's current sentences (each with edit history + cached corrections) for saving.
export const buildWritingEssaySentences = (sentences, correctionsByKey = {}) =>
  sentences.map(sentence => {
    const entry = correctionsByKey[getWritingCorrectionKey(sentence)]

    return {
      original_text: sentence.text,
      history: entry?.history ?? [],
      corrections: entry?.responseCorrections ?? [],
    }
  })

// Save the current essay (sentences + per-sentence history + cached suggestions) to the backend.
export const saveWritingEssay = ({
  language = DEFAULT_LANGUAGE,
  sessionId = '',
  sentences = [],
  title = '',
}) =>
  callBuilder(`/writing/${language}/essays`, SAVE_PREFIX, 'post', {
    session_id: sessionId,
    sentences,
    title,
  })

// Fetch all the user's saved essays (backend limits these to the owner + assigned teachers).
export const getWritingEssays = (language = DEFAULT_LANGUAGE) =>
  callBuilder(`/writing/${language}/essays`, 'WRITING_GET_ESSAYS', 'get')

// Fetch a single saved essay by id — the backend returns its original and current versions.
export const getWritingEssay = (language = DEFAULT_LANGUAGE, essayId) =>
  callBuilder(`/writing/${language}/essays/${essayId}`, 'WRITING_GET_ESSAY', 'get')

// Close the currently opened essay detail.
export const clearWritingEssay = () => ({ type: 'WRITING_CLEAR_ESSAY' })

// The id used to fetch/delete a saved essay, across possible backend field names.
export const getWritingEssayId = essay => essay?.essay_id || essay?._id || essay?.id || null

// Parse a backend timestamp into a Date. Numbers (or all-digit strings) below ~1e12 are Unix
// seconds and are scaled to milliseconds; larger numbers are already milliseconds; anything else
// (ISO strings) is handed to Date directly.
const parseBackendDate = value => {
  if (value === null || value === undefined || value === '') return null
  const asNumber =
    typeof value === 'number' ? value : /^\d+$/.test(String(value)) ? Number(value) : null
  if (asNumber !== null) return new Date(asNumber < 1e12 ? asNumber * 1000 : asNumber)
  return new Date(value)
}

// The save date of an essay: an explicit date field if present, otherwise derived from the Mongo
// ObjectId (its first 4 bytes encode the creation timestamp — the moment the essay was saved).
// Returns a Date or null.
export const getWritingEssaySavedDate = essay => {
  const explicit = parseBackendDate(
    essay?.date ?? essay?.saved_at ?? essay?.created_at ?? essay?.createdAt ?? essay?.timestamp,
  )
  if (explicit && !Number.isNaN(explicit.getTime())) return explicit

  const id = getWritingEssayId(essay)
  if (typeof id === 'string' && /^[0-9a-f]{8}/i.test(id)) {
    const seconds = parseInt(id.slice(0, 8), 16)
    if (!Number.isNaN(seconds)) return new Date(seconds * 1000)
  }
  return null
}

// Delete one saved essay by id — removed from the list on success. Mirrors removeStory's
// GET /stories/{id}/remove convention.
export const removeWritingEssay = (language = DEFAULT_LANGUAGE, essayId) =>
  callBuilder(
    `/writing/${language}/essays/${essayId}/remove`,
    'WRITING_DELETE_ESSAY',
    'get',
    undefined,
    { essayId },
  )

// Share one saved essay with a list of user emails (fire-and-forget, like ShareStory).
export const shareWritingEssay = (language = DEFAULT_LANGUAGE, essayId, emails = []) =>
  callBuilder(`/writing/${language}/essays/${essayId}/share`, 'WRITING_SHARE_ESSAY', 'post', {
    share_with: emails,
  })

// Move an essay into a library folder by setting its "/"-separated path. Mirrors updateStoryPath;
// the essayId is echoed in the query so the reducer can update the right item optimistically.
// BACKEND CONTRACT: POST /writing/{language}/essays/{essayId} with { path } persists essay.path,
// and GET /writing/{language}/essays must return `path` per essay.
export const updateWritingEssayPath = (language = DEFAULT_LANGUAGE, essayId, path = '') =>
  callBuilder(
    `/writing/${language}/essays/${essayId}`,
    'WRITING_ESSAY_UPDATE_PATH',
    'post',
    { path },
    { essayId, path },
  )

// An essay actually uploaded from essay-writing has content — a title and/or sentences. Used to hide
// empty placeholder essays from the library.
export const writingEssayHasContent = essay =>
  Boolean(essay && (essay.title || (Array.isArray(essay.sentences) && essay.sentences.length > 0)))

// A saved essay's current text per sentence.
const getEssaySentenceCurrentText = sentence => sentence?.original_text ?? sentence?.text ?? ''

// A saved essay's earliest recorded text per sentence: the first history entry if it was ever
// edited, otherwise its current text (unedited sentences have no history).
const getEssaySentenceOriginalText = sentence => {
  const history = Array.isArray(sentence?.history) ? sentence.history : []
  return history[0]?.original_text ?? getEssaySentenceCurrentText(sentence)
}

// Extract the title + original/current version text from a fetched essay. The backend returns the
// current full text (essay_text) plus per-sentence edit history; the original version is
// reconstructed from each sentence's earliest history entry.
export const getWritingEssayVersions = essay => {
  const sentences = Array.isArray(essay?.sentences) ? essay.sentences : []

  const currentFromSentences = sentences.map(getEssaySentenceCurrentText).join(' ').trim()
  const original = sentences.map(getEssaySentenceOriginalText).join(' ').trim()
  const current =
    (typeof essay?.essay_text === 'string' && essay.essay_text.trim()) || currentFromSentences

  return {
    title: essay?.title || getEssaySentenceCurrentText(sentences[0]) || '',
    original,
    current,
  }
}

// Request a correction for a sentence (POST), carrying the session id and in-place-edit flag.
export const checkWritingCorrection = ({
  language = DEFAULT_LANGUAGE,
  sentenceId,
  text,
  context = '',
  sessionId = '',
  isEdit = false,
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
      session_id: sessionId || '',
    },
    {
      key,
      sentenceId: sentenceId || key,
      language,
      text: normalizedText,
      context: normalizedContext,
      isEdit,
    },
  )
}

// Clear the whole writing-correction cache + session (Redux state and localStorage).
export const clearWritingCorrectionData = () => ({ type: 'WRITING_CORRECTION_CLEAR_ALL' })

// Clear the cached correction for a single sentence key.
export const clearWritingCorrection = key => ({
  type: 'WRITING_CORRECTION_CLEAR',
  key,
})

// Sync the correction suggestions to the current list of sentence ids.
export const syncWritingCorrectionSuggestions = sentenceIds => ({
  type: 'WRITING_CORRECTION_SYNC_SUGGESTIONS',
  sentenceIds,
})

// Reuse a sentence's already-cached correction without re-requesting it.
export const useCachedWritingCorrection = ({ key, sentence = '', sentenceId }) => ({
  type: 'WRITING_CORRECTION_USE_CACHED',
  key,
  sentence,
  sentenceId,
})

// Read the persisted corrections cache from localStorage.
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

// Persist the newest resolved corrections (capped) to localStorage; storage errors are ignored.
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
    return
  }
}

// Remove the persisted corrections cache from localStorage; storage errors are ignored.
const clearStoredWritingCorrectionCache = () => {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(WRITING_CORRECTION_CACHE_STORAGE_KEY)
  } catch {
    return
  }
}

const initialState = {
  correctionSuggestionSentenceIds: [],
  correctionSuggestionSentenceOrder: [],
  correctionSuggestionsBySentenceId: {},
  correctionsByKey: getStoredWritingCorrectionCache(),
  latestCorrectionKeyBySentenceId: {},
  sentenceHistoryBySentenceId: {},
  sessionId: '',
  sessionPending: false,
  savePending: false,
  saveError: false,
  savedEssayId: null,
  essays: [],
  essaysPending: false,
  essaysError: false,
  openedEssay: null,
  openedEssayPending: false,
  openedEssayError: false,
}

// Backend delete/insert placeholder is U+25AC (▬).
const CORRECTION_PLACEHOLDER_VALUES = new Set([String.fromCodePoint(0x25ac)])

// Whether original and corrected are the same word (NFC-normalized).
const wordValuesMatch = (original, corrected) =>
  String(original).normalize('NFC').trim() === String(corrected).normalize('NFC').trim()

// Drop a no-op correction (original === corrected) so it isn't shown as a change.
export const normalizeCorrectionWord = word =>
  word.original &&
  word.corrected &&
  !CORRECTION_PLACEHOLDER_VALUES.has(String(word.original).trim()) &&
  !CORRECTION_PLACEHOLDER_VALUES.has(String(word.corrected).trim()) &&
  wordValuesMatch(word.original, word.corrected)
    ? { ...word, corrected: null }
    : word

// Extract the normalized correction tokens from a response's several possible shapes.
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

// The corrected full-sentence text from a correction response.
export const getWritingCorrectionCorrectedText = res => res?.corrections?.[0]?.corrected || ''

// Read the backend sentence id from a correction response (defensive; may be absent).
export const getCorrectionResponseSentenceId = res =>
  res?.corrections?.[0]?.sentence_id ?? res?.sentence_id ?? null

// Whether a correction actually changes anything.
export const writingCorrectionHasChanges = corrections =>
  getWritingCorrectionWords(corrections).some(word => Boolean(word.corrected))

// The FE metadata (key, sentenceId, isEdit, ...) attached to a correction action.
const getActionQuery = action => action.query || action.requestSettings?.query || {}

// Build the in-flight (pending) correction entry from a request.
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

// Build a resolved correction entry from a response (tokens, backend id, raw corrections).
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
    beSentenceId: getCorrectionResponseSentenceId(action.response),
    responseCorrections: action.response?.corrections ?? [],
    history: [],
    requestId: action.requestId,
  }
}

// Build a failed correction entry from an error response.
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

// The entry's local sentence id (falls back to its cache key).
const getSentenceId = entry => entry.sentenceId || entry.key

// Mark this entry's key as the sentence's latest correction.
const updateLatestCorrectionKey = (state, entry) => ({
  ...state,
  latestCorrectionKeyBySentenceId: {
    ...(state.latestCorrectionKeyBySentenceId || {}),
    [getSentenceId(entry)]: entry.key,
  },
})

// Whether this entry is still the sentence's latest correction (not a stale response).
const requestIsLatestForSentence = (state, entry) =>
  state.latestCorrectionKeyBySentenceId?.[getSentenceId(entry)] === entry.key

// Order suggestion sentence ids by their position in the essay (fall back to arrival order).
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

// Add/update the suggestion for a sentence and keep the suggestion list ordered.
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

// Remove a sentence's suggestion from the list.
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

// Restrict the suggestions + latest-keys to the current set of essay sentence ids.
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

// Writing-correction reducer: corrections cache, suggestions, session, save state, and per-sentence
// backend-id edit history.
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

    case 'WRITING_CORRECTION_SESSION_ATTEMPT':
      return {
        ...state,
        sessionPending: true,
      }

    case 'WRITING_CORRECTION_SESSION_SUCCESS':
      return {
        ...state,
        sessionId: action.response?.session_id || state.sessionId,
        sessionPending: false,
      }

    case 'WRITING_CORRECTION_SESSION_FAILURE':
      return {
        ...state,
        sessionPending: false,
      }

    case `${SAVE_PREFIX}_ATTEMPT`:
      return {
        ...state,
        savePending: true,
        saveError: false,
      }

    case `${SAVE_PREFIX}_SUCCESS`:
      return {
        ...state,
        savePending: false,
        saveError: false,
        savedEssayId: action.response?.essay_id ?? null,
      }

    case `${SAVE_PREFIX}_FAILURE`:
      return {
        ...state,
        savePending: false,
        saveError: true,
      }

    case 'WRITING_GET_ESSAYS_ATTEMPT':
      return {
        ...state,
        essaysPending: true,
        essaysError: false,
      }

    case 'WRITING_GET_ESSAYS_SUCCESS':
      return {
        ...state,
        essays: Array.isArray(action.response)
          ? action.response
          : action.response?.essays ?? [],
        essaysPending: false,
        essaysError: false,
      }

    case 'WRITING_GET_ESSAYS_FAILURE':
      return {
        ...state,
        essaysPending: false,
        essaysError: true,
      }

    case 'WRITING_GET_ESSAY_ATTEMPT':
      return {
        ...state,
        openedEssay: null,
        openedEssayPending: true,
        openedEssayError: false,
      }

    case 'WRITING_GET_ESSAY_SUCCESS':
      return {
        ...state,
        openedEssay: action.response?.essay ?? action.response ?? null,
        openedEssayPending: false,
        openedEssayError: false,
      }

    case 'WRITING_GET_ESSAY_FAILURE':
      return {
        ...state,
        openedEssayPending: false,
        openedEssayError: true,
      }

    case 'WRITING_CLEAR_ESSAY':
      return {
        ...state,
        openedEssay: null,
        openedEssayPending: false,
        openedEssayError: false,
      }

    case 'WRITING_DELETE_ESSAY_SUCCESS': {
      const deletedId = getActionQuery(action).essayId
      const openedWasDeleted = getWritingEssayId(state.openedEssay) === deletedId
      return {
        ...state,
        essays: state.essays.filter(essay => getWritingEssayId(essay) !== deletedId),
        openedEssay: openedWasDeleted ? null : state.openedEssay,
      }
    }

    case 'WRITING_ESSAY_UPDATE_PATH_ATTEMPT': {
      const { essayId, path } = getActionQuery(action)
      return {
        ...state,
        essays: state.essays.map(essay =>
          getWritingEssayId(essay) === essayId ? { ...essay, path } : essay,
        ),
      }
    }

    case `${PREFIX}_SUCCESS`: {
      const baseEntry = createSuccessEntry(action)
      const localSentenceId = getSentenceId(baseEntry)
      const isLatest = state.latestCorrectionKeyBySentenceId?.[localSentenceId] === baseEntry.key

      const previous = state.sentenceHistoryBySentenceId?.[localSentenceId]
      const history =
        isLatest && getActionQuery(action).isEdit && previous?.beSentenceId
          ? [...previous.history, previous.beSentenceId]
          : []
      const entry = { ...baseEntry, history }

      const correctionsByKey = {
        ...state.correctionsByKey,
        [entry.key]: entry,
      }

      saveStoredWritingCorrectionCache(correctionsByKey)

      const nextState = {
        ...state,
        correctionsByKey,
        ...(isLatest && {
          sentenceHistoryBySentenceId: {
            ...(state.sentenceHistoryBySentenceId || {}),
            [localSentenceId]: { beSentenceId: entry.beSentenceId, history },
          },
        }),
      }

      if (!isLatest) {
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

    case 'WRITING_CORRECTION_CLEAR_ALL':
      clearStoredWritingCorrectionCache()
      return { ...initialState, correctionsByKey: {} }

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
      const cachedLocalSentenceId = getSentenceId(suggestionEntry)
      const nextState = {
        ...updateLatestCorrectionKey(state, suggestionEntry),
        sentenceHistoryBySentenceId: {
          ...(state.sentenceHistoryBySentenceId || {}),
          [cachedLocalSentenceId]: {
            beSentenceId: entry.beSentenceId ?? null,
            history: entry.history || [],
          },
        },
      }

      if (entry.pending || entry.error || writingCorrectionHasChanges(entry.corrections)) {
        return upsertCorrectionSuggestion(nextState, suggestionEntry)
      }

      return removeCorrectionSuggestion(nextState, suggestionEntry.sentenceId)
    }

    default:
      return state
  }
}
