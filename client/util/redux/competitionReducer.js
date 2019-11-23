import callBuilder from '../apiConnection'

export const getOpponent = (storyId) => {
  if (!storyId) return undefined

  const route = `/opponent?story_id=${storyId}`
  const prefix = 'GET_OPPONENT'
  return callBuilder(route, prefix)
}

export const competitionStartNow = () => ({ type: 'COMPETITION_START', startTime: (new Date()).getTime() })

export const addWrongExercises = amount => ({ type: 'WRONG_ADD', amount })

export const addTotalExercises = amount => ({ type: 'TOTAL_ADD', amount })

export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_OPPONENT_SUCCESS':
      return {
        ...state,
        snippetCompleteTime: action.response.snippet_complete_time,
        totalTime: action.response.total_time,
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
        wrong: 0,
        total: 0,
      }
    default:
      return state
  }
}
