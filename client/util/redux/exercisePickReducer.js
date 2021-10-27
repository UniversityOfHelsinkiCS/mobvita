import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getCurrentSnippetFrozen = storyId => {
  const route = `/stories/${storyId}/frozen_snippet/next`
  const prefix = 'GET_CURRENT_SNIPPET_FROZEN'
  return callBuilder(route, prefix, 'post', {})
}

export const refreshCurrentSnippet = (storyId, currentSnippetId, acceptedTokens) => {
  const route =
    currentSnippetId > 0
      ? `/stories/${storyId}/frozen_snippet/next?previous=${currentSnippetId - 1}`
      : `/stories/${storyId}/frozen_snippet/next`
  const prefix = 'REFRESH_CURRENT_SNIPPET'
  const payload = { accepted_tokens: acceptedTokens }
  return callBuilder(route, prefix, 'post', payload)
}

export const getNextSnippetFrozen = (storyId, currentSnippetId, acceptedTokens) => {
  const route = `/stories/${storyId}/frozen_snippet/next?previous=${currentSnippetId}`
  const prefix = 'GET_NEXT_SNIPPET_FROZEN'
  const payload = { accepted_tokens: acceptedTokens }
  return callBuilder(route, prefix, 'post', payload)
}

export const resetCurrentSnippet = storyId => {
  const route = `/stories/${storyId}/snippets/reset`
  const prefix = 'RESET_SNIPPET_INDEX'
  return callBuilder(route, prefix, 'post')
}

export const setPrevious = previous => ({ type: 'SET_PREVIOUS', payload: previous })
export const addToPrevious = snippet => ({ type: 'ADD_TO_PREVIOUS', snippet })
export const clearFocusedSnippet = () => ({ type: 'CLEAR_FOCUSED_SNIPPET' })

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (
  state = { previous: [], acceptedTokens: [], pending: false, error: false, getNextSnippet: false },
  action
) => {
  switch (action.type) {
    case 'RESET_SNIPPET_INDEX_SUCCESS':
      return {
        ...state,
        previous: [],
        focused: action.response,
        pending: false,
        error: false,
      }
    case 'GET_CURRENT_SNIPPET_FROZEN_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_CURRENT_SNIPPET_FROZEN_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_CURRENT_SNIPPET_FROZEN_SUCCESS':
      return {
        ...state,
        focused: action.response,
        acceptedTokens: action.response.practice_snippet.filter(word => word.id),
        pending: false,
        error: false,
      }
    case 'REFRESH_CURRENT_SNIPPET_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
        acceptedTokens: [],
      }
    case 'REFRESH_CURRENT_SNIPPET_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'REFRESH_CURRENT_SNIPPET_SUCCESS':
      return {
        ...state,
        focused: action.response,
        acceptedTokens: state.acceptedTokens.concat(
          action.response.practice_snippet.filter(word => word.id)
        ),
        pending: false,
        error: false,
      }

    case 'GET_STORY_ATTEMPT':
      return {
        ...state,
        focused: undefined,
        previous: [],
      }
    // ---

    case 'GET_NEXT_SNIPPET_FROZEN_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
        acceptedTokens: [],
      }

    case 'GET_NEXT_SNIPPET_FROZEN_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }

    case 'GET_NEXT_SNIPPET_FROZEN_SUCCESS':
      return {
        ...state,
        // previous: filterPrevious(state.previous, state.focused),
        focused: action.response,
        acceptedTokens: state.acceptedTokens.concat(
          action.response.practice_snippet.filter(word => word.id)
        ),
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

    default:
      return state
  }
}
