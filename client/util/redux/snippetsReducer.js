import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

const filterPrevious = (previous, snippet) => {
  const restarted = previous.length > 0 && snippet.snippetid[0] === snippet.total_num - 1
  if (!snippet || restarted) return []
  return previous.concat(snippet)
}

export const getCurrentSnippet = (storyId, controlledStory) => {
  const route = controlledStory
    ? `/stories/${storyId}/snippets/next?frozen_exercise=True`
    : `/stories/${storyId}/snippets/next`
  const prefix = 'GET_CURRENT_SNIPPET'
  return callBuilder(route, prefix)
}

export const getNextSnippet = (storyId, currentSnippetId, controlledStory) => {
  const route = controlledStory
    ? `/stories/${storyId}/snippets/next?previous=${currentSnippetId}&frozen_exercise=True`
    : `/stories/${storyId}/snippets/next?previous=${currentSnippetId}`
  const prefix = 'GET_NEXT_SNIPPET'
  return callBuilder(route, prefix)
}

export const initializePrevious = storyId => {
  const route = `/stories/${storyId}/snippets/completed`
  const prefix = 'GET_PREVIOUS_SNIPPETS'
  return callBuilder(route, prefix)
}

export const getNextSnippetFromCache = snippet => ({
  type: 'GET_NEXT_FROM_CACHE',
  nextSnippet: snippet,
})

export const resetCurrentSnippet = (storyId, controlledStory) => {
  const route = controlledStory
    ? `/stories/${storyId}/snippets/reset?frozen_exercise=True`
    : `/stories/${storyId}/snippets/reset`
  const prefix = 'RESET_SNIPPET_INDEX'
  return callBuilder(route, prefix, 'post')
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

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { previous: [], pending: false, error: false }, action) => {
  switch (action.type) {
    case 'RESET_SNIPPET_INDEX_SUCCESS':
      return {
        ...state,
        previous: [],
        focused: action.response,
        pending: false,
        error: false,
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
        pending: false,
        error: false,
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
        pending: false,
        error: false,
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
      }

    case 'GET_NEXT_FROM_CACHE':
      return {
        ...state,
        focused: action.nextSnippet,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
