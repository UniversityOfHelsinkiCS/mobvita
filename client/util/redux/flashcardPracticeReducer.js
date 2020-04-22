export const initPractice = (cards) => {
  if (cards && cards[0].format !== 'no-cards') {
    const practiceState = cards.reduce((stateObject, card) => (
      {
        ...stateObject,
        [card._id]: { flipped: false, answerChecked: false, answerCorrect: false },
      }
    ), {})
    return {
      type: 'INIT_FLASHCARD_PRACTICE',
      practiceState,
    }
  }
}

export const addListener = () => ({ type: 'ADD_LISTENER' })


const initialState = { listenerAdded: false, cards: {} }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_FLASHCARD_PRACTICE':
      return {
        ...state,
        cards: action.practiceState,
      }
    case 'ADD_LISTENER':
      return {
        ...state,
        listenerAdded: true,
      }
    default:
      return state
  }
}
