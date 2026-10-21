import callBuilder from '../apiConnection'

export const sendEmail = (payload) => {
  const route = '/contact'
  const prefix = 'POST_EMAIL'
  return callBuilder(route, prefix, 'post', payload)
}

// Contact-form send state and the error shown under the form.
export default (state = { data: [], pending: false, error: false }, action) => {
  switch (action.type) {
    case 'POST_EMAIL_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'POST_EMAIL_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        // The failure payload is the response body (or undefined), not an axios error.
        errorMessage:
          typeof action.response?.message === 'string' ? action.response.message : 'Server error',
      }
    case 'POST_EMAIL_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
