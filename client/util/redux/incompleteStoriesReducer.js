import callBuilder from '../apiConnection'

export const getIncompleteStories = (language, query = { page: 0, page_size: 10 }) => {
  const queryString = Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&')
  const route = `/stories?language=${language}&${queryString}`
  const prefix = 'GET_INCOMPLETE_STORIES'
  return callBuilder(route, prefix)
}

const initialState = {
  data: [],
  searchResults: null,
  pending: false,
  focusedPending: false,
  error: false,
  currentQuery: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_INCOMPLETE_STORIES_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_INCOMPLETE_STORIES_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }

    case 'GET_INCOMPLETE_STORIES_SUCCESS':
      return {
        ...state,
        data: action.response.stories,
        totalNum: action.response.total_num,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
