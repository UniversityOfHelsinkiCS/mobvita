export const setAnswers = answers => ({ type: 'SET_ANSWERS', answers })
export const setInputValues = inputValues => ({ type: 'SET_INPUT_VALUES', inputValues })
export const setFocusedWord = focusedWord => ({ type: 'SET_FOCUSED_WORD', focusedWord })
export const clearAnswers = () => ({ type: 'CLEAR_ANSWERS' })


const initialState = {
  answers: {},
  inputValues: {},
  focusedWord: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ANSWERS':
      return {
        ...state,
        answers: action.answers,
      }
    case 'SET_INPUT_VALUES':
      return {
        ...state,
        inputValues: action.inputValues,
      }
    case 'SET_FOCUSED_WORD':
      return {
        ...state,
        focusedWord: action.focusedWord,
      }
    case 'CLEAR_ANSWERS':
      return initialState
    default:
      return state
  }
}
