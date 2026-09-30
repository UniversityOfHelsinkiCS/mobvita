import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const cancelControlledStory = storyId => {
  const route = `/stories/${storyId}/frozen_snippet/delete`
  const prefix = 'CANCEL_CONTROLLED_STORY'
  return callBuilder(route, prefix)
}

export const freezeControlledStory = (storyId, snippets, timedExercise) => {
  const route = `/stories/${storyId}/frozen`
  const prefix = 'FREEZE_ALL_SNIPPETS'
  const payload = { snippets, timedExercise }
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

const getHiddenWordIds = frozen_snippets => {
  if (frozen_snippets) {
    const tokens = Object.values(frozen_snippets).flat(1).filter(exerciseToken => 
      (exerciseToken.analytic || exerciseToken.multi_token) && 
      exerciseToken.is_head && !exerciseToken.audio || 
      exerciseToken.multi_mc && exerciseToken.is_head && exerciseToken.choices && exerciseToken.multi_mc_concept &&
      exerciseToken.multi_mc_concept === exerciseToken.concept.replace('concept_id: ', ''))
    const headId = tokens.map(token => token.ID)
    return  tokens.map(token => token.cand_index).flat(1).filter(index => !headId.includes(index))
  } else return []
  
}

export const resetControlledStory = snippets => ({ type: 'RESET_CONTROLLED_STORY', snippets })

// The word the editor last clicked, so the sidebar can show what the tooltip shows. Null clears it.
export const setEditorFocusedWord = word => ({ type: 'SET_EDITOR_FOCUSED_WORD', word })

// The sidebar asks a word to open its own exercise-type modal — the handlers that add an exercise
// live in the word component, so only the request travels through the store.
export const requestExerciseOptions = wordId => ({ type: 'REQUEST_EXERCISE_OPTIONS', wordId })

// Same round trip for taking an exercise away again.
export const requestExerciseRemoval = wordId => ({ type: 'REQUEST_EXERCISE_REMOVAL', wordId })

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
    hiddenWordIds: [],
    reset: false,
    editorFocusedWord: null,
    exerciseOptionsForWordId: null,
    exerciseRemovalForWordId: null,
  },
  action
) => {
  switch (action.type) {
    case 'SET_EDITOR_FOCUSED_WORD':
      return {
        ...state,
        editorFocusedWord: action.word,
        exerciseOptionsForWordId: null,
        exerciseRemovalForWordId: null,
      }

    case 'REQUEST_EXERCISE_OPTIONS':
      return {
        ...state,
        exerciseOptionsForWordId: action.wordId,
      }

    case 'REQUEST_EXERCISE_REMOVAL':
      return {
        ...state,
        exerciseRemovalForWordId: action.wordId,
      }

    case 'INIT_CONTROLLED_SNIPPETS':
      return {
        ...state,
        snippets: action.snippets,
        finished: false,
        inProgress: true,
        hiddenWordIds: getHiddenWordIds(action.snippets),
        reset: true,
      }
    case 'RESET_CONTROLLED_STORY':
      return {
        ...state,
        snippets: action.snippets,
        finished: false,
        inProgress: false,
        hiddenWordIds: [],
      }

    case 'ADD_EXERCISE':
      state.snippets[action.wordObj.snippet_id] = state.snippets[action.wordObj.snippet_id].concat(
        action.wordObj
      )
      return {
        ...state,
        hiddenWordIds: getHiddenWordIds(state.snippets),
        inProgress: true,
        reset: false,
      }

    case 'REMOVE_EXERCISE':
      state.snippets[action.wordObj.snippet_id] = state.snippets[action.wordObj.snippet_id].filter(
        word => word.ID !== action.wordObj.ID
      )
      return {
        ...state,
        hiddenWordIds: getHiddenWordIds(state.snippets),
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
        timedExercise: false,
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
        timedExercise: action.response.timed_exercise,
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
