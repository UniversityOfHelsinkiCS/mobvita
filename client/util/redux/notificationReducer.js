const type = {
  success: 'success',
  error: 'error',
  warn: 'warn',
  info: 'info',
}

export const setNotification = (translationID, type, options) => ({ type: 'SET_NOTIFICATION', payload: { translationID, type, options } })

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
        options: { autoClose: 10000 },
      }
    case 'RESET_NOTIFICATION':
      return initialState
    case 'SET_NOTIFICATION':
      return {
        translationId: action.payload.translationID,
        type: action.payload.type,
        options: action.payload.options || {},
      }
    case 'POST_REGISTER_SUCCESS':
      return {
        translationId: 'a-message-containing-a-link-to-confirm-your-registration-has-been-sent-to-your-email-address-please-',
        type: type.success,
        options: { autoClose: false },
      }
    case 'CREATE_GROUP_SUCCESS':
      return {
        translationId: 'group-created',
        type: type.success,
      }
    case 'CREATE_GROUP_FAILURE':
      return {
        message: action.response.response.data,
        type: type.error,
      }
    case 'CONFIRM_USER_SUCCESS':
      return {
        translationId: 'your-registration-is-completed-you-can-now-log-in',
        type: type.success,
        options: { autoClose: false },
      }
    case 'SHARE_STORY_FAILURE':
      return {
        translationId: 'failed-to-share-the-story',
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
        translationId: 'group-deleted',
        type: type.success,
      }
    case 'POST_EMAIL_SUCCESS':
      return {
        translationId: 'email-sent',
        type: type.success,
      }
    case 'JOIN_GROUP_SUCCESS':
      return {
        translationId: 'joined-group',
        type: type.success,
      }
    case 'JOIN_GROUP_FAILURE':
      return {
        message: action.response.response.data,
        type: type.error,
      }
    case 'CHANGE_PASSWORD_SUCCESS':
      return {
        message: action.response.message,
        type: type.success,
      }
    case 'CHANGE_PASSWORD_FAILURE':
      return {
        message: action.response.response.data,
        type: type.error,
      }
    case 'FORGOT_PASSWORD_SUCCESS':
      return {
        message: action.response.message,
        type: type.success,
      }
    case 'FORGOT_PASSWORD_FAILURE':
      return {
        message: action.response.response.data,
        type: type.error,
      }
    case 'RESET_PASSWORD_SUCCESS':
      return {
        message: action.response.message,
        type: type.success,
      }
    case 'RESET_PASSWORD_FAILURE':
      return {
        message: action.response.response.data,
        type: type.error,
      }
    case 'GET_SNIPPET_ANSWERS_FAILURE':
      return {
        translationId: 'post-answers-error',
        type: type.error,
        options: { autoClose: 10000 },
      }
    default:
      return state
  }
}
