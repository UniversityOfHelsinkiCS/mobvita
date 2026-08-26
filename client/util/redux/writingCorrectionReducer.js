import callBuilder from '../apiConnection'

const PREFIX = 'WRITING_CORRECTION_CHECK'
const DEFAULT_LANGUAGE = 'Finnish'
const WRITING_CORRECTION_CACHE_STORAGE_KEY = 'writing-correction-cache-v15'
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

// Build the essay's current sentences for saving: each sentence's text, the backend sentence id of
// that current version, the ids of its earlier versions (oldest first) and its cached corrections.
// The backend resolves the ids, so the first id of each sentence gives the essay's original version
// and the last one its current version. Lineage is read from the sentence-id map rather than the
// correction cache: a cache entry is keyed by text + context, so it is lost whenever an earlier
// sentence is inserted or removed, while the sentence id survives.
export const buildWritingEssaySentences = (
  sentences,
  correctionsByKey = {},
  sentenceHistoryBySentenceId = {},
) =>
  sentences.map(sentence => {
    const entry = correctionsByKey[getWritingCorrectionKey(sentence)]
    const lineage = sentenceHistoryBySentenceId[sentence.sentenceId]

    // Deliberately no sentence_id. The API documents the field, but sending it is what broke saving
    // on this branch — it is the only thing this payload adds over the version that saves fine. The
    // backend can read the current version off original_text; history is what it needs the ids for.
    return {
      original_text: sentence.text,
      history: lineage?.history ?? [],
      corrections: entry?.responseCorrections ?? [],
    }
  })

// Save the essay (sentences + per-sentence history + cached suggestions). With an essayId this
// updates that essay in place via POST /essays/{essay_id}; without one it creates a new essay. The
// update endpoint takes title + sentences only — session_id belongs to the original creation.
export const saveWritingEssay = ({
  language = DEFAULT_LANGUAGE,
  essayId = null,
  sessionId = '',
  sentences = [],
  title = '',
}) =>
  essayId
    ? callBuilder(
        `/writing/${language}/essays/${essayId}`,
        SAVE_PREFIX,
        'post',
        // An update replaces what it is given, so only send a title we actually have. Sending an
        // empty one blanks the stored title, and an essay with neither title nor sentences is
        // filtered out of the library entirely (writingEssayHasContent) — it looks deleted.
        { sentences, ...(title ? { title } : {}) },
        { essayId },
      )
    : callBuilder(`/writing/${language}/essays`, SAVE_PREFIX, 'post', {
        session_id: sessionId,
        sentences,
        title,
      })

// Restore the sentence lineage of an essay opened to continue editing, keyed by the editor's local
// sentence ids. Without this the reopened sentences look brand new, and the next save would
// overwrite the essay's recorded original version with an empty history.
export const restoreWritingSentenceLineage = lineageBySentenceId => ({
  type: 'WRITING_CORRECTION_RESTORE_LINEAGE',
  lineageBySentenceId,
})

// Whether a failed essay save was actually a duplicate-title rejection. Anything else is a real
// failure and must not be reported to the user as a name collision.
export const writingEssaySaveFailedOnTitle = message =>
  typeof message === 'string' && /taken|already exist|duplicate/i.test(message)

