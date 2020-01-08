import callBuilder from 'Utilities/apiConnection'

export const createRealToken = (email, password) => {
  const route = '/session/'
  const prefix = 'LOGIN'
  const payload = { email, password }
  return callBuilder(route, prefix, 'post', payload)
}

export const createAnonToken = () => {
  const route = '/session/'
  const prefix = 'LOGIN'
  const payload = { is_anonymous: true }
  return callBuilder(route, prefix, 'post', payload)
}

export const logout = () => ({ type: 'LOGOUT_SUCCESS' })

export const getSelf = () => {
  const route = '/user/'
  const prefix = 'GET_SELF'
  return callBuilder(route, prefix)
}

export default (state = { data: undefined }, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        data: undefined,
        pending: false,
        error: false,
      }
    case 'GET_SELF_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
