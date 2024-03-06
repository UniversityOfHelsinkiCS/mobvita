const initialState = { lastActivity: null }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LAST_ACTIVITY':
      return {
        lastActivity: action.activity,
      }
    case 'CLEAR_ACTIVITY':
      return {
        initialState,
      }
    default:
      return state
  }
}
