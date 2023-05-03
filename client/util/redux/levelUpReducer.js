const initialState = { levelUp: null }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LEVEL_UP':
      return {
        levelUp: action.level_up,
      }
    default:
      return state
  }
}
