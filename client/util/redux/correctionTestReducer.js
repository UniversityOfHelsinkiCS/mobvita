import callBuilder from '../apiConnection'

export const testCorrection = (language, text) => {
  const route = `/debug/${language}/correction?text=${text}`
  const prefix = 'TEST_CORRECTION'
  return callBuilder(route, prefix, 'get')
}

export const resetCorrectionResults = () => ({ type: 'RESET_CORRECTION_RESULTS' })

const initialState = {
  corrections: null,
  corrected: null,
  pending: false,
  error: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TEST_CORRECTION_ATTEMPT':
      return {
        pending: true,
        error: false,
      }

    case 'TEST_CORRECTION_FAILURE':
      return {
        pending: false,
        error: true,
      }

    case 'TEST_CORRECTION_SUCCESS':
      return {
        pending: false,
        error: false,
        corrections: action.response.corrections,
        corrected: action.response.corrected,
      }

    case 'RESET_CORRECTION_RESULTS':
      return {
        pending: false,
        error: false,
        corrections: null,
        corrected: null,
      }

    default:
      return state
  }
}
