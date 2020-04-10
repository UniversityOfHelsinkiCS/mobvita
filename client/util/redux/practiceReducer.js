export const setAnswers = newAnswers => ({ type: 'SET_ANSWERS', newAnswers })
export const setInputValues = inputValues => ({ type: 'SET_INPUT_VALUES', inputValues })
export const setFocusedWord = focusedWord => ({ type: 'SET_FOCUSED_WORD', focusedWord })
export const clearAnswers = () => ({ type: 'CLEAR_ANSWERS' })
export const clearCurrentSnippetAnswers = () => ({ type: 'CLEAR_CURRENT_SNIPPET_ANSWERS' })


const initialState = {
  answers: {},
  inputValues: {},
  focusedWord: {},
  currentSnippetAnswers: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ANSWERS':
      return {
        ...state,
        answers: { ...state.answers, ...action.newAnswers },
        currentSnippetAnswers: { ...state.currentSnippetAnswers, ...action.newAnswers },
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
    case 'CLEAR_CURRENT_SNIPPET_ANSWERS':
      return {
        ...state,
        currentSnippetAnswers: {},
      }
    case 'CLEAR_ANSWERS':
      return initialState
    default:
      return state
  }
}
