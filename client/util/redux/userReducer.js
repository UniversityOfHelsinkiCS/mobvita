import callBuilder from 'Utilities/apiConnection'
import { capitalize, localeCodeToName } from 'Utilities/common'

export const createRealToken = (email, password) => {
  const route = '/session/'
  const prefix = 'LOGIN'
  const payload = { email, password }
  return callBuilder(route, prefix, 'post', payload)
}

export const createAnonToken = locale => {
  const route = '/session/'
  const prefix = 'LOGIN'
  const payload = { is_anonymous: true, interface_language: locale }
  return callBuilder(route, prefix, 'post', payload)
}

export const logout = () => ({ type: 'LOGOUT_SUCCESS' })

export const getSelf = () => {
  const route = '/user/'
  const prefix = 'GET_SELF'
  return callBuilder(route, prefix)
}

export const saveSelf = changes => {
  const route = '/user/'
  const prefix = 'SAVE_SELF'
  const payload = changes
  return callBuilder(route, prefix, 'post', payload)
}

export const updateLearningLanguage = language => {
  const route = '/user/'
  const prefix = 'UPDATE_LEARNING_LANGUAGE'
  const payload = { last_used_lang: capitalize(language) }
  return callBuilder(route, prefix, 'post', payload)
}

export const addFriends = value => {
  const route = '/user/friends'
  const prefix = 'ADD_FRIENDS'
  const payload = { emails: value }
  return callBuilder(route, prefix, 'post', payload)
}

export const removeFriend = uid => {
  const route = `/user/friends/${uid}`
  const prefix = 'REMOVE_FRIEND'
  return callBuilder(route, prefix, 'post')
}

export const blockUser = value => {
  const route = '/user/blocked'
  const prefix = 'BLOCK_USER'
  const payload = { emails: value }
  return callBuilder(route, prefix, 'post', payload)
}

export const unblockUser = uid => {
  const route = `/user/blocked/${uid}`
  const prefix = 'UNBLOCK_USER'
  return callBuilder(route, prefix, 'post')
}

export const blockStorySender = (uid, token) => {
  const route = `/user/blocked/${uid}/request?token=${token}`
  const prefix = 'BLOCK_STORY_SENDER'
  return callBuilder(route, prefix, 'get')
}

export const addStorySenderAsFriend = (uid, token) => {
  const route = `/user/friends/${uid}/request?token=${token}`
  const prefix = 'ADD_FRIEND_STORY_SENDER'
  return callBuilder(route, prefix, 'get')
}

export const resetLearningLanguageChanged = () => ({ type: 'RESET_LEARNING_LANGUAGE_CHANGED' })

export const updateLocale = locale => saveSelf({ interface_lang: localeCodeToName(locale) })
export const updateDictionaryLanguage = language =>
  saveSelf({ last_trans_lang: capitalize(language) })
export const updateExerciseSettings = settings => saveSelf({ exercise_settings: settings })
export const updateLibrarySelect = library => saveSelf({ last_selected_library: library })
export const updateGroupSelect = group => saveSelf({ last_selected_group: group })
export const updateExerciseTemplate = template => saveSelf({ exercise_setting_template: template })
export const updateMultiChoice = value => saveSelf({ multi_choice: value })
export const updateAudioTask = value => saveSelf({ task_audio: value })
export const updateSecondTry = value => saveSelf({ second_try: value })
export const updateNumberOfFlashcards = amount => saveSelf({ flashcard_num: amount })
export const updateAutoSpeak = value => saveSelf({ auto_speak: value })
export const updateParticipleExer = value => saveSelf({ part_exer: value })
export const updateFavouriteSites = value => saveSelf({ favourite_sites: value })
export const updateUsername = value => saveSelf({ username: value })
export const updatePublishProgress = value => saveSelf({ publish_progress: value })
export const updateSortCriterion = value => saveSelf({ library_sort_criterion: value })
export const updateToNonNewUser = () => saveSelf({ is_new_user: false })

export const changePassword = (currentPassword, newPassword) => {
  const route = '/user/password'
  const prefix = 'CHANGE_PASSWORD'
  const payload = {
    current_password: currentPassword,
    new_password: newPassword,
  }
  return callBuilder(route, prefix, 'post', payload)
}

export const confirmUser = token => {
  const route = `/confirm?token=${token}`
  const prefix = 'CONFIRM_USER'
  return callBuilder(route, prefix, 'get')
}

export const refresh = () => ({ type: 'REFRESH' })

export default (state = { data: null, learningLanguageChanged: false }, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
        errorMessage: null,
        refreshed: true,
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
        errorMessage: action?.response,
      }
    case 'GET_SELF_SUCCESS':
      return {
        ...state,
        data: { ...state.data, user: action.response.user },
        pending: false,
        error: false,
        refreshed: true,
      }
    case 'SAVE_SELF_SUCCESS':
      return {
        ...state,
        data: { ...state.data, user: action.response.user },
        pending: false,
        error: false,
        refreshed: true,
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
        errorMessage: action?.response,
      }
    case 'ADD_FRIENDS_SUCCESS':
      return {
        ...state,
        data: { ...state.data, user: action.response.user },
        pending: false,
        error: false,
        refreshed: true,
      }
    case 'ADD_FRIENDS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'ADD_FRIENDS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        errorMessage: action?.response,
      }

    case 'REMOVE_FRIEND_SUCCESS':
      return {
        ...state,
        data: { ...state.data, user: action.response.user },
        pending: false,
        error: false,
        refreshed: true,
      }
    case 'REMOVE_FRIEND_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'REMOVE_FRIEND_FAILURE':
      return {
        ...state,
        pending: true,
      }

    case 'BLOCK_USER_SUCCESS':
      return {
        ...state,
        data: { ...state.data, user: action.response.user },
        pending: false,
        error: false,
        refreshed: true,
      }
    case 'BLOCK_USER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'BLOCK_USER_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        errorMessage: action?.response,
      }

    case 'UNBLOCK_USER_SUCCESS':
      return {
        ...state,
        data: { ...state.data, user: action.response.user },
        pending: false,
        error: false,
        refreshed: true,
      }
    case 'UNBLOCK_USER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'UNBLOCK_USER_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        errorMessage: action?.response,
      }

    case 'BLOCK_STORY_SENDER_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        refreshed: true,
      }

    case 'BLOCK_STORY_SENDER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }

    case 'ADD_FRIEND_STORY_SENDER_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        refreshed: true,
      }

    case 'ADD_FRIEND_STORY_SENDER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'UPDATE_LEARNING_LANGUAGE_SUCCESS':
      return {
        ...state,
        data: { ...state.data, user: action.response.user },
        pending: false,
        error: false,
        refreshed: true,
        learningLanguageChanged: true,
      }
    case 'UPDATE_LEARNING_LANGUAGE_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'UPDATE_LEARNING_LANGUAGE_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        errorMessage: action?.response,
      }
    case 'RESET_LEARNING_LANGUAGE_CHANGED':
      return {
        ...state,
        learningLanguageChanged: false,
      }
    case 'CONFIRM_USER_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'REFRESH':
      return {
        ...state,
        refreshed: true,
      }
    default:
      return state
  }
}
