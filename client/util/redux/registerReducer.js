import callBuilder from 'Utilities/apiConnection'

export const registerUser = (payload) => {
  const route = '/register'
  const prefix = 'POST_REGISTER'
  return callBuilder(route, prefix, 'post', payload)
}

const initialState = {
  pending: false,
  error: false,
  errorMessage: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'POST_REGISTER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
        errorMessage: null,
      }
    case 'POST_REGISTER_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        accountCreated: false,
        errorMessage: action.response.response.data,
      }
    case 'POST_REGISTER_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        accountCreated: true,
        errorMessage: null,
      }
    default:
      return state
  }
}
