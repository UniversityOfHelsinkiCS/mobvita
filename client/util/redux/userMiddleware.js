
import * as Sentry from '@sentry/react'

const userMiddleware = store => next => (action) => {
  const { user } = store.getState()
  switch (action ? action.type : 'UNDEFINED') {
    case 'LOGIN_SUCCESS':
    case 'SAVE_SELF_SUCCESS':
    case 'GET_SELF_SUCCESS':
    case 'CONFIRM_USER_SUCCESS':
      if (user.data) {
        Sentry.setUser({ email: user.data.user.email })
      }
      break
    case 'LOGOUT_SUCCESS':
      Sentry.setUser({ email: null })
      break
    default:
      break
  }
  next(action)
}

export default userMiddleware
