import callBuilder from '../apiConnection'

export const checkGrammar = (essay) => {
  const route = '/gec';
  const prefix = 'CHECK_GRAMMAR';

  // const cleanedEssay = essay
  //   .replace(/\s*([.,!?;:"'])\s*/g, ' $1 ')  // Ensure space before and after punctuation (ignoring hyphen)
  //   .replace(/\s{2,}/g, ' ')                 // Replace multiple spaces with a single space
  //   .trim();                                 // Remove any leading/trailing spaces
  // console.log("essay", essay)

  const payload = { essay: essay };
  return callBuilder(route, prefix, 'post', payload);
};

export const updateEssay = (text) => ({
  type: 'UPDATE_ESSAY',
  payload: text,
});

const initialState = {
  essay: "",              
  edits: {},        
  error_type2action: {},       
  error_type2feedback: {}, 
  pending: false,          
  error: null,            
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
        essay: action.response.preprocessed_text,
        error_type2action: action.response.error_type2action,
        error_type2feedback: action.response.error_type2feedback, 
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
        error_type2feedback: {},
      }
    default:
      return state
  }
}