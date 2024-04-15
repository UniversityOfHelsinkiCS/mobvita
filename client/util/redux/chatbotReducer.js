import callBuilder from '../apiConnection'

export const setCurrentMessage = message => ({ type: 'SET_CURRENT_MESSAGE', payload: message });
export const setCurrentContext = (context) => ({ 
    type: 'SET_CURRENT_CONTEXT', 
    context: context,
});

export const getResponse = (message, context="") => {
    const route = `/chatbot`
    const prefix = 'GET_CHATBOT_RESPONSE'
    return callBuilder(route, prefix, 'post', { message, context })
}

const initialState = {
    messages: [],
    currentMessage: '',
    currentContext: '',
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
                currentContext: action.context,
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
  