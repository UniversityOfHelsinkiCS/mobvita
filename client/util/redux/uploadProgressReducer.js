import callBuilder from '../apiConnection'

export const getProgress = storyId => {
  const route = `/stories/${storyId}/loading`
  const prefix = 'GET_PROGRESS'
  return callBuilder(route, prefix)
}

export const postStory = newStory => {
  const route = '/stories'
  const prefix = 'POST_NEW_STORY'
  return callBuilder(route, prefix, 'post', newStory)
}

export const setCustomUpload = custom => ({ type: 'SET_CUSTOM_UPLOAD', custom })

const initialState = {
  progress: 0,
  storyId: null,
  pending: false,
  error: false,
  custom: false,
  exerciseReady: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PROGRESS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_PROGRESS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_PROGRESS_SUCCESS':
      return {
        ...state,
        progress: action.response.progress,
        processingErrorMsgId: action.response.loading_error,
        pending: false,
        error: false,
        exerciseReady: action.response.exercise_ready,
      }
    case 'POST_NEW_STORY_ATTEMPT':
      return {
        ...state,
        url: action.requestSettings.data.url,
        pending: true,
        error: false,
      }
    case 'POST_NEW_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'POST_NEW_STORY_SUCCESS':
      return {
        ...state,
        pending: false,
        storyId: action.response.story_id,
        progress: 0,
        error: false,
        custom: false,
      }
    case 'SET_CUSTOM_UPLOAD':
      return {
        ...state,
        custom: action.custom,
      }
    case 'CLEAR_UPLOADPROGRESS':
      return {
        ...state,
        ...initialState,
      }
    default:
      return state
  }
}
