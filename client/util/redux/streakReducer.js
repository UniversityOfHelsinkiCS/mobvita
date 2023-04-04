const initialState = { streak: null }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_STREAK_STATE':
      return {
        streak: action.streak,
      }
    case 'CLEAR_STREAK_STATE':
      return {
        initialState,
      }
    default:
      return state
  }
}
