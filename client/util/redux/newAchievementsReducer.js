const initialState = { newAchievements: null }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NEW_ACHIEVEMENTS':
      return {
        newAchievements: action.newAchievements,
      }
    case 'CLEAR_NEW_ACHIEVEMENTS':
      return {
        initialState,
      }
    default:
      return state
  }
}
