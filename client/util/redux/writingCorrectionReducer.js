import callBuilder from '../apiConnection'

const PREFIX = 'WRITING_CORRECTION_CHECK'
const DEFAULT_LANGUAGE = 'Finnish'
const WRITING_CORRECTION_CACHE_STORAGE_KEY = 'writing-correction-cache-v16'
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

// Build the essay's current sentences for saving: each sentence's text, the roots it descends from,
// and its cached corrections. history carries the roots — the versions the student first wrote the
// sentence as. They are set by its first correction and inherited from then on, so they are right
// even when the last edit was never corrected, and a split's halves share a root while a merge
// carries both, which is what lets the original be rebuilt across a moved sentence boundary.
// Lineage comes from the sentence-id map rather than the correction cache: a cache entry is keyed
// by text + context, so it is lost whenever a sentence around it changes, while the id survives.
// No sentence_id is sent: the API documents the field, but sending it is what broke saving on this
// branch, and the backend reads the current version off original_text anyway.
export const buildWritingEssaySentences = (
  sentences,
  correctionsByKey = {},
  sentenceHistoryBySentenceId = {},
) =>
  sentences.map(sentence => {
    const entry = correctionsByKey[getWritingCorrectionKey(sentence)]
    const lineage = sentenceHistoryBySentenceId[sentence.sentenceId]

    return {
      original_text: sentence.text,
      history: lineage?.roots ?? [],
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

// Record which sentences an edit produced from which, so the ones that come out of a split or a
// merge inherit the roots of the ones that went in instead of losing them.
export const setWritingSentenceAncestry = ancestryBySentenceId => ({
  type: 'WRITING_CORRECTION_SENTENCE_ANCESTRY',
  ancestryBySentenceId,
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

// The essay's original version, as an ordered list of sentences. Each saved sentence names the
// roots it came from, and the backend expands them to the text it recorded, so walking the current
// sentences in order and emitting each root once rebuilds what the student first wrote — including
// across a moved sentence boundary, where the halves of a split share one root (emitted once) and a
// merged sentence carries both of its parents' (emitted in turn). A sentence with no roots was
// never corrected, so it stands as its own original.
// Where a root's text sits inside the sentence it was merged into, or -1 if it can't be found —
// the student may have reworded it since. Matched without case or trailing sentence punctuation,
// since merging is exactly what turns a full stop into a comma.
const getRootTextPosition = (rootText, currentText) => {
  const needle = String(rootText || '')
    .trim()
    .replace(/[.!?]+$/, '')
    .toLowerCase()

  if (!needle) return -1

  const haystack = currentText.toLowerCase()
  const position = haystack.indexOf(needle)

  // A reworded root still anchors on its opening words, which merging leaves alone.
  return position === -1 ? haystack.indexOf(needle.slice(0, 12)) : position
}

// A sentence carries more than one root only where the student merged sentences together, and the
// backend does not promise to return them in the order they were sent — a Mongo $in lookup answers
// in index order, not argument order. Their real order is written in the merged sentence itself:
// the text of the sentence that came first appears first. Ordering by id would not do, because the
// ids are minted when each correction finishes and a short sentence overtakes a long one whenever
// the editor corrects a burst of them at once. If any root can no longer be located, the order the
// backend gave is left alone rather than half-sorted.
const orderRootsByPosition = (versions, currentText) => {
  if (versions.length < 2) return versions

  const positioned = versions.map((version, index) => ({
    version,
    index,
    position: getRootTextPosition(version?.original_text, currentText),
  }))

  if (positioned.some(entry => entry.position === -1)) return versions

  return positioned
    .sort((first, second) => first.position - second.position || first.index - second.index)
    .map(entry => entry.version)
}

export const getWritingEssayOriginalSentences = essay => {
  const emittedRoots = new Set()

  return (Array.isArray(essay?.sentences) ? essay.sentences : []).reduce((originals, sentence) => {
    const history = Array.isArray(sentence?.history) ? sentence.history : []

    if (!history.length) return originals.concat(getEssaySentenceCurrentText(sentence))

    const roots = orderRootsByPosition(history, getEssaySentenceCurrentText(sentence))

    return originals.concat(
      roots.reduce((texts, version) => {
        const rootId = version && typeof version === 'object' ? version.sentence_id : version
        const text = version && typeof version === 'object' ? version.original_text : null

        if (!text || (rootId && emittedRoots.has(rootId))) return texts
        if (rootId) emittedRoots.add(rootId)
        return texts.concat(text)
      }, []),
    )
  }, [])
}

// Extract the title + original/current version text from a fetched essay.
export const getWritingEssayVersions = essay => {
  const sentences = Array.isArray(essay?.sentences) ? essay.sentences : []

  const currentFromSentences = sentences.map(getEssaySentenceCurrentText).join(' ').trim()
  const original = getWritingEssayOriginalSentences(essay).join(' ').trim()
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
    // The two versions can differ in length wherever the student moved a sentence boundary, so
    // these line up by index only for an essay whose sentences were edited in place.
    original: getWritingEssayOriginalSentences(essay),
    current: sentences.map(getEssaySentenceCurrentText),
  }
}

// A saved essay's per-sentence lineage in essay order: the backend id and text of each sentence's
// current version plus the roots it descends from. GET expands each stored history entry to
// { sentence_id, original_text }, so map back down to the bare ids the editor tracks.
export const getWritingEssaySentenceLineage = essay =>
  (Array.isArray(essay?.sentences) ? essay.sentences : []).map(sentence => ({
    beSentenceId: sentence?.sentence_id ?? null,
    text: getEssaySentenceCurrentText(sentence),
    roots: (Array.isArray(sentence?.history) ? sentence.history : [])
      .map(version => (version && typeof version === 'object' ? version.sentence_id : version))
      .filter(Boolean),
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
    roots: [],
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

// The sentence's lineage after a correction came back: the backend id and text of this version,
// plus the roots it descends from — the backend ids of the sentences it was first written as. Roots
// are what the essay's original version is rebuilt from, so the first correction a sentence ever
// gets sets them and everything after only inherits: an edit keeps them, a split gives both halves
// the same root, a merge gives the result both of its parents'.
const getNextSentenceLineage = (previousLineage, beSentenceId, text) => {
  if (!beSentenceId) {
    return previousLineage ?? { beSentenceId: null, text, roots: [] }
  }

  const previousRoots = previousLineage?.roots ?? []

  return {
    beSentenceId,
    text,
    // The first correction records the sentence as the student wrote it; that version is its root.
    roots: previousRoots.length ? previousRoots : [beSentenceId],
  }
}

// The roots of a set of ancestor sentences, in order and without repeats — the halves of a split
// share one, and the essay's original must not gain a copy per half.
const getInheritedRoots = (lineages, ancestorSentenceIds) =>
  ancestorSentenceIds.reduce((roots, ancestorSentenceId) => {
    const ancestorRoots = lineages[ancestorSentenceId]?.roots ?? []
    return roots.concat(ancestorRoots.filter(root => !roots.includes(root)))
  }, [])

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

    case 'WRITING_CORRECTION_SENTENCE_ANCESTRY': {
      const ancestry = Object.entries(action.ancestryBySentenceId || {})

      if (!ancestry.length) return state

      // Resolved against the lineages as they were before this edit: a split reuses its parent's
      // sentence id for one of its halves, so resolving them one at a time would read its own result.
      const lineages = state.sentenceHistoryBySentenceId || {}
      const sentenceHistoryBySentenceId = ancestry.reduce(
        (next, [sentenceId, ancestorSentenceIds]) => {
          const roots = getInheritedRoots(lineages, ancestorSentenceIds)

          return roots.length
            ? { ...next, [sentenceId]: { ...(lineages[sentenceId] ?? {}), roots } }
            : next
        },
        { ...lineages },
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
      const entry = { ...baseEntry, roots: lineage.roots }

      const nextState = persistWritingCorrectionState({
        ...state,
        correctionsByKey: {
          ...state.correctionsByKey,
          [entry.key]: entry,
        },
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
      const lineage = previousLineage
        ? getNextSentenceLineage(
            previousLineage,
            entry.beSentenceId ?? previousLineage.beSentenceId,
            entry.text,
          )
        : {
            beSentenceId: entry.beSentenceId ?? null,
            text: entry.text,
            roots: entry.roots?.length ? entry.roots : [entry.beSentenceId].filter(Boolean),
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