// Drop the edit history of sentences that came out of a split or a merge: per the essay-writing
// spec they are not later versions of what they replaced, so they are their own original.
export const markWritingSentencesNotOriginal = sentenceIds => ({
  type: 'WRITING_CORRECTION_SENTENCES_NOT_ORIGINAL',
  sentenceIds,
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

// Delete one saved essay by id via GET /writing/{lang}/essays/{id}/remove (per the API — path params
// only, no query/body). Pair with removeEssayFromList to drop it from the list immediately.
export const removeWritingEssay = (language = DEFAULT_LANGUAGE, essayId) =>
  callBuilder(`/writing/${language}/essays/${essayId}/remove`, 'WRITING_DELETE_ESSAY', 'get')

// Remove an essay from the library list locally (optimistic, paired with removeWritingEssay).
export const removeEssayFromList = essayId => ({ type: 'WRITING_ESSAY_REMOVE_LOCAL', essayId })

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

// A saved essay's earliest recorded text per sentence: the backend expands each history id into
// the sentence it points at, so the first entry is the sentence as it was first written. A sentence
// with no history is its own original — it was never edited, or it came out of a split/merge.
const getEssaySentenceOriginalText = sentence => {
  const history = Array.isArray(sentence?.history) ? sentence.history : []
  const firstVersion = history[0]

  if (firstVersion && typeof firstVersion === 'object') {
    return firstVersion.original_text ?? firstVersion.text ?? getEssaySentenceCurrentText(sentence)
  }

  return getEssaySentenceCurrentText(sentence)
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

// The essay's original + current text as index-aligned per-sentence arrays (sentence i is the same
// sentence in both versions), so a UI can align/highlight the matching sentence across the versions.
export const getWritingEssaySentenceVersions = essay => {
  const sentences = Array.isArray(essay?.sentences) ? essay.sentences : []
  return {
    original: sentences.map(getEssaySentenceOriginalText),
    current: sentences.map(getEssaySentenceCurrentText),
  }
}

// A saved essay's per-sentence lineage in essay order: the backend id and text of each sentence's
// current version plus the ids of its earlier versions. GET returns each history entry expanded to
// { sentence_id, original_text }, while the save payload wants bare ids, so map back down to ids.
export const getWritingEssaySentenceLineage = essay =>
  (Array.isArray(essay?.sentences) ? essay.sentences : []).map(sentence => ({
    beSentenceId: sentence?.sentence_id ?? null,
    text: getEssaySentenceCurrentText(sentence),
    history: (Array.isArray(sentence?.history) ? sentence.history : [])
      .map(version => (version && typeof version === 'object' ? version.sentence_id : version))
      .filter(Boolean),
    isOriginal: true,
  }))

// Request a correction for a sentence (POST), carrying the session id that groups this writing
// session's requests. The response's sentence_id is what the sentence's edit history is built from.
export const checkWritingCorrection = ({
  language = DEFAULT_LANGUAGE,
  sentenceId,
  text,
  context = '',
  sessionId = '',
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

// Read the persisted corrections cache + sentence lineage map from localStorage. The lineage has to
// survive a reload too: without it every restored sentence would look brand new and start a fresh
// history, which would make the saved original version identical to the current one.
const getStoredWritingCorrectionState = () => {
  try {
    if (typeof window === 'undefined') return {}

    const cache = JSON.parse(
      window.localStorage.getItem(WRITING_CORRECTION_CACHE_STORAGE_KEY) || '{}',
    )

    return {
      correctionsByKey: cache.correctionsByKey || {},
      sentenceHistoryBySentenceId: cache.sentenceHistoryBySentenceId || {},
    }
  } catch {
    return {}
  }
}

// Persist the newest resolved corrections (capped) + the whole sentence lineage map to
// localStorage; storage errors are ignored. The lineage map is a few ids per sentence, so it isn't
// capped.
const saveStoredWritingCorrectionState = (correctionsByKey, sentenceHistoryBySentenceId) => {
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
      JSON.stringify({
        correctionsByKey: cachedCorrectionsByKey,
        sentenceHistoryBySentenceId: sentenceHistoryBySentenceId || {},
      }),
    )
  } catch {
    return
  }
}

// Persist the parts of the state that must survive a reload and return it unchanged, so a reducer
// case can wrap the state it is about to return.
const persistWritingCorrectionState = state => {
  saveStoredWritingCorrectionState(state.correctionsByKey, state.sentenceHistoryBySentenceId)
  return state
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

const storedWritingCorrectionState = getStoredWritingCorrectionState()

const initialState = {
  correctionSuggestionSentenceIds: [],
  correctionSuggestionSentenceOrder: [],
  correctionSuggestionsBySentenceId: {},
  correctionsByKey: storedWritingCorrectionState.correctionsByKey || {},
  latestCorrectionKeyBySentenceId: {},
  // Per stable sentence id: { beSentenceId, text, history, isOriginal } — the backend id and text
  // of this sentence's current version, the ids of its earlier versions (oldest first), and whether
  // it is still a version of something the student wrote (false once it came out of a split/merge).
  sentenceHistoryBySentenceId: storedWritingCorrectionState.sentenceHistoryBySentenceId || {},
  sessionId: '',
  sessionPending: false,
  savePending: false,
  saveError: false,
  saveErrorMessage: null,
  savedEssayId: null,
  essays: [],
  essaysPending: false,
  essaysError: false,
  deletedEssayIds: [],
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

// The FE metadata (key, sentenceId, language, ...) attached to a correction action.
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

// The sentence's lineage after a correction came back for it: the backend id and text of this
// version, plus every earlier backend id, oldest first — Sentence A edited to A' and then to A''
// has the history [id(A), id(A')]. A sentence that came out of a split or a merge is not a later
// version of anything: it keeps an empty history for good, so it is reported as its own original.
const getNextSentenceLineage = (previousLineage, beSentenceId, text) => {
  if (!beSentenceId) {
    return previousLineage ?? { beSentenceId: null, text, history: [], isOriginal: true }
  }

  if (previousLineage?.isOriginal === false) {
    return { beSentenceId, text, history: [], isOriginal: false }
  }

  const previousBeSentenceId = previousLineage?.beSentenceId ?? null
  const previousHistory = previousLineage?.history ?? []
  // Only an actual rewrite is a new version. Re-correcting a sentence whose own text didn't change
  // (its context moved when a sentence around it was added or removed) mints a fresh backend id for
  // the same words, and recording that would fill the history with duplicates of one version.
  const isNewVersion =
    Boolean(previousBeSentenceId) &&
    previousBeSentenceId !== beSentenceId &&
    previousLineage?.text !== text

  return {
    beSentenceId,
    text,
    history: isNewVersion ? [...previousHistory, previousBeSentenceId] : previousHistory,
    isOriginal: true,
  }
}

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
        saveErrorMessage: null,
      }

    case `${SAVE_PREFIX}_SUCCESS`:
      return {
        ...state,
        savePending: false,
        saveError: false,
        saveErrorMessage: null,
        // A create echoes the new id; an update answers with the essay it updated, so fall back to
        // the id we posted to.
        savedEssayId:
          getWritingEssayId(action.response?.essay ?? action.response) ??
          getActionQuery(action).essayId ??
          null,
      }

    case `${SAVE_PREFIX}_FAILURE`:
      return {
        ...state,
        savePending: false,
        saveError: true,
        saveErrorMessage: action.response?.message || null,
      }

    case 'WRITING_GET_ESSAYS_ATTEMPT':
      return {
        ...state,
        essaysPending: true,
        essaysError: false,
      }

    case 'WRITING_GET_ESSAYS_SUCCESS': {
      const fetched = Array.isArray(action.response)
        ? action.response
        : action.response?.essays ?? []
      return {
        ...state,
        // Drop essays deleted this session so an in-flight/late list fetch can't re-add them.
        essays: fetched.filter(essay => !state.deletedEssayIds.includes(getWritingEssayId(essay))),
        essaysPending: false,
        essaysError: false,
      }
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

    case 'WRITING_ESSAY_REMOVE_LOCAL': {
      const { essayId } = action
      const openedWasDeleted = getWritingEssayId(state.openedEssay) === essayId
      return {
        ...state,
        essays: state.essays.filter(essay => getWritingEssayId(essay) !== essayId),
        deletedEssayIds: state.deletedEssayIds.includes(essayId)
          ? state.deletedEssayIds
          : [...state.deletedEssayIds, essayId],
        openedEssay: openedWasDeleted ? null : state.openedEssay,
      }
    }

    case 'WRITING_CORRECTION_RESTORE_LINEAGE': {
      const lineageBySentenceId = action.lineageBySentenceId || {}

      if (!Object.keys(lineageBySentenceId).length) return state

      return persistWritingCorrectionState({
        ...state,
        sentenceHistoryBySentenceId: {
          ...(state.sentenceHistoryBySentenceId || {}),
          ...lineageBySentenceId,
        },
      })
    }

    case 'WRITING_CORRECTION_SENTENCES_NOT_ORIGINAL': {
      const sentenceIds = (action.sentenceIds || []).filter(Boolean)

      if (!sentenceIds.length) return state

      const sentenceHistoryBySentenceId = sentenceIds.reduce(
        (lineages, sentenceId) => ({
          ...lineages,
          [sentenceId]: {
            beSentenceId: lineages[sentenceId]?.beSentenceId ?? null,
            text: lineages[sentenceId]?.text,
            history: [],
            isOriginal: false,
          },
        }),
        { ...(state.sentenceHistoryBySentenceId || {}) },
      )

      return persistWritingCorrectionState({ ...state, sentenceHistoryBySentenceId })
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

      const lineage = getNextSentenceLineage(
        state.sentenceHistoryBySentenceId?.[localSentenceId],
        baseEntry.beSentenceId,
        baseEntry.text,
      )
      // Stamp the history on the cache entry as well: a cache hit on the same text + context is how
      // the lineage is recovered for a sentence the sentence-id map has lost track of.
      const entry = { ...baseEntry, history: lineage.history }

      const nextState = persistWritingCorrectionState({
        ...state,
        correctionsByKey: {
          ...state.correctionsByKey,
          [entry.key]: entry,
        },
        // A stale response (the sentence was edited again since) must not roll the lineage back.
        ...(isLatest && {
          sentenceHistoryBySentenceId: {
            ...(state.sentenceHistoryBySentenceId || {}),
            [localSentenceId]: lineage,
          },
        }),
      })

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
      return { ...initialState, correctionsByKey: {}, sentenceHistoryBySentenceId: {} }

    case 'WRITING_CORRECTION_CLEAR': {
      const nextCorrectionsByKey = { ...state.correctionsByKey }
      delete nextCorrectionsByKey[action.key]

      const nextState = persistWritingCorrectionState({
        ...state,
        correctionsByKey: nextCorrectionsByKey,
      })

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
      const previousLineage = state.sentenceHistoryBySentenceId?.[cachedLocalSentenceId]
      // A cache hit on a sentence we already track is just another version of it. On one we don't
      // (a restored draft, or a sentence re-completed after its terminator was deleted and retyped)
      // the cached entry's own recorded history is what the lineage is restored from.
      const lineage = previousLineage
        ? getNextSentenceLineage(
            previousLineage,
            entry.beSentenceId ?? previousLineage.beSentenceId,
            entry.text,
          )
        : {
            beSentenceId: entry.beSentenceId ?? null,
            text: entry.text,
            history: entry.history || [],
            isOriginal: true,
          }

      const nextState = persistWritingCorrectionState({
        ...updateLatestCorrectionKey(state, suggestionEntry),
        sentenceHistoryBySentenceId: {
          ...(state.sentenceHistoryBySentenceId || {}),
          [cachedLocalSentenceId]: lineage,
        },
      })

      if (entry.pending || entry.error || writingCorrectionHasChanges(entry.corrections)) {
        return upsertCorrectionSuggestion(nextState, suggestionEntry)
      }

      return removeCorrectionSuggestion(nextState, suggestionEntry.sentenceId)
    }

    default:
      return state
  }
}
