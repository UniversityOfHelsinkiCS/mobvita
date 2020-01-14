import callBuilder from 'Utilities/apiConnection'

export const registerUser = (payload) => {
  const route = '/register'
  const prefix = 'POST_REGISTER'
  return callBuilder(route, prefix, 'post', payload)
}

export default (state = { data: undefined }, action) => {
  switch (action.type) {
    case 'POST_REGISTER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'POST_REGISTER_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        errorMessage: action.response.message,
      }
    case 'POST_REGISTER_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
