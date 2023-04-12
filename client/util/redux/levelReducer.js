const initialState = { level: null }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LEVEL':
      return {
        level: action.level,
      }
    case 'CLEAR_LEVEL':
      return {
        initialState,
      }
    default:
      return state
  }
}
