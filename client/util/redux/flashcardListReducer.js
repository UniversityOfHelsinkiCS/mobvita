import produce from 'immer'
import callBuilder from '../apiConnection'

export const getFlashcardListPage = (inputLanguage, outputLanguage, page, storyId = '') => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}/list?story_id=${storyId}`
  const prefix = 'GET_FLASHCARDS_PAGE'
  const query = {
    story_id: storyId,
    page,
    page_size: 50,
  }
  return callBuilder(route, prefix, 'get', null, query)
}

export const clearFlashcardList = () => ({ type: 'CLEAR_FLASHCARD_LIST' })

export const changeFlashcardStage = (flashcard_id, stage) => ({ 
  type: 'SET_CARD_STAGE', flashcard_id, stage})

const initialState = {
  pending: false,
  cardsInCurrentPage: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_FLASHCARDS_PAGE_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_FLASHCARDS_PAGE_SUCCESS':
      return {
        ...state,
        cardsInCurrentPage: action.response.flashcards,
        numberOfCards: action.response.num_cards,
        numberOfPages: action.response.num_pages,
        pending: false,
      }
    case 'GET_FLASHCARDS_PAGE_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'DELETE_FLASHCARD_SUCCESS':
      return {
        ...state,
        cardsInCurrentPage: state.cardsInCurrentPage.filter(
          card => card._id !== action.response.flashcard_id
        ),
        numberOfCards: state.numberOfCards - 1,
      }
    case 'UPDATE_FLASHCARD_SUCCESS':
      return produce(state, draft => {
        const indexInPage = draft.cardsInCurrentPage.findIndex(
          card => card._id === action.response.flashcard_id
        )

        if (indexInPage !== -1) {
          const { stage } = draft.cardsInCurrentPage[indexInPage]
          draft.cardsInCurrentPage[indexInPage] = { ...action.response.flashcard, stage }
        }
      })
    case 'CLEAR_FLASHCARD_LIST':
      return initialState

    case 'SET_CARD_STAGE': {
      console.log(action)
      return {
        ...state,
        cardsInCurrentPage: state.cardsInCurrentPage.map(
          card => card._id !== action.flashcard_id && card || { ...card, stage: action.stage })
      }
    }
    default:
      return state
  }
}
