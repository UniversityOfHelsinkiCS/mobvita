import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */


export const resetSnippets = () => ({ type: 'RESET_SNIPPETS' })

export const getLessonSnippet = (lessonId, groupId) => {
  let route = `/lesson/exercise`
  if (groupId) {
    route += `?group_id=${groupId}`
  }
  const prefix = 'GET_LESSON_SNIPPET'

  return callBuilder(route, prefix)
}

export const cacheLessonSnippet = (lessonId, groupId, candidateIds, topics) => {
  let route = `/lesson/exercise`
  if (candidateIds.length === 0 && groupId) {
    route += `?group_id=${groupId}`
  } else if (groupId) {
    route += `?group_id=${groupId}&exclude_candidates=${candidateIds.join(',')}`
  } else {
    route += `?exclude_candidates=${candidateIds.join(',')}`
  }

  if (topics.length && route.includes('?')) {
    route += `&topics=${encodeURIComponent(topics.join('#'))}`
  } else if (topics.length) {
    route += `?topics=${encodeURIComponent(topics.join('#'))}`
  }

  const prefix = 'CACHE_NEXT_SNIPPET'

  return callBuilder(route, prefix)
}

export const postLessonSnippetAnswers = (lessonId, answersObject, compete = false) => {
  const payload = answersObject
  payload.compete = compete
  const route = `/lesson/exercise`
  const prefix = 'GET_LESSON_SNIPPET_ANSWER'

  return callBuilder(route, prefix, 'post', payload)
}

const filterPrevious = (previous, snippet) => {
  const restarted = previous.length > 0 && snippet.snippetid[0] === snippet.total_num - 1
  if (!snippet || restarted) return []
  return previous.concat(snippet)
}

export const setSnippetChatHistory = (snippet_chat_history={}) => ({ 
  type: 'SET_SNIPPET_CHAT_HISTORY', 
  snippet_chat_history: snippet_chat_history,
});

export const getCurrentSnippet = (storyId, controlledStory, exerciseMode) => {
  const route = controlledStory
    ? `/stories/${storyId}/snippets/next?frozen_exercise=True`
    : `/stories/${storyId}/snippets/next?exercise_mode=${exerciseMode}`
  const prefix = 'GET_CURRENT_SNIPPET'
  return callBuilder(route, prefix)
}

export const getNextSnippet = (
  storyId,
  currentSnippetId,
  isControlledStory,
  sessionId,
  exerciseMode
) => {
  const route =
    isControlledStory && sessionId
      ? `/stories/${storyId}/snippets/next?previous=${currentSnippetId}&frozen_exercise=True&session_id=${sessionId}`
      : `/stories/${storyId}/snippets/next?previous=${currentSnippetId}&exercise_mode=${exerciseMode}`
  const prefix = 'GET_NEXT_SNIPPET'
  return callBuilder(route, prefix)
}

export const cacheStorySnippet = (
  storyId,
  currentSnippetId,
  isControlledStory=false,
  sessionId=null,
  exerciseMode=null,
  reset=false
) => {
  const nextOrReset = reset ? 'reset?' : `next?previous=${currentSnippetId}&session_id=${sessionId}&`
  const route =
  isControlledStory && sessionId
    ? `/stories/${storyId}/snippets/${nextOrReset}frozen_exercise=True`
    : `/stories/${storyId}/snippets/${nextOrReset}exercise_mode=${exerciseMode}`
  const prefix = 'CACHE_NEXT_SNIPPET'
  return callBuilder(route, prefix)
}

export const dropCachedSnippet = (snippetKey) => ({
  type: 'DROP_CACHED_SNIPPET',
  snippetKey
})

export const resetCachedSnippets = () => ({
  type: 'RESET_CACHED_SNIPPETS',
})

const processCachedSnippets = (snippets) => {
  const snippetIds = Object.values(snippets).map(snippet => snippet.snippetid).flat()
  const coveredCandidates = new Set(Object.values(snippets).map(
      snippet => snippet.practice_snippet.filter(token=>token.id).map(
          token=>token.id)).flat())
  return {
      cachedSnippetIds: Array.from(snippetIds).sort(),
      candidatesInCache: Array.from(coveredCandidates).sort(),
      cacheSize: Object.keys(snippets).length
  }
}

