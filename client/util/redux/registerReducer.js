import callBuilder from 'Utilities/apiConnection'

export const registerUser = payload => {
  const route = '/register'
  const prefix = 'POST_REGISTER'
  return callBuilder(route, prefix, 'post', payload)
}

const initialState = {
  pending: false,
  error: false,
  message: null,
}

const failureMessage = message => message || 'Server error'

export default (state = initialState, action) => {
  switch (action.type) {
    case 'POST_REGISTER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
        message: null,
      }
    case 'POST_REGISTER_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        accountCreated: false,
        message: failureMessage(action.response),
      }
    case 'POST_REGISTER_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        accountCreated: true,
        message: null,
      }
    default:
      return state
  }
}
