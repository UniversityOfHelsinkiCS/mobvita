import { useIntl } from 'react-intl'

const type = {
  success: 'success',
  error: 'error',
  warn: 'warn',
  info: 'info',
}

export const setNotification = (message, type, options) => ({ type: 'SET_NOTIFICATION', payload: { message, type, options } })

const initialState = {
  message: null,
  type: null,
  options: null,
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
        options: action.payload.options || {},
      }
    case 'POST_REGISTER_SUCCESS':
      return {
        message: 'Account creation success. Check your email for confirmation link!',
        type: type.success,
        options: { autoClose: false },
      }
    case 'CREATE_GROUP_SUCCESS':
      return {
        message: 'Group created!',
        type: type.success,
      }
    case 'CREATE_GROUP_FAILURE':
      return {
        message: action.response.response.data,
        type: type.error,
      }
    case 'CONFIRM_USER_SUCCESS':
      return {
        message: 'Email successfully confirmed. Logging you in, welcome to MobVita!',
        type: type.success,
        options: { autoClose: false },
      }
    case 'SHARE_STORY_FAILURE':
      return {
        message: `Failed to share story: ${action.response.response.data}`,
        type: type.error,
      }
    case 'SHARE_STORY_SUCCESS':
      return {
        translationId: 'story-shared-and-awaiting-approval',
        type: type.success,
      }

    case 'REMOVE_FROM_GROUP_FAILURE':
      return {
        message: action.response.response.data,
        type: type.error,
      }
    case 'DELETE_GROUP_FAILURE':
      return {
        message: action.response.response.data,
        type: type.error,
      }
    case 'DELETE_GROUP_SUCCESS':
      return {
        message: 'Group deleted',
        type: type.success,
      }
    default:
      return state
  }
}
