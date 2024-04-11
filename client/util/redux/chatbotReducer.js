import callBuilder from '../apiConnection'

export const setCurrentMessage = message => ({ type: 'SET_CURRENT_MESSAGE', payload: message });
export const setCurrentContext = (word, context, wordId, snippetId) => ({ 
    type: 'SET_CURRENT_CONTEXT', 
    word: word,
    context: context,
    wordId: wordId,
    snippetId: snippetId
});

export const getResponse = (message, context="") => {
    const route = `/chatbot`
    const prefix = 'GET_CHATBOT_RESPONSE'
    return callBuilder(route, prefix, 'post', { message, context })
}

const initialState = {
    messages: [],
    currentMessage: '',
    currentWord: null,
    currentContext: '',
    currentWordId: null,
    currentSnippetId: null,
    isWaitingForResponse: false,
};
  
export default (state = initialState, action) => {
    const { response } = action
    switch (action.type) {
        case 'SET_CURRENT_MESSAGE':
            return {
                ...state,
                currentMessage: action.payload,
            };
        case 'SET_CURRENT_CONTEXT':
            return {
                ...state,
                currentWord: action.word,
                currentContext: action.context,
                currentWordId: action.wordId,
                currentSnippetId: action.snippetId,
            };

        case 'GET_CHATBOT_RESPONSE_ATTEMPT':
            return {
                ...state,
                isWaitingForResponse: true,
                messages: [...state.messages, { type: 'user', text: action.requestSettings.data.message }],
            };
        case 'GET_CHATBOT_RESPONSE_FAILURE':
            return {
                ...state,
                isWaitingForResponse: false,
                currentMessage: '',
            };
        case 'GET_CHATBOT_RESPONSE_SUCCESS':
            return {
                ...state,
                isWaitingForResponse: false,
                messages: [...state.messages, { type: 'bot', text: response.response }],
            };

        default:
            return state;
    }
};
  