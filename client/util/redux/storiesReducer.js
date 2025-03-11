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
  const route = `/stories/cached?cached_id=${cachedId}`
  const prefix = 'UPLOAD_CACHED_STORY'
  return callBuilder(route, prefix)
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

export const updateTempExerciseSettings = (conceptSetting) => (
  {type: 'SAVE_STORY_INTERMEDIATE', conceptSetting}
)

export const updateExerciseTopics = (topics, storyId) => {
  const route = `/stories/${storyId}`
  const prefix = 'SAVE_STORY'
  const payload = { topics }
  return callBuilder(route, prefix, 'post', payload)
}

export const updateTempExerciseTopics = (topics) => (
  {type: 'SAVE_STORY_INTERMEDIATE', topics}
)

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

export const storyVisibilityChange = (groupId, storyId, visibility) => {
  const route = `/groups/${groupId}/visibility`
  const prefix = 'SET_STORY_VISIBILITY'
  return callBuilder(route, prefix, 'post', {visibility, storyId})
}

export const addEditStoryAnnotation = (
  publicStory,
  publicNote,
  storyId,
  startId,
  endId,
  annotation,
  mode,
  category,
  annotationName,
  thread_id,
) => {
  console.log('in payload ', publicStory)
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
    public: publicNote,
    public_story: publicStory,
  })
}

export const answerAnnotation = (
  storyId,
  startId,
  endId,
  annotation,
  mode,
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
    name: '',
    reply_to: thread_id,
    root_id: thread_id,
    public: true,
  })
}

export const removeStoryAnnotation = (storyId, startId, endId, mode, threadId) => {
  const route = `/stories/${storyId}/annotate`
  const prefix = 'REMOVE_STORY_ANNOTATION'
  return callBuilder(route, prefix, 'post', {
    op: 'delete',
    start_token_id: startId,
    end_token_id: endId,
    user_mode: mode,
    thread_id: threadId,
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
        uploaded: false,
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
    case 'SAVE_STORY_INTERMEDIATE':
      return {
        ...state,
        focused: { 
          ...state.focused, 
          topics: action.topics
        },
        pending: false,
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

    case 'SET_STORY_VISIBILITY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'SET_STORY_VISIBILITY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'SET_STORY_VISIBILITY_SUCCESS':
      return produce(state, draft => {
        const story = draft.data.find(story => story._id === action.response.story_id)
        const changedGroup = story.groups.find(group => group.group_id === action.response.group_id)
        story.groups = story.groups.map(
          group => group.group_id !== action.response.group_id && group || {...changedGroup, hidden: action.response.hidden}
        )
        draft.pending = false
        draft.error = false
      })



    default:
      return state
  }
}