export const initializePrevious = (storyId, controlledStory) => {
  const route = controlledStory
    ? `/stories/${storyId}/snippets/completed?frozen_exercise=True`
    : `/stories/${storyId}/snippets/completed`
  const prefix = 'GET_PREVIOUS_SNIPPETS'
  return callBuilder(route, prefix)
}

export const getNextSnippetFromCache = (snippetKey, snippet, reset=false) => ({
  type: 'GET_NEXT_FROM_CACHE',
  nextSnippetKey: snippetKey,
  nextSnippet: snippet,
  resetStory: reset,
})

export const resetCurrentSnippet = (storyId, controlledStory, exerciseMode) => {
  const route = controlledStory
    ? `/stories/${storyId}/snippets/reset?frozen_exercise=True`
    : `/stories/${storyId}/snippets/reset?exercise_mode=${exerciseMode}`
  const prefix = 'RESET_SNIPPET_INDEX'
  return callBuilder(route, prefix)
}

export const postAnswers = (storyId, answersObject, compete = false) => {
  const payload = answersObject

  payload.compete = compete
  const route = `/stories/${storyId}/snippets/answer`
  const prefix = 'GET_SNIPPET_ANSWERS'
  return callBuilder(route, prefix, 'post', payload)
}

export const setPrevious = previous => ({ type: 'SET_PREVIOUS', payload: previous })
export const addToPrevious = snippet => ({ type: 'ADD_TO_PREVIOUS', snippet })
export const clearFocusedSnippet = () => ({ type: 'CLEAR_FOCUSED_SNIPPET' })
export const resetSessionId = () => ({ type: 'RESET_SESSION_ID' })

export const initEloHearts = wordId => ({ type: 'SET_INITIAL_ELO_HEARTS', wordId })

export const decreaseEloHearts = wordId => ({ type: 'DECREASE_ELO_HEARTS', wordId })

export const clearEloHearts = () => ({ type: 'CLEAR_ELO_HEARTS' })

