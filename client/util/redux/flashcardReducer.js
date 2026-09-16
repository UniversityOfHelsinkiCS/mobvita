import { produce } from 'immer'
import callBuilder from '../apiConnection'

export const getFlashcards = (inputLanguage, outputLanguage, storyId = '') => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}?story_id=${storyId}`
  const prefix = 'GET_FLASHCARDS'
  return callBuilder(route, prefix, 'get')
}

export const getBlueFlashcards = (inputLanguage, outputLanguage, storyId = '') => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}?story_id=${storyId}&flashcard_test=True`
  const prefix = 'GET_BLUE_FLASHCARDS'
  return callBuilder(route, prefix, 'get')
}

export const getStoriesBlueFlashcards = (inputLanguage, outputLanguage) => {
  const route = `flashcards/${inputLanguage}/${outputLanguage}/blue_flashcards`
  const prefix = 'GET_ALL_BLUE_FLASHCARDS'
  return callBuilder(route, prefix, 'get')
}

export const recordFlashcardAnswer = (inputLanguage, outputLanguage, answerDetails) => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}/answer`
  const prefix = 'ANSWER_FLASHCARD'
  const payload = answerDetails
  return callBuilder(route, prefix, 'post', payload)
}

export const answerBluecards = (inputLanguage, outputLanguage, answerObj) => {
  const route = `/flashcards/${inputLanguage}/${outputLanguage}/batch_answer`
  const prefix = 'ANSWER_BLUE_CARDS'

  const payload = answerObj
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

export const addToCorrectAnswers = () => ({ type: 'ADD_TO_CORRECT_ANSWERS' })

export const addToTotal = () => ({ type: 'ADD_TO_TOTAL_ANSWERS' })

// Which card the practice deck is showing. The deck tracks its position in local state, so this is
// how anything outside it (the flashcards assistant) learns what the learner is looking at.
export const setCurrentFlashcard = card => ({ type: 'SET_CURRENT_FLASHCARD', card })

// Which of the current card's hints the learner has revealed. It lives here rather than in the
// card because the assistant reveals them too, and the answer payload reports the count as
// `hints_shown` — so both surfaces have to agree on one list. Selecting a new card clears it.
export const revealFlashcardHint = index => ({ type: 'REVEAL_FLASHCARD_HINT', index })

// The deck reports that it ran out of cards; the assistant raises the "Deck completed!" message and
// asks for the next deck from there. `newDeckRequestId` is a counter rather than a flag so the deck
// can tell a fresh request from the one it already handled.
export const setDeckCompleted = value => ({ type: 'SET_DECK_COMPLETED', value })

export const requestNewFlashcardDeck = () => ({ type: 'REQUEST_NEW_FLASHCARD_DECK' })

// Reducer

const initialState = {
  pending: false,
  cards: [],
  nounCards: [],
  correctAnswers: 0,
  totalAnswers: 0,
  creditableWordsNum: 0,
  currentCard: null,
  revealedHints: [],
  deckCompleted: false,
  newDeckRequestId: 0,
}

const isCurrentCardsRequest = (state, action) => action.requestId && action.requestId === state.activeCardsRequestId

const deleteCard = (cards, response) => cards?.filter(card => card._id !== response.flashcard_id)

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_FLASHCARD':
      return {
        ...state,
        currentCard: action.card,
        // A different card means a fresh hint tally.
        revealedHints: action.card?._id === state.currentCard?._id ? state.revealedHints : [],
      }

    case 'SET_DECK_COMPLETED':
      return { ...state, deckCompleted: action.value }

    case 'REQUEST_NEW_FLASHCARD_DECK':
      return { ...state, deckCompleted: false, newDeckRequestId: state.newDeckRequestId + 1 }

    case 'REVEAL_FLASHCARD_HINT':
      return state.revealedHints.includes(action.index)
        ? state
        : { ...state, revealedHints: [...state.revealedHints, action.index] }

    case 'ADD_TO_CORRECT_ANSWERS':
      return {
        ...state,
        correctAnswers: state.correctAnswers + 1,
      }
    case 'ADD_TO_TOTAL_ANSWERS':
      return {
        ...state,
        totalAnswers: state.totalAnswers + 1,
      }
    case 'GET_FLASHCARDS_ATTEMPT':
      return {
        ...state,
        pending: true,
        activeCardsRequestId: action.requestId,
      }
    case 'GET_FLASHCARDS_SUCCESS':
      if (!isCurrentCardsRequest(state, action)) return state
      return {
        ...state,
        cards: action.response.flashcards.all,
        nounCards: action.response.flashcards.nouns,
        sessionId: action.response.session_id,
        pending: false,
        correctAnswers: 0,
        totalAnswers: 0,
        creditableWordsNum: 0,
      }
    case 'GET_FLASHCARDS_FAILURE':
      if (!isCurrentCardsRequest(state, action)) return state
      return {
        ...state,
        pending: false,
      }
    case 'GET_BLUE_FLASHCARDS_ATTEMPT':
      return {
        ...state,
        pending: true,
        activeCardsRequestId: action.requestId,
      }
    case 'GET_BLUE_FLASHCARDS_SUCCESS':
      if (!isCurrentCardsRequest(state, action)) return state
      return {
        ...state,
        cards: action.response.flashcards.r_all,
        nounCards: action.response.flashcards.nouns,
        sessionId: action.response.session_id,
        pending: false,
        correctAnswers: 0,
        totalAnswers: 0,
        creditableWordsNum: action.response.flashcards.num_rewardable_words,
      }
    case 'GET_BLUE_FLASHCARDS_FAILURE':
      if (!isCurrentCardsRequest(state, action)) return state
      return {
        ...state,
        pending: false,
      }
    case 'GET_ALL_BLUE_FLASHCARDS_ATTEMPT':
      return {
        ...state,
        storyCardsPending: true,
      }
    case 'GET_ALL_BLUE_FLASHCARDS_SUCCESS':
      return {
        ...state,
        storyBlueCards: action.response.story_blueFlashcards,
        storyCardsPending: false,
      }
    case 'GET_ALL_BLUE_FLASHCARDS_FAILURE':
      return {
        ...state,
        storyCardsPending: false,
      }
    case 'DELETE_FLASHCARD_ATTEMPT':
      return {
        ...state,
        deletePending: true,
      }
    case 'DELETE_FLASHCARD_SUCCESS':
      return {
        ...state,
        cards: deleteCard(state.cards, action.response),
        nounCards: deleteCard(state.nounCards, action.response),
        deletePending: false,
      }
    case 'DELETE_FLASHCARD_FAILURE':
      return {
        ...state,
        deletePending: false,
      }
    case 'CREATE_FLASHCARD_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'CREATE_FLASHCARD_SUCCESS':
      return {
        ...state,
        pending: false,
      }
    case 'CREATE_FLASHCARD_ERROR':
      return {
        ...state,
        pending: false,
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
    default:
      return state
  }
}
