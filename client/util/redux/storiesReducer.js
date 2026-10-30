// Fetches a story's processing status; storyId rides in meta since responses may lack it.
export const getStoryLoadingProgress = storyId => {
  const route = `/stories/${storyId}/loading`
  const prefix = 'GET_STORY_LOADING_PROGRESS'
  return { ...callBuilder(route, prefix), meta: { storyId } }
}
import { produce } from 'immer'
import callBuilder, { callApi } from '../apiConnection'
import { currentUserId, readStoryCache } from '../storyCache'
/**
 * Actions and reducers are in the same file for readability
 */

/**
 * Refetch ONE story to pick up progress changed elsewhere (see `staleStoryId`). Its own prefix
 * rather than `getStoryAction`: that one drives `focused` and the request-id guard, which the
 * library has no business touching just to refresh a progress bar.
 */
export const refreshStoryProgress = storyId => {
  const route = `/stories/${storyId}`
  const prefix = 'REFRESH_STORY_PROGRESS'
  // `query` rides along to the SUCCESS action, so the reducer knows which list entry to patch
  // without depending on the payload carrying `_id` (GET_STORY_SUCCESS already normalises around
  // responses that don't).
  return callBuilder(route, prefix, 'get', undefined, { storyId })
}

export const getStoryAction = (storyId, mode) => {
  const route = `/stories/${storyId}?user_mode=${mode}`
  const prefix = 'GET_STORY'
  return callBuilder(route, prefix)
}

// Reading-comprehension questions were split out of the story API; this endpoint returns the
// questions plus a session_id (used to scope the reading-practice chatbot conversation).
export const getStoryReadingQuestionsAction = storyId => {
  const route = `/stories/${storyId}/get_questions`
  const prefix = 'GET_STORY_READING_QUESTIONS'
  return callBuilder(route, prefix)
}

export const answerStoryQuestionAction = ({ storyId, questionId, answer, showRef }) => {
  const route = `/stories/${storyId}/answer_question`
  const prefix = 'ANSWER_STORY_QUESTION'
  const payload = {
    question_id: String(questionId),
    answer: String(answer ?? ''),
    show_ref: !!showRef,
  }
  return callBuilder(route, prefix, 'post', payload)
}

export const getStudentStoryAction = (storyId, groupId, studentId) => {
  const route = `/groups/${groupId}/review?story_id=${storyId}&student_id=${studentId}`
  const prefix = 'GET_STUDENT_STORY'
  return callBuilder(route, prefix)
}

// Five at a time leaves one of the browser's six HTTP/1.1 connections free for other API calls.
const PARALLEL_STORY_REQUESTS = 5
const MIN_STORY_PAGE_SIZE = 20
const STORY_PAGE_RETRIES = 2

// One page; retried on network errors, 5xx and bodies without a list, never on 4xx (e.g. a 401
// must still reach handleError, which logs out). The last error passes on unchanged.
const fetchStoryPage = async (url, retriesLeft = STORY_PAGE_RETRIES) => {
  try {
    const res = await callApi(url)
    if (!Array.isArray(res.data?.stories)) throw new Error(`No story list in ${url}`)
    return res
  } catch (error) {
    const status = error.response?.status
    if (retriesLeft === 0 || (status >= 400 && status < 500)) throw error
    await new Promise(resolve => setTimeout(resolve, 500 * (STORY_PAGE_RETRIES - retriesLeft + 1)))
    return fetchStoryPage(url, retriesLeft - 1)
  }
}

// Fetches a story query as at most five parallel pages, sized from the cached count so one round
// usually covers it; any further round uses pages as large as everything fetched so far.
const fetchStoriesInPages = async (route, language) => {
  const expected = readStoryCache(currentUserId(), language)?.length ?? 100
  let count = Math.min(
    PARALLEL_STORY_REQUESTS,
    Math.max(1, Math.ceil((expected + 1) / MIN_STORY_PAGE_SIZE)),
  )
  let size = Math.ceil((expected + 1) / count)
  let firstPage = 0
  const pages = []
  for (;;) {
    const results = await Promise.all(
      Array.from({ length: count }, (_, i) =>
        fetchStoryPage(`${route}&page=${firstPage + i}&page_size=${size}`),
      ),
    )
    results.forEach(res => pages.push(res.data.stories))
    if (results[results.length - 1].data.stories.length < size) break
    // Pages of the size fetched so far start exactly where this round ended (page 1).
    size *= firstPage + count
    firstPage = 1
    count = PARALLEL_STORY_REQUESTS
  }
  // A story added mid-fetch can shift a page boundary and repeat; keep its first copy.
  const seen = new Set()
  const stories = pages.flat().filter(story => {
    if (seen.has(story._id)) return false
    seen.add(story._id)
    return true
  })
  return { data: { stories, total_num: stories.length, language } }
}

