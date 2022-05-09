import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const resetControlledStoryEditor = storyId => {
  const route = `/stories/${storyId}/frozen_snippet/next?reset=True`
  const prefix = 'RESET_FROZEN_STORY_EDITOR'
  return callBuilder(route, prefix, 'post')
}

export const cancelControlledStory = storyId => {
  const route = `/stories/${storyId}/frozen_snippet/delete`
  const prefix = 'CANCEL_CONTROLLED_STORY'
  return callBuilder(route, prefix)
}

export const getCurrentSnippetFrozen = storyId => {
  const route = `/stories/${storyId}/frozen_snippet/next`
  const prefix = 'GET_CURRENT_SNIPPET_FROZEN'
  return callBuilder(route, prefix, 'post', {})
}

export const freezeControlledStory = (storyId, snippets) => {
  const route = `/stories/${storyId}/frozen`
  const prefix = 'FREEZE_ALL_SNIPPETS'
  const payload = { snippets }
  return callBuilder(route, prefix, 'post', payload)
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
  const payload = { accepted_tokens: acceptedTokens, freeze_snippet: true }
  return callBuilder(route, prefix, 'post', payload)
}

export const getFrozenSnippetsPreview = storyId => {
  const route = `/stories/${storyId}?frozen_snippet=True&user_mode=preview`
  const prefix = 'GET_FROZEN_SNIPPETS_PREVIEW'
  return callBuilder(route, prefix)
}

export const resetCurrentSnippet = storyId => {
  const route = `/stories/${storyId}/snippets/reset`
  const prefix = 'RESET_SNIPPET_INDEX'
  return callBuilder(route, prefix, 'post')
}

export const addExercise = wordObj => ({ type: 'ADD_EXERCISE', wordObj })
export const removeExercise = wordObj => ({ type: 'REMOVE_EXERCISE', wordObj })
export const initControlledExerciseSnippets = snippets => ({
  type: 'INIT_CONTROLLED_SNIPPETS',
  snippets,
})
export const setPrevious = previous => ({ type: 'SET_PREVIOUS_FROZEN_SNIPPETS', payload: previous })
export const addToPrevious = snippet => ({ type: 'ADD_TO_FROZEN_SNIPPETS', snippet })
export const clearFocusedSnippet = () => ({ type: 'CLEAR_FOCUSED_SNIPPET' })

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (
  state = {
    previous: [],
    acceptedTokens: [],
    snippets: {},
    pending: false,
    error: false,
    getNextSnippet: false,
    finished: false,
    inProgress: false,
  },
  action
) => {
  switch (action.type) {
    case 'INIT_CONTROLLED_SNIPPETS':
      return {
        ...state,
        snippets: action.snippets,
        inProgress: false,
      }
    case 'ADD_EXERCISE':
      state.snippets[action.wordObj.snippet_id] = state.snippets[action.wordObj.snippet_id].concat(
        action.wordObj
      )
      return {
        ...state,
        inProgress: true,
      }

    case 'REMOVE_EXERCISE':
      state.snippets[action.wordObj.snippet_id] = state.snippets[action.wordObj.snippet_id].filter(
        word => word.id !== action.wordObj.id
      )
      return {
        ...state,
      }

    case 'RESET_SNIPPET_INDEX_SUCCESS':
      return {
        ...state,
        previous: [],
        focused: action.response,
        pending: false,
        error: false,
      }

    case 'RESET_FROZEN_STORY_EDITOR_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }

    case 'RESET_FROZEN_STORY_EDITOR_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }

    case 'RESET_FROZEN_STORY_EDITOR_SUCCESS':
      return {
        ...state,
        focused: action.response,
        previous: [],
        pending: false,
        error: false,
      }

    case 'CANCEL_CONTROLLED_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }

    case 'CANCEL_CONTROLLED_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }

    case 'CANCEL_CONTROLLED_STORY_SUCCESS':
      return {
        ...state,
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
        previous: action.response.previous_snippets,
        pending: false,
        error: false,
      }

    case 'REFRESH_CURRENT_SNIPPET_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
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
        pending: false,
        error: false,
      }

    case 'GET_STORY_ATTEMPT':
      return {
        ...state,
        focused: undefined,
        previous: [],
      }
    case 'FREEZE_ALL_SNIPPETS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'FREEZE_ALL_SNIPPETS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'FREEZE_ALL_SNIPPETS_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        finished: true,
      }
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
        focused: action.response,
        pending: false,
        error: false,
      }

    case 'SET_PREVIOUS_FROZEN_SNIPPETS':
      return {
        ...state,
        previous: action.payload,
      }

    case 'ADD_TO_FROZEN_SNIPPETS':
      return {
        ...state,
        previous: state.previous.concat(action.snippet),
      }

    case 'GET_FROZEN_SNIPPETS_PREVIEW_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }

    case 'GET_FROZEN_SNIPPETS_PREVIEW_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }

    case 'GET_FROZEN_SNIPPETS_PREVIEW_SUCCESS':
      return {
        ...state,
        previous: action.response.paragraph,
        pending: false,
        error: false,
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
