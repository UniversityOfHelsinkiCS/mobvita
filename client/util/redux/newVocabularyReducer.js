const initialState = { newVocabulary: 0 }

export const clearNewVocabulary = () => ({ type: 'CLEAR_NEW_VOCABULARY' })

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NEW_VOCABULARY':
      return {
        newVocabulary: action.newVocabulary,
      }
    case 'CLEAR_NEW_VOCABULARY':
      return {
        initialState,
      }
    default:
      return state
  }
}
