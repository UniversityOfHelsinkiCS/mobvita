
const type = {
  success: 'success',
  error: 'error',
  warn: 'warn',
  info: 'info',
}

export const setNotification = (message, type) => ({ type: 'SET_NOTIFICATION', payload: { message, type } })

const initialState = {
  message: null,
  type: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'POST_NEW_STORY_FAILURE':
      return {
        message: action.response.response.data,
        type: type.error,
      }
    case 'RESET_NOTIFICATION':
      return initialState
    case 'SET_NOTIFICATION':
      return {
        message: action.payload.message,
        type: action.payload.type,
      }
    default:
      return state
  }
}
