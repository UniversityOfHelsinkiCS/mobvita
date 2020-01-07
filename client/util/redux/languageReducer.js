export const setLearningLanguage = language => ({ type: 'SET_LEARNING_LANGUAGE', language })
export const getLearningLanguage = () => ({ type: 'GET_LEARNING_LANGUAGE' })


export default (state = '', action) => {
  switch (action.type) {
    case 'SET_LEARNING_LANGUAGE':
      return action.language
    case 'GET_LEARNING_LANGUAGE':
      return state
    default:
      return state
  }
}
