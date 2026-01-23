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