const initialState = {
  previous: [], 
  cachedSnippets: {}, 
  lastCachedSnippetKey: null,
  nextSnippetKeyFromCache: null,
  candidatesInCache: [],
  cacheSize: 0,
  pending: false, 
  error: false,
  cacheRequesting: false,
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_SNIPPET_INDEX_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'RESET_SNIPPET_INDEX_SUCCESS':
      return {
        ...state,
        previous: [],
        focused: action.response,
        sessionId: action.response.session_id,
        pending: false,
        error: false,
      }

    case 'RESET_SNIPPETS':
      return {
        ...state,
        previous: [],
        focused: undefined,
      }

    case 'GET_LESSON_SNIPPET_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_LESSON_SNIPPET_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_LESSON_SNIPPET_SUCCESS':
      let focused_snippet = action.response
      focused_snippet?.practice_snippet.forEach(token => {
        token['story_id'] = focused_snippet?.storyid
      })
      return {
        ...state,
        pending: false,
        focused: focused_snippet,
        focused_snippet_chat_history: action.response.chat_history,
        session_id: action.response.session_id,
        testTime: action.response.test_time,
        eloHearts: {},
      }
      case 'GET_LESSON_SNIPPET_ANSWER_ATTEMPT':
        return {
          ...state,
          answersPending: true,
        }
      case 'GET_LESSON_SNIPPET_ANSWER_FAILURE':
        return {
          ...state,
          answersPending: false,
          pending: false,
          error: true,
        }
      case 'GET_LESSON_SNIPPET_ANSWER_SUCCESS':
        if (!Array.isArray(action.response.snippetid)){
          action.response.snippetid = [action.response.snippetid]
        }
        return {
          ...state,
          focused: action.response,

          answersPending: false,
        }

    case 'GET_CURRENT_SNIPPET_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_CURRENT_SNIPPET_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_CURRENT_SNIPPET_SUCCESS':
      return {
        ...state,
        focused: action.response,
        focused_snippet_chat_history: action.response.chat_history,
        sessionId: action.response.session_id,
        testTime: action.response.test_time,
        lastCachedSnippetKey: 'anyKey', // to trigger caching
        pending: false,
        error: false,
        eloHearts: {},
      }
    case 'GET_SNIPPET_ANSWERS_ATTEMPT':
      return {
        ...state,
        answersPending: true,
      }
    case 'GET_SNIPPET_ANSWERS_FAILURE':
      return {
        ...state,
        answersPending: false,
        error: true,
        pending: false,
      }
    case 'GET_SNIPPET_ANSWERS_SUCCESS':
      return {
        ...state,
        focused: action.response,
        answersPending: false,
      }
    case 'GET_STORY_ATTEMPT':
      return {
        ...state,
        focused: undefined,
        previous: [],
      }
    case 'GET_NEXT_SNIPPET_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_NEXT_SNIPPET_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_NEXT_SNIPPET_SUCCESS':
      return {
        ...state,
        // previous: filterPrevious(state.previous, state.focused),
        focused: action.response,
        focused_snippet_chat_history: action.snippet_chat_history,
        testTime: action.response.test_time,
        pending: false,
        error: false,
        eloHearts: {},
      }
    case 'GET_PREVIOUS_SNIPPETS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_PREVIOUS_SNIPPETS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_PREVIOUS_SNIPPETS_SUCCESS':
      return {
        ...state,
        previous: action.response.paragraph,
        pending: false,
        error: false,
      }
    case 'SET_PREVIOUS':
      return {
        ...state,
        previous: action.payload,
      }
    case 'ADD_TO_PREVIOUS':
      return {
        ...state,
        previous: state.previous.concat(action.snippet),
      }
    case 'CLEAR_FOCUSED_SNIPPET':
      return {
        ...state,
        focused: undefined,
        eloHearts: {},
      }

    case 'RESET_SESSION_ID':
      return {
        ...state,
        sessionId: undefined,
      }

    case 'GET_NEXT_FROM_CACHE':
      return {
        ...state,
        previous: !action.resetStory && state.previous || [],
        focused: action.nextSnippet,
        nextSnippetKeyFromCache: action.nextSnippetKey,
        pending: action.nextSnippet === undefined,
        error: false,
      }
    case 'SET_INITIAL_ELO_HEARTS':
      return {
        ...state,
        eloHearts: {
          ...state.eloHearts,
          [action.wordId]: 5,
        },
      }
    case 'DECREASE_ELO_HEARTS':
      if (state.eloHearts[action.wordId] === 0) {
        return {
          ...state,
        }
      }
      return {
        ...state,
        eloHearts: {
          ...state.eloHearts,
          [action.wordId]: state.eloHearts[action.wordId] - 1,
        },
      }
    case 'CLEAR_ELO_HEARTS':
      return {
        ...state,
        eloHearts: {},
      }
    case 'SET_SNIPPET_CHAT_HISTORY':
      return {
        ...state,
        // focused: {
        //   ...state.focused,
        //   chat_history: action.snippet_chat_history,
        // },
        focused_snippet_chat_history: action.snippet_chat_history,
      };
    
    case 'CACHE_NEXT_SNIPPET_ATTEMPT':
      return {
        ...state,
        cacheRequesting: true,
      }

    case 'CACHE_NEXT_SNIPPET_SUCCESS':
      const snippet = {...action.response, 
        practice_snippet: action.response.practice_snippet.map(
          token => ({...token, story_id: action.response.storyid}))}
      const snippetKey = snippet.snippetid.length && `${snippet.storyid}-${snippet.snippetid[0]}` || 'endKey'
      if (state.nextSnippetKeyFromCache === snippetKey || 
      state.nextSnippetKeyFromCache === 'anyKey') {
        return {
          ...state,
          focused: snippet,
          nextSnippetKeyFromCache: null,
          pending: false,
          error: false,
          cacheRequesting: false,
        }
      }
      const snippets = {
        ...state.cachedSnippets,
        [snippetKey]: snippet,
      }
      return {
        ...state,
        cacheRequesting: false,
        cachedSnippets: snippets,
        lastCachedSnippetKey: snippetKey,
        ...processCachedSnippets(snippets),
      }

    case 'DROP_CACHED_SNIPPET':
      const { [action.snippetKey]: undefined, ...newSnippets } = state.cachedSnippets
      return {
        ...state,
        cachedSnippets: newSnippets,
        ...processCachedSnippets(newSnippets),
      }

    case 'RESET_CACHED_SNIPPETS':
      return {
        ...state,
        cachedSnippets: {}, 
        cachedSnippetIds: [], 
        candidatesInCache: [],
        lastCachedSnippetKey: null,
        nextSnippetKeyFromCache: null,
        cacheSize: 0,
      }
    default:
      return state
  }
}