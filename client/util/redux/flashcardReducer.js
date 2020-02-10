import callBuilder from '../apiConnection'

export const getFlashcards = (inputLanguage, outputLanguage) => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}`
  const prefix = 'GET_FLASHCARDS'
  return callBuilder(route, prefix, 'get')
}

export const recordFlashcardAnswer = (inputLanguage, outputLanguage, answerDetails) => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}/answer`
  const prefix = 'RECORD_FLASHCARD_ANSWER'
  const payload = answerDetails
  return callBuilder(route, prefix, 'post', payload)
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
    case 'RECORD_FLASHCARD_ANSWER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'RECORD_FLASHCARD_ANSWER_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
      }
    case 'RECORD_FLASHCARD_ANSWER_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
