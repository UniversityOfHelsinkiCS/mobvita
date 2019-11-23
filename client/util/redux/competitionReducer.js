import callBuilder from '../apiConnection'

export const getOpponent = (storyId) => {
  if (!storyId) return undefined

  const route = `/opponent?story_id=${storyId}`
  const prefix = 'GET_OPPONENT'
  return callBuilder(route, prefix)
}

export const competitionStartNow = () => ({ type: 'COMPETITION_START', startTime: (new Date()).getTime()})

export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_OPPONENT_SUCCESS':
      return {
        ...state,
        snippetCompleteTime: action.response.snippet_complete_time,
        totalTime: action.response.total_time,
      }
    case 'COMPETITION_START':
      return {
        ...state,
        startTime: action.startTime,
      }
    default:
      return state
  }
}
