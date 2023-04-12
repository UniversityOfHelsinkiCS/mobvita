const initialState = { xp: null }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_XP':
      return {
        xp: action.xp,
      }
    case 'CLEAR_XP':
      return {
        initialState,
      }
    default:
      return state
  }
}
