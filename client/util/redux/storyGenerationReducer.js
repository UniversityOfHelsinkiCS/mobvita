import callBuilder from '../apiConnection'


const initialState = { 
    text: '',
    pending: false,
    error: false,
}

// Story backend expects vocab_diff in 0.8-3.3; UI slider uses 0-100.
const STORY_BACKEND_MIN = 0.8
const STORY_BACKEND_MAX = 3.3

const uiScaleToBackendVocabDiff = uiValue => {
  const clamped = Math.min(100, Math.max(0, Number(uiValue) || 50))
  return Number((STORY_BACKEND_MIN + (clamped / 100) * (STORY_BACKEND_MAX - STORY_BACKEND_MIN)).toFixed(2))
}

export const generateStory = (instance) => {
    const route = `/stories/generate`
    const prefix = 'GENERATE_STORY'
    const { instancePending, ...rest } = instance
    const payload = { ...rest, vocab_diff: uiScaleToBackendVocabDiff(rest.vocab_diff) }
    return callBuilder(route, prefix, 'post', payload)
}


export default (state = initialState, action) => {
  switch (action.type) {
    case 'GENERATE_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GENERATE_STORY_FAILURE':
      return {
        ...initialState,
        error: true,
      }
    case 'GENERATE_STORY_SUCCESS':
        return {
            ...state,
            text: action.response.text,
            pending: false,
            error: false,
        }
    default:
      return state
  }
}
