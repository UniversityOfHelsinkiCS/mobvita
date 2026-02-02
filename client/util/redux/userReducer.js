import callBuilder from 'Utilities/apiConnection'
import { capitalize, localeCodeToName } from 'Utilities/common'

export const setIrtDummyScore = (dummy_score) => ({ type: 'SET_IRT_DUMMY_SCORE', dummy_score: dummy_score})

export const calculateIRTScore = (language) => {
  const route = '/user/irt_score/' + language
  const prefix = 'CALCULATE_IRT'
  return callBuilder(route, prefix, 'post')
}

export const getLatestIRTScore = (language) => {
  const route = '/user/irt_score/' + language
  const prefix = 'GET_LATEST_IRT'
  return callBuilder(route, prefix, 'get')
}

export const createRealToken = (email, password, locale) => {
  const route = '/session/'
  const prefix = 'LOGIN'
  const payload = { email, password, interface_language: locale }
  return callBuilder(route, prefix, 'post', payload)
}

export const createAnonToken = locale => {
  const route = '/session/'
  const prefix = 'LOGIN_ANON'
  const payload = { is_anonymous: true, interface_language: locale }
  return callBuilder(route, prefix, 'post', payload)
}

export const deleteUser = password => {
  const route = '/user/remove/'
  const prefix = 'DELETE_USER'
  const payload = { password }
  return callBuilder(route, prefix, 'post', payload)
}

export const logout = () => ({ type: 'LOGOUT_SUCCESS' })
export const setLandingPageLangManuallySelected = value => ({
  type: 'SET_LP_LANG_MANUALLY_SELECTED',
  value,
})

export const getSelf = () => {
  const route = '/user/'
  const prefix = 'GET_SELF'
  return callBuilder(route, prefix)
}

export const getVocabularyData = () => {
  const route = '/user/vocabulary'
  const prefix = 'GET_VOCABULARY_DATA'
  return callBuilder(route, prefix)
}

export const getPreviousVocabularyData = date => {
  const route = `/user/vocabulary?date=${date}`
  const prefix = 'GET_PREVIOUS_VOCABULARY_DATA'
  return callBuilder(route, prefix)
}

export const getNewerVocabularyData = date => {
  const route = `/user/vocabulary?date=${date}`
  const prefix = 'GET_NEWER_VOCABULARY_DATA'
  return callBuilder(route, prefix)
}

export const saveSelf = changes => {
  const route = '/user/'
  const prefix = 'SAVE_SELF'
  const payload = changes
  return callBuilder(route, prefix, 'post', payload)
}

export const saveSelfIntermediate = changes => (
  {type: 'SAVE_SELF_INTERMEDIATE', changes}
)

const saveConceptSetting = changes => {
  const route = '/user/'
  const prefix = 'SAVE_USER_CONCEPTS'
  const payload = changes
  return callBuilder(route, prefix, 'post', payload)
}

export const updateLearningLanguage = language => {
  const route = '/user/'
  const prefix = 'UPDATE_LEARNING_LANGUAGE'
  const payload = { last_used_lang: capitalize(language) }
  return callBuilder(route, prefix, 'post', payload)
}

export const followUser = value => {
  const route = '/user/friends'
  const prefix = 'FOLLOW_USER'
  const payload = { emails: value }
  return callBuilder(route, prefix, 'post', payload)
}

