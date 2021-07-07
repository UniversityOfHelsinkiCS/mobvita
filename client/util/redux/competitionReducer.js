import callBuilder from '../apiConnection'

export const getOpponent = storyId => {
  if (!storyId) return undefined

  const route = `/opponent?story_id=${storyId}`
  const prefix = 'GET_OPPONENT'
  return callBuilder(route, prefix)
}

export const competitionStartNow = () => ({
  type: 'COMPETITION_START',
  startTime: new Date().getTime(),
})

const filterDuplicates = snippets => {
  return snippets.filter((v, i, a) => a.findIndex(t => t.snippetid[0] === v.snippetid[0]) === i)
}

export const addWrongExercises = amount => ({ type: 'WRONG_ADD', amount })

export const addTotalExercises = amount => ({ type: 'TOTAL_ADD', amount })

export const getAndCacheNextSnippet = (storyId, currentSnippetId) => {
  const route = `/stories/${storyId}/snippets/next?previous=${currentSnippetId}`
  const prefix = 'GET_AND_CACHE_NEXT_SNIPPET'
  return callBuilder(route, prefix)
}

export const resetCachedSnippets = () => ({
  type: 'RESET_CACHED_SNIPPETS',
})

export default (state = { cachedSnippets: [] }, action) => {
  switch (action.type) {
    case 'GET_OPPONENT_SUCCESS':
      return {
        ...state,
        snippetCompleteTime: action.response.snippet_complete_time,
        totalTime: action.response.total_time,
        botCorrectPercent: action.response.bnc,
      }
    case 'WRONG_ADD':
      return {
        ...state,
        wrong: state.wrong + action.amount,
      }
    case 'TOTAL_ADD':
      return {
        ...state,
        total: state.total + action.amount,
      }
    case 'COMPETITION_START':
      return {
        ...state,
        startTime: action.startTime,
      }

    case 'GET_AND_CACHE_NEXT_SNIPPET_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_AND_CACHE_NEXT_SNIPPET_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }

    case 'GET_AND_CACHE_NEXT_SNIPPET_SUCCESS':
      return {
        ...state,
        cachedSnippets: filterDuplicates(state.cachedSnippets.concat(action.response)),
        pending: false,
        error: false,
      }
    case 'RESET_CACHED_SNIPPETS':
      return {
        ...state,
        cachedSnippets: [],
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
