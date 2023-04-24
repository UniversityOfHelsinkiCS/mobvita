const initialState = { level: null, levelUp: null }

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
    case 'SET_LEVEL_UP':
      return {
        levelUp: action.levelUp,
      }
    default:
      return state
  }
}