// `meta.background` refetches without flipping `pending`, so on-screen story views don't blank.
export const getAllStories = (language, query, meta) => {
  const queryString = Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&')
  const route = `/stories?language=${language}&${queryString}`
  const prefix = 'GET_STORIES'
  const action = callBuilder(route, prefix)
  action.requestSettings.fetcher = () => fetchStoriesInPages(route, language)
  return { ...action, meta }
}

// Shows a cached list at once; StoryFetcher still fetches the fresh one right after.
export const restoreCachedStories = (language, stories) => ({
  type: 'RESTORE_CACHED_STORIES',
  language,
  stories,
})

export const setLastQuery = query => ({
  type: 'SET_LAST_QUERY',
  query,
})

export const clearFocusedStory = () => ({
  type: 'CLEAR_FOCUSED_STORY',
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

export const updateTempExerciseSettings = conceptSetting => ({
  type: 'SAVE_STORY_INTERMEDIATE',
  conceptSetting,
})

export const updateExerciseTopics = (topics, storyId) => {
  const route = `/stories/${storyId}`
  const prefix = 'SAVE_STORY'
  const payload = { topics }
  return callBuilder(route, prefix, 'post', payload)
}

export const updateTempExerciseTopics = topics => ({ type: 'SAVE_STORY_INTERMEDIATE', topics })

export const updateStoryPath = (storyId, path) => {
  const route = `/stories/${storyId}`
  const prefix = 'UPDATE_STORY_PATH'
  return callBuilder(route, prefix, 'post', { path })
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

export const storyVisibilityChange = (groupId, storyId, visibility) => {
  const route = `/groups/${groupId}/visibility`
  const prefix = 'SET_STORY_VISIBILITY'
  return callBuilder(route, prefix, 'post', { visibility, storyId })
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

export const answerAnnotation = (storyId, startId, endId, annotation, mode, thread_id) => {
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
  focusedRequestId: null,
  uploadedStoryId: null,
  uploadCachedError: false,
  error: false,
  currentQuery: '',
  loadingProgress: {}, // { [storyId]: progressData }
  readingQuestions: null, // response of /get_questions: { questions, session_id, ... }
  readingQuestionsPending: false,
  // Story whose progress changed but could not be patched from the answer; StoryFetcher then
  // refetches the list in the background. Normally null: answers carry the new progress.
  staleStoryId: null,
  // Set while an answer POST is in flight, so its SUCCESS knows which list entry to patch.
  answeringStoryId: null,
  // Stories removed optimistically, by request id, so a failed delete can put one back.
  removing: {},
  // Language of the full list in `data`, so store.js caches it under the right key.
  dataLanguage: null,
}

// A copy of `obj` without `key`.
const dropKey = (obj, key) => Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key))

const getStoryIdFromRoute = route => route?.match(/^\/stories\/([^/?]+)/)?.[1]

const updateStoryPathInList = (stories, storyId, path) => {
  if (!Array.isArray(stories)) return stories

  return stories.map(story =>
    String(story._id) === String(storyId) ? { ...story, path } : story,
  )
}

// Story list, focused story and their request states.
export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_STORY_LOADING_PROGRESS_ATTEMPT':
      return {
        ...state,
      }
    case 'GET_STORY_LOADING_PROGRESS_FAILURE':
      return {
        ...state,
      }
    case 'GET_STORY_LOADING_PROGRESS_SUCCESS': {
      const response = action.response?.response || action.response || {}
      const storyId = response.story_id || response.story?._id || action.meta?.storyId

      if (!storyId) {
        return state
      }

      return {
        ...state,
        loadingProgress: {
          ...state.loadingProgress,
          [storyId]: response,
        },
      }
    }
    case 'GET_STORIES_ATTEMPT': {
      // If background polling, do not set pending to true
      if (action.meta && action.meta.background) {
        return {
          ...state,
          error: false,
        }
      }
      return {
        ...state,
        pending: true,
        error: false,
      }
    }
    case 'GET_STORIES_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }

    // Practice / review / compete all post answers through GET_SNIPPET_ANSWERS. Take the story id
    // from the ATTEMPT's route, not the response: only ATTEMPT carries `requestSettings`, and the
    // answer payload is a snippet whose shape we should not depend on.
    case 'GET_SNIPPET_ANSWERS_ATTEMPT': {
      const answeredId = action.requestSettings?.route?.match(
        /^\/stories\/([^/]+)\/snippets\/answer/,
      )?.[1]
      return answeredId ? { ...state, answeringStoryId: answeredId } : state
    }

    // The answer response carries the story's new percent_cov / percent_perf (the same values the
    // list returns), so patch its entry in place; only a response without them refetches the list.
    case 'GET_SNIPPET_ANSWERS_SUCCESS': {
      const id = state.answeringStoryId
      const { percent_cov, percent_perf } = action.response ?? {}
      if (!id || percent_cov === undefined || percent_perf === undefined) {
        return { ...state, staleStoryId: id, answeringStoryId: null }
      }
      return {
        ...state,
        answeringStoryId: null,
        data: state.data.map(story =>
          String(story._id) === String(id) ? { ...story, percent_cov, percent_perf } : story,
        ),
      }
    }

    case 'GET_SNIPPET_ANSWERS_FAILURE':
      return { ...state, answeringStoryId: null }

    case 'REFRESH_STORY_PROGRESS_SUCCESS': {
      const fresh = action.response
      const id = action.query?.storyId ?? fresh?._id
      if (!id || !fresh) return { ...state, staleStoryId: null }

      return {
        ...state,
        staleStoryId: null,
        // Merge, don't replace: the list entry has fields the single-story payload may not.
        data: state.data.map(story =>
          String(story._id) === String(id) ? { ...story, ...fresh } : story,
        ),
      }
    }

    case 'REFRESH_STORY_PROGRESS_FAILURE':
      return { ...state, staleStoryId: null }
    case 'GET_STORIES_SUCCESS':
      return {
        ...state,
        staleStoryId: null,
        data: action.response.stories,
        totalNum: action.response.total_num,
        dataLanguage: action.response.language ?? null,
        pending: false,
        error: false,
        uploaded: false,
      }

    case 'RESTORE_CACHED_STORIES':
      return {
        ...state,
        data: action.stories,
        totalNum: action.stories.length,
        dataLanguage: action.language,
      }

    case 'SET_STORY_UPLOAD_UNFINISHED':
      return {
        ...state,
        data: state.data.map(story =>
          story._id === action.storyId ? { ...story, uploadUnfinished: action.value } : story,
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
        uploadedStoryId: null,
        uploadCachedError: false,
      }
    case 'UPLOAD_CACHED_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
        uploaded: false,
        // `error` is shared with every other story request, so the landing page needs a flag of
        // its own to tell "this upload failed" from "something else failed earlier".
        uploadCachedError: true,
      }
    case 'UPLOAD_CACHED_STORY_SUCCESS':
      return {
        ...state,
        pending: false,
        uploaded: true,
        // The id of the story the upload created, so a caller can open it instead of just
        // refreshing the library. The field name is not pinned down by the API, so take the first
        // of the plausible ones that is present.
        uploadedStoryId:
          action.response?.story_id ?? action.response?._id ?? action.response?.id ?? null,
      }
    case 'CLEAR_STORY_LIST':
      return initialState
    case 'CLEAR_FOCUSED_STORY':
      return {
        ...state,
        focused: null,
        focusedPending: false,
        focusedRequestId: null,
      }
    case 'GET_STORY_READING_QUESTIONS_ATTEMPT':
      return { ...state, readingQuestions: null, readingQuestionsPending: true, error: false }
    case 'GET_STORY_READING_QUESTIONS_FAILURE':
      return { ...state, readingQuestionsPending: false, error: true }
    case 'GET_STORY_READING_QUESTIONS_SUCCESS':
      return { ...state, readingQuestions: action.response, readingQuestionsPending: false, error: false }
    case 'GET_STORY_ATTEMPT': {
      const route = action.requestSettings?.route || ''
      const match = route.match(/^\/stories\/([^/?]+)/)
      const requestedId = match ? match[1] : null
      return {
        ...state,
        pending: true,
        focusedPending: true,
        focusedRequestId: requestedId,
        error: false,
      }
    }
    case 'GET_STORY_FAILURE':
      return {
        ...state,
        focusedPending: false,
        focusedRequestId: null,
        pending: false,
        error: true,
      }
    case 'GET_STORY_SUCCESS': {
      const normalizedResponse =
        action.response && !action.response._id && state.focusedRequestId
          ? { ...action.response, _id: state.focusedRequestId }
          : action.response

      if (
        state.focusedRequestId &&
        normalizedResponse?._id &&
        String(state.focusedRequestId) !== String(normalizedResponse._id)
      ) {
        return {
          ...state,
          pending: false,
          focusedPending: false,
          focusedRequestId: null,
          error: false,
        }
      }
      return {
        ...state,
        focused: normalizedResponse,
        pending: false,
        focusedPending: false,
        focusedRequestId: null,
        error: false,
      }
    }
    case 'GET_STUDENT_STORY_ATTEMPT': {
      const route = action.requestSettings?.route || ''
      const storyMatch = route.match(/[?&]story_id=([^&]+)/)
      const studentMatch = route.match(/[?&]student_id=([^&]+)/)
      return {
        ...state,
        pending: true,
        focusedPending: true,
        focusedRequestId: storyMatch ? storyMatch[1] : null,
        focusedStudentId: studentMatch ? studentMatch[1] : null,
        error: false,
      }
    }
    case 'GET_STUDENT_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        focusedPending: false,
        focusedRequestId: null,
        focusedStudentId: null,
        error: true,
      }
    case 'GET_STUDENT_STORY_SUCCESS': {
      // Stale-response guard: if the response carries a story _id that doesn't
      // match the currently-tracked request, drop it.
      if (
        state.focusedRequestId &&
        action.response?._id &&
        String(state.focusedRequestId) !== String(action.response._id)
      ) {
        return {
          ...state,
          pending: false,
          focusedPending: false,
          focusedRequestId: null,
          focusedStudentId: null,
          error: false,
        }
      }
      const normalizedResponse =
        action.response && !action.response._id && state.focusedRequestId
          ? { ...action.response, _id: state.focusedRequestId }
          : action.response
      return {
        ...state,
        focused: normalizedResponse,
        pending: false,
        focusedPending: false,
        focusedRequestId: null,
        focusedStudentId: null,
        error: false,
      }
    }
    case 'ADD_OR_EDIT_STORY_ANNOTATION_ATTEMPT':
      return {
        ...state,
        annotationPending: true,
        error: false,
      }
    case 'ADD_OR_EDIT_STORY_ANNOTATION_FAILURE':
      return {
        ...state,
        annotationPending: false,
        error: true,
      }
    case 'ADD_OR_EDIT_STORY_ANNOTATION_SUCCESS':
      return {
        ...state,
        annotationPending: false,
        focused: { ...state.focused, ...action.response, _id: action.response?._id ?? state.focused?._id },
        error: false,
      }
    case 'REMOVE_STORY_ANNOTATION_ATTEMPT':
      return {
        ...state,
        annotationPending: true,
        error: false,
      }
    case 'REMOVE_STORY_ANNOTATION_FAILURE':
      return {
        ...state,
        annotationPending: false,
        error: true,
      }
    case 'REMOVE_STORY_ANNOTATION_SUCCESS':
      return {
        ...state,
        annotationPending: false,
        focused: { ...state.focused, ...action.response, _id: action.response?._id ?? state.focused?._id },
        error: false,
      }
    case 'SAVE_STORY_INTERMEDIATE':
      return {
        ...state,
        focused: {
          ...state.focused,
          topics: action.topics,
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
    case 'UPDATE_STORY_PATH_ATTEMPT': {
      const storyId = getStoryIdFromRoute(action.requestSettings?.route)
      const path = action.requestSettings?.data?.path || ''

      return {
        ...state,
        data: updateStoryPathInList(state.data, storyId, path),
        searchResults: updateStoryPathInList(state.searchResults, storyId, path),
        focused:
          String(state.focused?._id) === String(storyId)
            ? { ...state.focused, path }
            : state.focused,
        error: false,
      }
    }
    case 'UPDATE_STORY_PATH_FAILURE':
      return {
        ...state,
        error: true,
      }
    case 'UPDATE_STORY_PATH_SUCCESS':
      return {
        ...state,
        error: false,
      }
    // Optimistic delete: the card disappears at once and `pending` is left alone, so the library
    // keeps rendering instead of swapping to a spinner. The story is stashed for a failed call.
    case 'REMOVE_STORY_ATTEMPT': {
      const removedId = action.requestSettings?.route?.match(/^\/stories\/([^/]+)\/remove/)?.[1]
      const index = state.data.findIndex(story => String(story._id) === String(removedId))
      if (index === -1) return { ...state, error: false }
      return {
        ...state,
        data: state.data.filter((_, i) => i !== index),
        removing: { ...state.removing, [action.requestId]: { story: state.data[index], index } },
        error: false,
      }
    }
    // Put the story back where it was; the Toaster reports the error.
    case 'REMOVE_STORY_FAILURE': {
      const stashed = state.removing[action.requestId]
      const data = stashed
        ? [...state.data.slice(0, stashed.index), stashed.story, ...state.data.slice(stashed.index)]
        : state.data
      return { ...state, data, removing: dropKey(state.removing, action.requestId), error: true }
    }
    case 'REMOVE_STORY_SUCCESS': {
      const removedId = String(action.response.story_id)
      const wasFocused = String(state.focused?._id) === removedId
      return {
        ...state,
        data: state.data.filter(story => String(story._id) !== removedId),
        focused: wasFocused ? null : state.focused,
        focusedPending: wasFocused ? false : state.focusedPending,
        removing: dropKey(state.removing, action.requestId),
        error: false,
      }
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
          group => group.group_id !== action.response.group.group_id,
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
          group =>
            (group.group_id !== action.response.group_id && group) || {
              ...changedGroup,
              hidden: action.response.hidden,
            },
        )
        draft.pending = false
        draft.error = false
      })

    default:
      return state
  }
}
