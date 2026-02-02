import callBuilder from '../apiConnection'

export const generateMcQuestionsAction = ({ storyId, level, size, questions }) => {
  const route = `/stories/${storyId}/mc_generate`
  const prefix = 'MC_GENERATE'

  const body = {
    level,
    size,
    ...(Array.isArray(questions) && questions.length > 0 ? { questions } : {}),
  }

  return callBuilder(route, prefix, 'post', body)
}

export const regenerateOneMcQuestionAction = ({ storyId, level, question, index }) => {
  const route = `/stories/${storyId}/mc_generate`
  const prefix = 'MC_REGENERATE_ONE'

  const body = {
    level,
    size: 1,
    questions: [question],
    index,
  }

  return callBuilder(route, prefix, 'post', body)
}

export const saveMcQuestionsAction = ({ storyId, questions }) => {
  const route = `/stories/${storyId}/save_questions`
  const prefix = 'MC_SAVE_QUESTIONS'

  return callBuilder(route, prefix, 'post', { questions })
}

const initialState = {
  generated: [],
  pending: false,
  error: false,
  errorDetails: null,
  saved: false,
  regenPendingByIndex: {},
}

const getIndexFromAction = action => {
  const idx =
    action?.request?.body?.index ??
    action?.request?.index ??
    action?.meta?.index ??
    action?.payload?.index ??
    action?.index

  return typeof idx === 'number' ? idx : null
}

const getOneQuestionFromResponse = payload => {
  if (Array.isArray(payload) && payload.length > 0) return payload[0]
  if (Array.isArray(payload?.questions) && payload.questions.length > 0) return payload.questions[0]
  return null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'MC_GENERATE_ATTEMPT':
      return { ...state, pending: true, error: false, errorDetails: null, saved: false }

    case 'MC_GENERATE_SUCCESS': {
      const payload = action.response
      const generated = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.questions)
          ? payload.questions
          : []

      return { ...state, generated, pending: false, error: false, errorDetails: null }
    }

    case 'MC_GENERATE_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        errorDetails: action.response,
      }

    case 'MC_REGENERATE_ONE_ATTEMPT': {
      const idx = getIndexFromAction(action)
      if (idx === null) return { ...state, error: false, errorDetails: null }

      return {
        ...state,
        regenPendingByIndex: { ...(state.regenPendingByIndex || {}), [idx]: true },
        error: false,
        errorDetails: null,
      }
    }

    case 'MC_REGENERATE_ONE_SUCCESS': {
      const idx = getIndexFromAction(action)
      const one = getOneQuestionFromResponse(action.response)

      const nextGenerated =
        idx !== null && one && Array.isArray(state.generated)
          ? state.generated.map((q, i) => (i === idx ? one : q))
          : state.generated

      const nextRegen = { ...(state.regenPendingByIndex || {}) }
      if (idx !== null) delete nextRegen[idx]

      return {
        ...state,
        generated: nextGenerated,
        regenPendingByIndex: nextRegen,
        error: false,
        errorDetails: null,
      }
    }

    case 'MC_REGENERATE_ONE_FAILURE': {
      const idx = getIndexFromAction(action)
      const nextRegen = { ...(state.regenPendingByIndex || {}) }
      if (idx !== null) delete nextRegen[idx]

      return {
        ...state,
        regenPendingByIndex: nextRegen,
        error: true,
        errorDetails: action.response,
      }
    }

    case 'MC_SAVE_QUESTIONS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
        errorDetails: null,
        saved: false,
      }

    case 'MC_SAVE_QUESTIONS_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        errorDetails: null,
        saved: true,
      }

    case 'MC_SAVE_QUESTIONS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        errorDetails: action.response,
        saved: false,
      }

    default:
      return state
  }
}