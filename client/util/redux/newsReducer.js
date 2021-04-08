import callBuilder from '../apiConnection'

export const getNews = () => {
  const route = '/news/'
  const prefix = 'GET_NEWS'
  return callBuilder(route, prefix, 'get')
}

const initialState = {
  news: [],
  pending: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_NEWS_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_NEWS_SUCCESS':
      return {
        ...state,
        news: action.response.news,
        pending: false,
      }
    case 'GET_NEWS_FAILURE':
      return {
        ...state,
        pending: false,
      }
    default:
      return state
  }
}
