import callBuilder, { callApi } from '../apiConnection'

export const getFlashcards = (inputLanguage, outputLanguage, storyId = '') => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}/${storyId}`
  const prefix = 'GET_FLASHCARDS'
  return callBuilder(route, prefix, 'get')
}

export const getStoryFlashcards = (inputLanguage, outputLanguage, storyId) => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}/${storyId}`
  const prefix = 'GET_STORY_FLASHCARDS'
  return callBuilder(route, prefix, 'get')
}

export const recordFlashcardAnswer = (inputLanguage, outputLanguage, answerDetails) => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}/answer`
  const data = answerDetails
  return callApi(route, 'post', data)
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_FLASHCARDS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_FLASHCARDS_SUCCESS':
      return {
        ...state,
        cards: action.response.flashcards,
        pending: false,
        error: false,
      }
    case 'GET_FLASHCARDS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_STORY_FLASHCARDS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_STORY_FLASHCARDS_SUCCESS':
      return {
        ...state,
        cards: action.response.flashcards,
        pending: false,
        error: false,
      }
    case 'GET_STORY_FLASHCARDS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
