import produce from 'immer'
import callBuilder from '../apiConnection'

export const getFlashcards = (inputLanguage, outputLanguage, storyId = '') => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}?story_id=${storyId}`
  const prefix = 'GET_FLASHCARDS'
  return callBuilder(route, prefix, 'get')
}

export const recordFlashcardAnswer = (inputLanguage, outputLanguage, answerDetails) => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}/answer`
  const prefix = 'ANSWER_FLASHCARD'
  const payload = answerDetails
  return callBuilder(route, prefix, 'post', payload)
}

export const deleteFlashcard = id => {
  const route = `/flashcards/${id}`
  const prefix = 'DELETE_FLASHCARD'
  return callBuilder(route, prefix, 'post', { op: 'delete' })
}

export const createFlashcard = (inputLanguage, outputLanguage, flashcardObject) => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}/single`
  const prefix = 'CREATE_FLASHCARD'
  return callBuilder(route, prefix, 'post', flashcardObject)
}

export const updateFlashcard = (id, removedHints, newHints, glosses) => {
  const data = {
    op: 'update',
    removed_hints: removedHints,
    new_hints: newHints,
    glosses,
  }
  const route = `/flashcards/${id}`
  const prefix = 'UPDATE_FLASHCARD'
  return callBuilder(route, prefix, 'post', data)
}

const initialState = {
  pending: false,
  error: false,
  cards: [],
  nounCards: [],
}

const deleteCard = (cards, response) => cards.filter(card => card._id !== response.flashcard_id)

export default (state = initialState, action) => {
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
        cards: action.response.flashcards.all,
        nounCards: action.response.flashcards.nouns,
        sessionId: action.response.session_id,
        pending: false,
        error: false,
      }
    case 'GET_FLASHCARDS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'DELETE_FLASHCARD_ATTEMPT':
      return {
        ...state,
        deletePending: true,
        error: false,
      }
    case 'DELETE_FLASHCARD_SUCCESS':
      return {
        ...state,
        cards: deleteCard(state.cards, action.response),
        nounCards: deleteCard(state.nounCards, action.response),
        deletePending: false,
        error: false,
      }
    case 'DELETE_FLASHCARD_FAILURE':
      return {
        ...state,
        deletePending: false,
        error: true,
      }
    case 'CREATE_FLASHCARD_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'CREATE_FLASHCARD_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
      }
    case 'CREATE_FLASHCARD_ERROR':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'ANSWER_FLASHCARD_ATTEMPT':
      return { ...state }
    case 'ANSWER_FLASHCARD_SUCCESS':
      return { ...state }
    case 'ANSWER_FLASHCARD_FAILURE':
      return {
        ...state,
        error: true,
      }
    case 'UPDATE_FLASHCARD_ATTEMPT':
      return {
        ...state,
        error: false,
      }
    case 'UPDATE_FLASHCARD_SUCCESS':
      return produce(state, draft => {
        draft.error = false

        const index = draft.cards.findIndex(card => card._id === action.response.flashcard_id)

        if (index !== -1) {
          const { stage } = draft.cards[index]
          draft.cards[index] = { ...action.response.flashcard, stage }
        }
      })
    case 'UPDATE_FLASHCARD_FAILURE':
      return {
        ...state,
        error: true,
      }
    default:
      return state
  }
}
