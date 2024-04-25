import callBuilder from '../apiConnection'

export const setCurrentContext = (context) => ({ 
    type: 'SET_CURRENT_CONTEXT', 
    context: context,
});

export const getConversationHistory = (story_id, snippet_id, sentence_id, word_id, surface="") => {
    const route = `/chatbot/history?story_id=${encodeURIComponent(story_id)}&snippet_id=${encodeURIComponent(snippet_id)}&sentence_id=${encodeURIComponent(sentence_id)}&word_id=${encodeURIComponent(word_id)}&surface=${encodeURIComponent(surface)}`;
    const prefix = 'GET_CHATBOT_HISTORY';
    return callBuilder(route, prefix, 'get');
}

export const setConversationHistory = (chatbot_history=[]) => ({ 
    type: 'SET_CHATBOT_HISTORY', 
    chatbot_history: chatbot_history,
});

export const getResponse = (session_id, story_id, snippet_id, sentence_id, word_id, message, context="", surface="") => {
    const route = `/chatbot`
    const prefix = 'GET_CHATBOT_RESPONSE'
    const payload = { session_id, story_id, snippet_id, sentence_id, word_id, message, context, surface }
    return callBuilder(route, prefix, 'post', payload)
}

const initialState = {
    messages: [],
    exerciseContext: '',
    isWaitingForResponse: false,
    isLoadingHistory: false,
};
  
export default (state = initialState, action) => {
    const { response } = action
    switch (action.type) {
        case 'SET_CURRENT_CONTEXT':
            return {
                ...state,
                exerciseContext: action.context,
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
            };
        case 'GET_CHATBOT_RESPONSE_SUCCESS':
            return {
                ...state,
                isWaitingForResponse: false,
                messages: [...state.messages, { type: 'bot', text: response.response }],
            };

        case 'GET_CHATBOT_HISTORY_ATTEMPT':
            return {
                ...state,
                isLoadingHistory: true,
                messages: [],
            };
        case 'GET_CHATBOT_HISTORY_FAILURE':
            return {
                ...state,
                isLoadingHistory: false,
                messages: [],
            };
        case 'GET_CHATBOT_HISTORY_SUCCESS':
            return {
                ...state,
                isLoadingHistory: false,
                messages: response.history,
            };

        case 'SET_CHATBOT_HISTORY':
            return {
                ...state,
                isLoadingHistory: false,
                messages: action.chatbot_history,
            };

        default:
            return state;
    }
};
  