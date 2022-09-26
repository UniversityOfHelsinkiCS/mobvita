import produce from 'immer'
import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getStoryAction = (storyId, mode) => {
  const route = `/stories/${storyId}?user_mode=${mode}`
  const prefix = 'GET_STORY'
  return callBuilder(route, prefix)
}

export const getStudentStoryAction = (storyId, groupId, studentId) => {
  const route = `/groups/${groupId}/review?story_id=${storyId}&student_id=${studentId}`
  const prefix = 'GET_STUDENT_STORY'
  return callBuilder(route, prefix)
}

export const getAllStories = (language, query) => {
  const queryString = Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&')
  const route = `/stories?language=${language}&${queryString}`
  const prefix = 'GET_STORIES'
  return callBuilder(route, prefix)
}

export const setLastQuery = query => ({
  type: 'SET_LAST_QUERY',
  query,
})

export const setStoryUploadUnfinished = (value, storyId) => ({
  type: 'SET_STORY_UPLOAD_UNFINISHED',
  value,
  storyId,
})

export const uploadCachedStory = cachedId => {
  const route = '/stories/cached'
  const prefix = 'UPLOAD_CACHED_STORY'
  const payload = { cached_id: cachedId }

  return callBuilder(route, prefix, 'post', payload)
}

export const searchStories = (language, query) => {
  const queryString = Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&')
  const route = `/stories?language=${language}&${queryString}`
  const prefix = 'SEARCH_STORIES'
  return callBuilder(route, prefix)
}

export const getStories = (language, query = { page: 0, page_size: 10 }) => {
  const queryString = Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&')
  const route = `/stories?language=${language}&${queryString}`
  const prefix = 'GET_STORIES'
  return callBuilder(route, prefix)
}

export const updateExerciseSettings = (settings, storyId) => {
  const route = `/stories/${storyId}`
  const prefix = 'SAVE_STORY'
  const payload = { exercise_settings: settings }
  return callBuilder(route, prefix, 'post', payload)
}

export const removeStory = storyId => {
  const route = `/stories/${storyId}/remove`
  const prefix = 'REMOVE_STORY'
  return callBuilder(route, prefix)
}

export const acceptSharedStory = (storyId, token) => {
  const route = `/stories/${storyId}/accept?token=${token}`
  const prefix = 'ACCEPT_STORY'
  return callBuilder(route, prefix, 'get')
}

export const unshareStory = (groupId, storyId) => {
  const route = `/groups/${groupId}/unshare/${storyId}`
  const prefix = 'UNSHARE_STORY'
  return callBuilder(route, prefix, 'post', {})
}

export const addEditStoryAnnotation = (
  storyId,
  startId,
  endId,
  annotation,
  mode,
  category,
  annotationName,
  thread_id,
) => {
  const route = `/stories/${storyId}/annotate`
  const prefix = 'ADD_OR_EDIT_STORY_ANNOTATION'
  return callBuilder(route, prefix, 'post', {
    op: 'edit',
    start_token_id: startId,
    end_token_id: endId,
    annotation,
    user_mode: mode,
    category,
    name: annotationName,
    thread_id,
  })
}

export const removeStoryAnnotation = (storyId, startId, endId, mode) => {
  const route = `/stories/${storyId}/annotate`
  const prefix = 'REMOVE_STORY_ANNOTATION'
  return callBuilder(route, prefix, 'post', {
    op: 'delete',
    start_token_id: startId,
    end_token_id: endId,
    user_mode: mode,
  })
}

const initialState = {
  data: [],
  searchResults: null,
  pending: false,
  focusedPending: false,
  error: false,
  currentQuery: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_STORIES_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_STORIES_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }

    case 'GET_STORIES_SUCCESS':
      return {
        ...state,
        data: action.response.stories,
        totalNum: action.response.total_num,
        pending: false,
        error: false,
      }

    case 'SET_STORY_UPLOAD_UNFINISHED':
      return {
        ...state,
        data: state.data.map(story =>
          story._id === action.storyId ? { ...story, uploadUnfinished: action.value } : story
        ),
      }

    case 'SEARCH_STORIES_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'SEARCH_STORIES_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'SEARCH_STORIES_SUCCESS':
      return {
        ...state,
        searchResults: action.response.stories,
        totalNum: action.response.total_num,
        pending: false,
        error: false,
      }
    case 'UPLOAD_CACHED_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
        uploaded: false,
      }
    case 'UPLOAD_CACHED_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        uploaded: false,
      }
    case 'UPLOAD_CACHED_STORY_SUCCESS':
      return {
        ...state,
        pending: false,
        uploaded: true,
      }
    case 'CLEAR_STORY_LIST':
      return initialState
    case 'GET_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        focusedPending: true,
        error: false,
      }
    case 'GET_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        focusedPending: false,
        error: true,
      }
    case 'GET_STORY_SUCCESS':
      return {
        ...state,
        focused: action.response,
        pending: false,
        focusedPending: false,
        error: false,
      }
    case 'GET_STUDENT_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        focusedPending: true,
        error: false,
      }
    case 'GET_STUDENT_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        focusedPending: false,
        error: true,
      }
    case 'GET_STUDENT_STORY_SUCCESS':
      return {
        ...state,
        focused: action.response,
        pending: false,
        focusedPending: false,
        error: false,
      }
    case 'ADD_OR_EDIT_STORY_ANNOTATION_ATTEMPT':
      return {
        ...state,
        error: false,
      }
    case 'ADD_OR_EDIT_STORY_ANNOTATION_FAILURE':
      return {
        ...state,
        error: true,
      }
    case 'ADD_OR_EDIT_STORY_ANNOTATION_SUCCESS':
      return {
        ...state,
        focused: action.response,
        error: false,
      }
    case 'REMOVE_STORY_ANNOTATION_ATTEMPT':
      return {
        ...state,
        error: false,
      }
    case 'REMOVE_STORY_ANNOTATION_FAILURE':
      return {
        ...state,
        error: true,
      }
    case 'REMOVE_STORY_ANNOTATION_SUCCESS':
      return {
        ...state,
        focused: action.response,
        error: false,
      }
    case 'SAVE_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'SAVE_STORY_ERROR':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'SAVE_STORY_SUCCESS':
      return {
        ...state,
        focused: { ...state.focused, ...action.response },
        pending: false,
        error: false,
      }
    case 'REMOVE_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'REMOVE_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'REMOVE_STORY_SUCCESS':
      return {
        ...state,
        data: state.data.filter(story => story._id !== action.response.story_id),
        pending: false,
        error: false,
      }

    case 'ACCEPT_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'ACCEPT_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'ACCEPT_STORY_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
      }

    case 'SET_LAST_QUERY':
      return {
        ...state,
        lastQuery: action.query,
      }

    case 'UNSHARE_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'UNSHARE_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'UNSHARE_STORY_SUCCESS':
      return produce(state, draft => {
        const story = draft.data.find(story => story._id === action.response.removed)
        story.groups = story.groups.filter(
          group => group.group_id !== action.response.group.group_id
        )
        draft.pending = false
        draft.error = false
      })
    default:
      return state
  }
}
