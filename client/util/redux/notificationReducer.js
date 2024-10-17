const type = {
  success: 'success',
  error: 'error',
  warn: 'warn',
  info: 'info',
}

export const setNotification = (translationID, type, options) => ({
  type: 'SET_NOTIFICATION',
  payload: { translationID, type, options },
})

const initialState = {
  message: null,
  type: null,
  options: null,
}

const failureMessage = response => response || 'Server error'

export default (state = initialState, action) => {
  switch (action.type) {
    case 'POST_NEW_STORY_FAILURE':
      return {
        message: failureMessage(action.response),
        type: type.error,
        options: { autoClose: 10000 },
      }
    case 'RESET_NOTIFICATION':
      return initialState
    case 'SET_NOTIFICATION':
      return {
        translationId: action.payload.translationID,
        message: action.payload.translationID,
        type: action.payload.type,
        options: action.payload.options || {},
      }
    case 'POST_REGISTER_SUCCESS':
      return {
        translationId:
          'a-message-containing-a-link-to-confirm-your-registration-has-been-sent-to-your-email-address-please-',
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
        message: failureMessage(action.response),
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
      if (action.response.not_existed_users.length > 0) {
        const notFoundEmails = action.response.not_existed_users.map(e => e.email).join(', ')
        return {
          translationId: 'following-users-not-found',
          type: type.info,
          contextVariables: { users: notFoundEmails },
          options: { autoClose: false },
        }
      }

      return {
        translationId: 'story-shared',
        type: type.success,
      }
    case 'REMOVE_FROM_GROUP_FAILURE':
      return {
        message: failureMessage(action.response),
        type: type.error,
      }
    case 'DELETE_USER_SUCCESS':
      return {
        translationId: 'delete-account-success',
        type: type.success,
      }
    case 'DELETE_USER_FAILURE':
      return {
        message: failureMessage(action.response),
        type: type.error,
      }
    case 'DELETE_GROUP_FAILURE':
      return {
        message: failureMessage(action.response),
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
        message: failureMessage(action.response),
        type: type.error,
      }
    case 'CHANGE_PASSWORD_SUCCESS':
      return {
        message: action.response.message,
        type: type.success,
      }
    case 'CHANGE_PASSWORD_FAILURE':
      return {
        message: failureMessage(action.response),
        type: type.error,
      }
    case 'FORGOT_PASSWORD_SUCCESS':
      return {
        message: action.response.message,
        type: type.success,
      }
    case 'FORGOT_PASSWORD_FAILURE':
      return {
        message: failureMessage(action.response),
        type: type.error,
      }
    case 'RESET_PASSWORD_SUCCESS':
      return {
        message: action.response.message,
        type: type.success,
      }
    case 'RESET_PASSWORD_FAILURE':
      return {
        message: failureMessage(action.response),
        type: type.error,
      }
    case 'GET_SNIPPET_ANSWERS_FAILURE':
      return {
        translationId: 'post-answers-error',
        type: type.error,
        options: { autoClose: 10000 },
      }
    case 'UNSHARE_STORY_FAILURE':
      return {
        message: failureMessage(action.response),
        type: type.error,
      }
    case 'UNSHARE_STORY_SUCCESS':
      return {
        translationId: 'story-unshared',
        type: type.success,
      }
    case 'REMOVE_STORY_FAILURE':
      return {
        message: 'story-remove-fail',
        type: type.error,
      }
    case 'REMOVE_STORY_SUCCESS':
      return {
        translationId: 'story-remove-success',
        type: type.success,
      }
    case 'CREATE_FLASHCARD_SUCCESS':
      return {
        translationId: 'submit-done',
        type: type.success,
      }
    case 'CREATE_FLASHCARD_FAILURE':
      return {
        message: failureMessage(action.response),
        type: type.error,
      }
    case 'UPDATE_FLASHCARD_SUCCESS':
      return {
        translationId: 'update-done',
        type: type.success,
      }
    case 'UPDATE_FLASHCARD_FAILURE':
      return {
        message: failureMessage(action.response),
        type: type.error,
      }
    case 'FOLLOW_USER_SUCCESS':
      if (action.response.not_existed_users.length > 0) {
        const notFoundEmails = action.response.not_existed_users.join(', ')
        return {
          translationId: 'following-users-not-found',
          type: type.info,
          contextVariables: { users: notFoundEmails },
          options: { autoClose: false },
        }
      }

      if (action.response.friended_users.length > 0) {
        const alreadyFollowed = action.response.friended_users.join(', ')
        return {
          translationId: 'users-already-followed',
          type: type.info,
          contextVariables: { users: alreadyFollowed },
          options: { autoClose: false },
        }
      }

      return {
        translationId: 'user-followed',
        type: type.success,
      }
    case 'UNFOLLOW_USER_SUCCESS':
      return {
        translationId: 'user-unfollowed-success',
        type: type.success,
      }

    case 'BLOCK_USER_SUCCESS':
      if (action.response.not_existed_users.length > 0) {
        const notFoundEmails = action.response.not_existed_users.join(', ')
        return {
          translationId: 'following-users-not-found',
          type: type.info,
          contextVariables: { users: notFoundEmails },
          options: { autoClose: false },
        }
      }

      if (action.response.blocked_users.length > 0) {
        const alreadyBlocked = action.response.blocked_users.join(', ')
        return {
          translationId: 'users-already-blocked',
          type: type.info,
          contextVariables: { users: alreadyBlocked },
          options: { autoClose: false },
        }
      }

      return {
        translationId: 'user-blocked-success',
        type: type.success,
      }
    case 'UNBLOCK_USER_SUCCESS':
      return {
        translationId: 'user-unblocked',
        type: type.success,
      }

    case 'ACCEPT_STORY_SUCCESS':
      return {
        translationId: 'shared-story-accepted-successfully',
        type: type.success,
      }

    case 'ACCEPT_STORY_FAILURE':
      return {
        translationId: 'could-not-find-story-to-accept',
        type: type.error,
      }

    case 'BLOCK_STORY_SENDER_SUCCESS':
      return {
        translationId: 'user-blocked-success',
        type: type.success,
      }

    case 'BLOCK_STORY_SENDER_FAILURE':
      return {
        translationId: 'user-blocked-failure',
        type: type.error,
      }

    case 'FOLLOW_STORY_SENDER_SUCCESS':
      return {
        translationId: 'user-followed',
        type: type.success,
      }

    case 'UNFOLLOW_STORY_SENDER_SUCCESS':
      return {
        translationId: 'user-unfollowed-success',
        type: type.success,
      }
    case 'ADD_OR_EDIT_STORY_ANNOTATION_SUCCESS':
      return {
        translationId: 'note-save-success',
        type: type.success,
      }
    case 'ADD_OR_EDIT_STORY_ANNOTATION_FAILURE':
      return {
        translationId: 'note-save-failure',
        type: type.error,
      }

    case 'REMOVE_STORY_ANNOTATION_SUCCESS':
      return {
        translationId: 'note-delete-success',
        type: type.success,
      }
    case 'REMOVE_STORY_ANNOTATION_FAILURE':
      return {
        translationId: 'note-delete-failure',
        type: type.error,
      }

    case 'IMPORT_STORIES_SUCCESS':
      return {
        translationId: 'import-success',
        contextVariables: { num: action.response.num_story_imported },
        type: type.success,
      }
    case 'IMPORT_STORIES_FAILURE':
      return {
        translationId: 'import-failure',
        type: type.error,
      }

    case 'SET_STORY_VISIBILITY_SUCCESS':
      return {
        translationId: 'story-visibility-success',
        contextVariables: { hidden: action.response.hidden },
        type: type.success,
      }
    case 'SET_STORY_VISIBILITY_FAILURE':
      return {
        translationId: 'story-visibility-failure',
        type: type.error,
      }

    default:
      return state
  }
}
