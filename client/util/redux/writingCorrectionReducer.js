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

export const checkWritingCorrection = ({ language = DEFAULT_LANGUAGE, text, context = '' }) => {
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

const initialState = {
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

const getActionQuery = action => action.query || action.requestSettings?.query || {}

const createPendingEntry = action => {
  const { key, text, context, language } = getActionQuery(action)

  return {
    key,
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
  const { key, text, context, language } = getActionQuery(action)

  return {
    key,
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
  const { key, text, context, language } = getActionQuery(action)

  return {
    key,
    text,
    context,
    language,
    pending: false,
    error: true,
    errorDetails: action.response || true,
    requestId: action.requestId,
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

      return {
        ...state,
        correctionsByKey: {
          ...state.correctionsByKey,
          [entry.key]: entry,
        },
      }
    }

    case `${PREFIX}_FAILURE`: {
      const entry = createFailureEntry(action)

      return {
        ...state,
        correctionsByKey: {
          ...state.correctionsByKey,
          [entry.key]: entry,
        },
      }
    }

    case 'WRITING_CORRECTION_CLEAR': {
      const nextCorrectionsByKey = { ...state.correctionsByKey }
      delete nextCorrectionsByKey[action.key]

      return {
        ...state,
        correctionsByKey: nextCorrectionsByKey,
      }
    }

    default:
      return state
  }
}
