import callBuilder from '../apiConnection'

export const getMetadata = (language) => {
  const route = `/metadata/${language}`
  const prefix = 'GET_METADATA'
  return callBuilder(route, prefix, 'get')
}

export default (state = { pending: false, error: false }, action) => {
  switch (action.type) {
    case 'GET_METADATA_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_METADATA_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_METADATA_SUCCESS':
      return {
        ...state,
        concepts: action.response.concept_list,
        flashcardArticles: action.response.flashcard_articles,
        suggestedSites: action.response.suggested_sites,
        bannerMessages: action.response.banner_messages,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
