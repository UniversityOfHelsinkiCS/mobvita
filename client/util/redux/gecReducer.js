import callBuilder from '../apiConnection'

export const checkGrammar = (essay) => {
  const route = '/gec' 
  const prefix = 'CHECK_GRAMMAR'
  const payload = { essay } 
  return callBuilder(route, prefix, 'post', payload) // Use POST method
}

export const updateEssay = (text) => ({
    type: 'UPDATE_ESSAY',
    payload: text,
  });
  

const initialState = {
  essay: "",           // Essay input by the user
  edits: {},         // Grammar corrections received
  pending: false,      // Loading state
  error: null,         // Error message if request fails
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CHECK_GRAMMAR_ATTEMPT':  
      return {
        ...state,
        pending: true,
        error: null,
      }
    case 'CHECK_GRAMMAR_SUCCESS': 
      return {
        ...state,
        edits: action.response.edits, 
        pending: false,
        error: null,
      }
    case 'CHECK_GRAMMAR_FAILURE': 
      return {
        ...state,
        pending: false,
        error: action.response, 
      }
    case 'UPDATE_ESSAY': 
      return {
        ...state,
        essay: action.payload,
      }
    case 'CLEAR_EDITS':
      return {
        ...state,
        edits: null,
      }
    default:
      return state
  }
}
