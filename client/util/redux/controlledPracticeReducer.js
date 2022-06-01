import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const cancelControlledStory = storyId => {
  const route = `/stories/${storyId}/frozen_snippet/delete`
  const prefix = 'CANCEL_CONTROLLED_STORY'
  return callBuilder(route, prefix)
}

export const freezeControlledStory = (storyId, snippets) => {
  const route = `/stories/${storyId}/frozen`
  const prefix = 'FREEZE_ALL_SNIPPETS'
  const payload = { snippets }
  return callBuilder(route, prefix, 'post', payload)
}

export const getFrozenTokens = storyId => {
  const route = `/stories/${storyId}/frozen`
  const prefix = 'GET_FROZEN_TOKENS'

  return callBuilder(route, prefix)
}

export const getFrozenSnippetsPreview = storyId => {
  const route = `/stories/${storyId}?frozen_snippet=True&user_mode=preview`
  const prefix = 'GET_FROZEN_SNIPPETS_PREVIEW'
  return callBuilder(route, prefix)
}

export const addExercise = wordObj => ({ type: 'ADD_EXERCISE', wordObj })
export const removeExercise = wordObj => ({ type: 'REMOVE_EXERCISE', wordObj })
export const initControlledExerciseSnippets = snippets => ({
  type: 'INIT_CONTROLLED_SNIPPETS',
  snippets,
})

const getHiddenWords = frozen_snippets => {
  if (frozen_snippets) {
    const tokens = Object.values(frozen_snippets).flat(1).filter(exerciseToken => 
      exerciseToken.analytic && exerciseToken.is_head && !exerciseToken.audio)
    const headId = tokens.map(token => token.ID)
    return  tokens.map(token => token.cand_index).flat(1).filter(index => !headId.includes(index))
  } else return []
  
}

export const resetControlledStory = snippets => ({ type: 'RESET_CONTROLLED_STORY', snippets })

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (
  state = {
    previous: [],
    snippets: {},
    pending: false,
    error: false,
    getNextSnippet: false,
    finished: false,
    inProgress: false,
    frozen_snippets: {},
    hiddenWords: [],
    reset: false,
  },
  action
) => {
  switch (action.type) {
    case 'INIT_CONTROLLED_SNIPPETS':
      return {
        ...state,
        snippets: action.snippets,
        finished: false,
        inProgress: true,
        hiddenWords: getHiddenWords(action.snippets),
        reset: true,
      }
    case 'RESET_CONTROLLED_STORY':
      return {
        ...state,
        snippets: action.snippets,
        finished: false,
        inProgress: false,
        hiddenWords: [],
      }

    case 'ADD_EXERCISE':
      state.snippets[action.wordObj.snippet_id] = state.snippets[action.wordObj.snippet_id].concat(
        action.wordObj
      )
      return {
        ...state,
        hiddenWords: getHiddenWords(state.snippets),
        inProgress: true,
        reset: false,
      }

    case 'REMOVE_EXERCISE':
      state.snippets[action.wordObj.snippet_id] = state.snippets[action.wordObj.snippet_id].filter(
        word => word.ID !== action.wordObj.ID
      )
      return {
        ...state,
        hiddenWords: getHiddenWords(state.snippets),
        inProgress: true,
        reset: false,
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

    case 'GET_STORY_ATTEMPT':
      return {
        ...state,
        focused: undefined,
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
        reset: false,
      }
    case 'GET_FROZEN_TOKENS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
        reset: false,
      }
    case 'GET_FROZEN_TOKENS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_FROZEN_TOKENS_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
        frozen_snippets: action.response.frozen_snippets,
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

    default:
      return state
  }
}