export const unfollowUser = uid => {
  const route = `/user/friends/${uid}`
  const prefix = 'UNFOLLOW_USER'
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

export const followStorySender = (uid, token) => {
  const route = `/user/friends/${uid}/request?token=${token}`
  const prefix = 'FOLLOW_STORY_SENDER'
  return callBuilder(route, prefix, 'get')
}

export const unfollowStorySender = (uid, token) => {
  const route = `/user/friends/${uid}/remove?token=${token}`
  const prefix = 'UNFOLLOW_STORY_SENDER'
  return callBuilder(route, prefix, 'get')
}

export const resetLearningLanguageChanged = () => ({ type: 'RESET_LEARNING_LANGUAGE_CHANGED' })

export const dismissBetaLanWarning = () => ({ type: 'DISMISS_BETA_LAN_WARNING' })

export const updateLocale = locale => saveSelf({ interface_lang: localeCodeToName(locale) })
export const updateDictionaryLanguage = language =>
  saveSelf({ last_trans_lang: capitalize(language) })
export const updateExerciseSettings = settings => saveConceptSetting({ exercise_settings: settings })
export const updateTempExerciseSettings = (conceptSetting) => (
  {type: 'SET_USER_CONCEPTS_INTERMEDIATE', conceptSetting}
)
export const updateLibrarySelect = library => saveSelf({ last_selected_library: library })
export const updateGroupSelect = group => saveSelf({ last_selected_group: group })
export const updateExerciseTemplate = template => saveSelf({ exercise_setting_template: template })
export const updateUserGrade = value => saveSelf({ grade: value })
export const updateMultiChoice = value => saveSelf({ multi_choice: value })
export const updateBlankFilling = value => saveSelf({ blank_filling: value })
export const updateAudioTask = value => saveSelf({ task_audio: value })
export const updateWordAudio = value => saveSelf({ word_audio: value })
export const updateChunkAudio = value => saveSelf({ chunk_audio: value })
export const updateChunkContextAudio = value => saveSelf({ chunk_context_audio: value })
export const updateSpeechTask = value => saveSelf({ task_speech: value })
export const updateSecondTry = value => saveSelf({ second_try: value })
export const updateNumberOfFlashcards = amount => saveSelf({ flashcard_num: amount })
export const updateAutoSpeak = value => saveSelf({ auto_speak: value })
export const updateParticipleExer = value => saveSelf({ part_exer: value })
export const updateFavouriteSites = value => saveSelf({ favourite_sites: value })
export const updateUsername = value => saveSelf({ username: value })
export const updatePublishProgress = value => saveSelf({ publish_progress: value })
export const updateSortCriterion = value => saveSelf({ library_sort_criterion: value })

export const updatePracticeSettings = changes => saveSelf(changes)
export const updateReadingComprehension = value => {
  if (value) {
    return saveSelf({
      reading_comprehension: true,
      blank_filling: false,
      multi_choice: false,
      task_audio: false,
      task_speech: false,
    })
  }

  return saveSelf({
    reading_comprehension: false,
  })
}

export const homeTourViewed = () => saveSelf({ has_seen_home_tour: true })
export const libraryTourViewed = () => saveSelf({ has_seen_library_tour: true })
export const progressTourViewed = () => saveSelf({ has_seen_progress_tour: true })
export const practiceTourViewed = () => saveSelf({ has_seen_practice_tour: true })
export const lessonsTourViewed = () => saveSelf({ has_seen_lesson_tour: true })

export const ddlangIntroductoryViewed = () => saveSelf({ has_seen_ddlang_introductory: true })
export const ddlangBackgroundQuestionsAnswered = () => saveSelf({ has_answer_ddlang_background_questions: true })
export const ddlang_years = (response) => saveSelf({ ddlang_years: response })
export const ddlang_obligatoryCourses = (response) => saveSelf({ ddlang_obligatoryCourses: response })
export const ddlang_optionalCourses = (response) => saveSelf({ ddlang_optionalCourses: response })
export const ddlang_grade = (response) => saveSelf({ ddlang_grade: response })

export const updateToNonNewUser = () => saveSelf({ is_new_user: false })
export const updatePracticePrctMode = value => saveSelf({ practice_prct_mode: value })
export const updateMaxPracticePercent = value => saveSelf({ max_practice_prct: value })
export const updateShowReviewDiff = value => saveSelf({ show_review_diff: value })
export const updatePreviewExer = value => saveSelf({ show_preview_exer: value })
export const updateEnableRecmd = value => saveSelf({ enable_recmd: value })
export const updateIsTeacher = value => saveSelf({ is_teacher: value })
export const teacherSwitchView = () => ({ type: 'TEACHER_SWITCH_VIEW'})

export const updateGroupTemplateSelection = groupId => {
  return saveSelf({ exercise_setting_template: groupId, last_selected_group: groupId })
}

export const updateLearningSettingMode = (mode, groupId = null) => {
  if (mode === 'auto') {
    return saveSelf({ practice_prct_mode: 'auto', exercise_setting_template: 'auto' })
  }
  if (mode === 'personal') {
    return saveSelf({ practice_prct_mode: 'custom', exercise_setting_template: 'personal' })
  }
  if (mode === 'group') {
    return saveSelf({ practice_prct_mode: 'group', exercise_setting_template: groupId })
  }
}

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

export const updateCurrentState = newState => ({ type: 'UPDATE_CURRENT_STATE', newState })

export const refresh = () => ({ type: 'REFRESH' })

export default (state = { data: null, learningLanguageChanged: false }, action) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_STATE':
      return {
        ...state,
        current_state: action.newState,
      }
    case 'LOGIN_ANON_SUCCESS':
      return {
        ...state,
        data: { ...action.response, timeStamp: new Date() },
        pending: false,
        error: false,
        errorMessage: null,
        refreshed: true,
      }
    case 'LOGIN_ANON_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
        errorMessage: null,
      }
    case 'LOGIN_ANON_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        errorMessage: action?.response,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        data: { ...action.response, teacherView: action.response.user.is_teacher},
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
        data: { 
          ...state.data, 
          user: action.response.user, 
          teacherView: state.data && state.data.teacherView === undefined && action.response.user.is_teacher || state.data && state.data.teacherView || false
        },
        pending: false,
        error: false,
        refreshed: true,
      }
    case 'SAVE_USER_CONCEPTS_INTERMEDIATE':
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            exercise_setting: action.conceptSetting,
          }
        },
        pending: false,
        error: false,
        refreshed: true,
      }

    case 'SAVE_SELF_INTERMEDIATE':
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            ...action.changes,
          }
        },
      }
    
    case 'SAVE_USER_CONCEPTS_SUCCESS':
    case 'SAVE_SELF_SUCCESS':
      return {
        ...state,
        data: { 
          ...state.data, 
          user: action.response.user, 
          teacherView: state.data && state.data.teacherView === undefined && action.response.user.is_teacher || state.data.teacherView
        },
        pending: false,
        error: false,
        refreshed: true,
      }
    case 'SAVE_USER_CONCEPTS_ATTEMPT':
    case 'SAVE_SELF_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'SAVE_USER_CONCEPTS_FAILURE':
    case 'SAVE_SELF_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        errorMessage: action?.response,
      }
    case 'DISMISS_BETA_LAN_WARNING':
      return {
        ...state,
        selected: false,
      }
    case 'FOLLOW_USER_SUCCESS':
      return {
        ...state,
        data: { 
          ...state.data, 
          user: action.response.user, 
          teacherView: state.data && state.data.teacherView === undefined && action.response.user.is_teacher || state.data.teacherView
        },
        pending: false,
        error: false,
        refreshed: true,
      }
    case 'FOLLOW_USER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'FOLLOW_USER_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        errorMessage: action?.response,
      }

    case 'UNFOLLOW_USER_SUCCESS':
      return {
        ...state,
        data: { 
          ...state.data, 
          user: action.response.user, 
          teacherView: state.data && state.data.teacherView === undefined && action.response.user.is_teacher || state.data.teacherView
        },
        pending: false,
        error: false,
        refreshed: true,
      }
    case 'UNFOLLOW_USER_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'UNFOLLOW_USER_FAILURE':
      return {
        ...state,
        pending: true,
      }

    case 'BLOCK_USER_SUCCESS':
      return {
        ...state,
        data: { 
          ...state.data, 
          user: action.response.user, 
          teacherView: state.data && state.data.teacherView === undefined && action.response.user.is_teacher || state.data.teacherView
        },
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
        data: { 
          ...state.data, 
          user: action.response.user, 
          teacherView: state.data && state.data.teacherView === undefined && action.response.user.is_teacher || state.data.teacherView
        },
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

    case 'UNFOLLOW_STORY_SENDER_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        refreshed: true,
      }

    case 'UNFOLLOW_STORY_SENDER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }

    case 'FOLLOW_STORY_SENDER_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        refreshed: true,
      }

    case 'FOLLOW_STORY_SENDER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'UPDATE_LEARNING_LANGUAGE_SUCCESS':
      return {
        ...state,
        data: { 
          ...state.data, 
          user: action.response.user, 
          teacherView: action.response.user.is_teacher
        },
        pending: false,
        error: false,
        refreshed: true,
        learningLanguageChanged: true,
        selected: true,
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
    case 'SET_LP_LANG_MANUALLY_SELECTED':
      return {
        ...state,
        landingPageLangManuallySelected: action.value,
      }
    case 'DELETE_USER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
        errorMessage: null,
      }
    case 'DELETE_USER_SUCCESS':
      return {
        ...state,
        deleteSuccessful: true,
        pending: false,
      }
    case 'DELETE_USER_FAILURE':
      return {
        ...state,
        pending: false,
      }

    case 'GET_VOCABULARY_DATA_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }

    case 'GET_VOCABULARY_DATA_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        refreshed: true,
        vocabularyData: action.response,
      }
    case 'GET_PREVIOUS_VOCABULARY_DATA_ATTEMPT':
      return {
        ...state,
        vocabularyPending: true,
        error: false,
      }
    case 'GET_PREVIOUS_VOCABULARY_DATA_FAILURE':
      return {
        ...state,
        vocabularyPending: false,
        error: true,
      }
    case 'GET_PREVIOUS_VOCABULARY_DATA_SUCCESS':
      return {
        ...state,
        vocabularyPending: false,
        error: false,
        refreshed: true,
        vocabularyData: action.response,
      }
    case 'GET_NEWER_VOCABULARY_DATA_ATTEMPT':
      return {
        ...state,
        newerVocabularyPending: true,
        error: false,
      }
    case 'GET_NEWER_VOCABULARY_DATA_FAILURE':
      return {
        ...state,
        newerVocabularyPending: false,
        error: true,
      }
    case 'GET_NEWER_VOCABULARY_DATA_SUCCESS':
      return {
        ...state,
        newerVocabularyPending: false,
        error: false,
        refreshed: true,
        newerVocabularyData: action.response,
      }
    case 'CALCULATE_IRT_ATTEMPT':
      return {
        ...state,
        irtCalculationPending: true,
        error: false,
      }
    case 'CALCULATE_IRT_FAILURE':
      return {
        ...state,
        irtCalculationPending: false,
        error: true,
      }
    case 'CALCULATE_IRT_SUCCESS':
      if (action.response.score){
        return {
          ...state,
          irtCalculationPending: false,
          irt_dummy_score: action.response.score
        }
      } else {
        return {
          ...state,
          irtCalculationPending: false,
        }
      } 
    case 'GET_LATEST_IRT_ATTEMPT':
      return {
        ...state,
        irtCalculationPending: true,
        error: false,
      }
    case 'GET_LATEST_IRT_FAILURE':
      return {
        ...state,
        irtCalculationPending: false,
        error: true,
      }
    case 'GET_LATEST_IRT_SUCCESS':
      if (action.response.score){
        return {
          ...state,
          irtCalculationPending: false,
          irt_dummy_score: action.response.score
        }
      } else {
        return {
          ...state,
          irtCalculationPending: false,
        }
      } 
    case 'SET_IRT_DUMMY_SCORE':
      return {
        ...state,
        irt_dummy_score: action.dummy_score,
      }
    case 'TEACHER_SWITCH_VIEW':
      return {
        ...state,
        data: { ...state.data, teacherView: state.data.user.is_teacher && !state.data.teacherView },
      }
    default:
      return state
  }
}