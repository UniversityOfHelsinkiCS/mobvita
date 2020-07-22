import produce from 'immer'
import callBuilder from '../apiConnection'

export const getMetadata = language => {
  const route = `/metadata/${language}`
  const prefix = 'GET_METADATA'
  return callBuilder(route, prefix, 'get')
}

export const closeBanner = message => ({ type: 'CLOSE_BANNER', message })

export default (state = { pending: false, error: false }, action) => {
  const { response } = action
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
        concepts: response.concept_list,
        flashcardArticles: response.flashcard_articles,
        suggestedSites: response.suggested_sites,
        banners: response.banner_messages.map(b => ({ message: b, open: true })),
        hasTests: response.has_tests,
        pending: false,
        error: false,
      }
    case 'CLOSE_BANNER':
      return produce(state, draft => {
        const banner = draft.banners.find(b => b.message === action.message)
        banner.open = false
      })
    default:
      return state
  }
}
