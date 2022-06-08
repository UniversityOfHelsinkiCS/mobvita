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

export const sendActivity = (
  storyId,
  competition_id,
  botCorrectPercent,
  startTime,
  learningLanguage,
  num_correct,
  totalExercises,
) => {
  const route = `/stories/${storyId}/competition`
  const prefix = 'SEND_COMPETE_ACTIVITY'
  const payload = {
    competition_id,
    bnc: botCorrectPercent,
    start_time: startTime,
    end_time: new Date(),
    language: learningLanguage,
    num_correct,
    num_total: totalExercises,
  }

  return callBuilder(route, prefix, 'post', payload)
}

export const resetCachedSnippets = () => ({
  type: 'RESET_CACHED_SNIPPETS',
})

export const initializeTimer = timerControls => ({
  type: 'INITIALIZE_TIMER',
  timerControls,
})

export const setWillPause = value => ({
  type: 'SET_WILL_PAUSE',
  value,
})

export const setIsPaused = value => ({
  type: 'SET_IS_PAUSED',
  value,
})

const initialState = { cachedSnippets: [], timerControls: null, isPaused: false, willPause: false }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_OPPONENT_SUCCESS':
      return {
        ...state,
        snippetCompleteTime: action.response.snippet_complete_time,
        totalTime: action.response.total_time,
        botCorrectPercent: action.response.bnc,
        competition_id: action.response.competition_id,
      }
    case 'INITIALIZE_TIMER':
      return {
        ...state,
        timerControls: action.timerControls,
      }

    case 'SET_WILL_PAUSE':
      return {
        ...state,
        willPause: action.value,
      }

    case 'SET_IS_PAUSED':
      return {
        ...state,
        isPaused: action.value,
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
        startTime: new Date(),
        willPause: false,
        isPaused: false,
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
