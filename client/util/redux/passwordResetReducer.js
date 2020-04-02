import callBuilder from 'Utilities/apiConnection'

export const forgotPassword = (email) => {
  const route = '/user/password/request'
  const prefix = 'FORGOT_PASSWORD'
  const payload = { email }
  return callBuilder(route, prefix, 'post', payload)
}

export const resetPassword = (password, token) => {
  const route = '/user/password/reset'
  const prefix = 'RESET_PASSWORD'
  const payload = { new_password: password, token }
  return callBuilder(route, prefix, 'post', payload)
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'FORGOT_PASSWORD_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'FORGOT_PASSWORD_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'FORGOT_PASSWORD_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
      }
    case 'RESET_PASSWORD_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'RESET_PASSWORD_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'RESET_PASSWORD_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
