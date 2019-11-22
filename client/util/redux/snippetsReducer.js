import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const setTotalNumberAction = (totalnum) => ({
  type: 'SET_TOTAL_NUMBER',
  data: totalnum
})

export const getCurrentSnippet = (storyId) => {
  const route = `/snippets/story/${storyId}/current`
  const prefix = 'GET_CURRENT_SNIPPET'
  return callBuilder(route, prefix)
}

export const resetCurrentSnippet = (storyId) => {
  const route = `/snippets/story/${storyId}/reset`
  const prefix = 'RESET_SNIPPET_INDEX'
  return callBuilder(route, prefix, 'post')
}

export const postAnswers = (storyId, answersObject) => {
  const route = `/snippets/story/${storyId}/answer`
  const prefix = 'GET_SNIPPET_ANSWERS'
  return callBuilder(route, prefix, 'post', answersObject)
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: [] }, action) => {
  switch (action.type) {
    case 'RESET_SNIPPET_INDEX_SUCCESS':
      return {
        ...state,
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
    case 'GET_SNIPPET_ANSWERS_SUCCESS':
      return {
        ...state,
        focused: action.response,
      }
    case 'SET_TOTAL_NUMBER':
      return {
        ...state,
        totalnum: action.data
      }
    default:
      return state
  }
}
