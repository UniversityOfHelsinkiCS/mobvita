import callBuilder from 'Utilities/apiConnection'
import { capitalize, localeOptions, localeCodeToName } from 'Utilities/common'

export const createRealToken = (email, password) => {
  const route = '/session/'
  const prefix = 'LOGIN'
  const payload = { email, password }
  return callBuilder(route, prefix, 'post', payload)
}

export const createAnonToken = (locale) => {
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

export const saveSelf = (changes) => {
  const route = '/user/'
  const prefix = 'SAVE_SELF'
  const payload = changes
  return callBuilder(route, prefix, 'post', payload)
}

export const updateLearningLanguage = language => saveSelf({ last_used_lang: capitalize(language) })
export const updateLocale = locale => saveSelf({ interface_lang: localeCodeToName(locale) })
export const updateDictionaryLanguage = language => saveSelf({ last_trans_lang: capitalize(language) })
export const updateExerciseSettings = settings => saveSelf({ exercise_settings: settings })
export const updateLibrarySelect = library => saveSelf({ last_selected_library: library })
export const updateGroupSelect = group => saveSelf({ last_selected_group: group })
export const updateExerciseTemplate = template => saveSelf({ exercise_setting_template: template })
export const updateMultiChoice = value => saveSelf({ multi_choice: value })
export const updateAudioTask = value => saveSelf({ task_audio: value })
export const updateSecondTry = value => saveSelf({ second_try: value })
export const updateNumberOfFlashcards = amount => saveSelf({ flashcard_num: amount })

export const changePassword = (currentPassword, newPassword) => {
  const route = '/user/password'
  const prefix = 'CHANGE_PASSWORD'
  const payload = {
    current_password: currentPassword,
    new_password: newPassword,
  }
  return callBuilder(route, prefix, 'post', payload)
}

export const confirmUser = (token) => {
  const route = `/confirm?token=${token}`
  const prefix = 'CONFIRM_USER'
  return callBuilder(route, prefix, 'get')
}

export const refresh = () => ({ type: 'REFRESH' })


export default (state = { data: null }, action) => {
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
        errorMessage: action.response.response && action.response.response.data,
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
        errorMessage: action.response.response && action.response.response.data,
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
