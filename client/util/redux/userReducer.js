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

export const saveSelf = (changes) => {
  const route = '/user/'
  const prefix = 'SAVE_SELF'
  const payload = changes
  return callBuilder(route, prefix, 'post', payload)
}

export const updateLearningLanguage = language => saveSelf({ last_used_lang: language })

export const confirmUser = (token) => {
  const route = '/confirm'
  const prefix = 'CONFIRM_USER'
  const payload = { token }
  return callBuilder(route, prefix, 'post', payload)
}

export default (state = { data: undefined }, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
        errorMessage: null,
      }
    case 'LOGIN_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
        errorMessage: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        errorMessage: action.response.response.data,
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
        data: { ...state.data, user: action.response.user },
        pending: false,
        error: false,
      }
    case 'SAVE_SELF_SUCCESS':
      return {
        ...state,
        data: { ...state.data, user: action.response.user },
        pending: false,
        error: false,
      }
    case 'SAVE_SELF_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'SAVE_SELF_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        errorMessage: action.response.response.data,
      }
    case 'CONFIRM_USER_SUCCESS':
      return {
        ...state,
        data: { user: action.response },
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
