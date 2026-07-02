import callBuilder from '../apiConnection'

const ESSAY_CHATBOT_FOLLOW_UP_MESSAGE =
  'Do you want to go deeper and focus your question on a particular part of the text or a suggestion I made? If so, click on the word or suggestion and tell me to "FOLLOW UP".'
const ESSAY_CHATBOT_FOLLOW_UP_MESSAGE_ID = 'essay-chatbot-follow-up-question'

const getEssayChatbotResponseText = response => {
  if (typeof response === 'string') return response

  return response?.response || response?.message || ''
}

export const setCurrentContext = context => ({
  type: 'SET_CURRENT_CONTEXT',
  context: context,
})

export const getGeneralAgentConversationHistory = session_id => {
  const route = `/chatbot/history?chatbot_type=general&session_id=${encodeURIComponent(session_id)}`
  const prefix = 'GET_CHATBOT_HISTORY'
  return callBuilder(route, prefix, 'get')
}

export const getPracticeAgentConversationHistory = (
  session_id,
  story_id,
  snippet_id,
  sentence_id,
  word_id,
  surface = '',
) => {
  const route = `/chatbot/history?chatbot_type=practice&session_id=${encodeURIComponent(session_id)}&story_id=${encodeURIComponent(story_id)}&snippet_id=${encodeURIComponent(snippet_id)}&sentence_id=${encodeURIComponent(sentence_id)}&word_id=${encodeURIComponent(word_id)}&surface=${encodeURIComponent(surface)}`
  const prefix = 'GET_CHATBOT_HISTORY'
  return callBuilder(route, prefix, 'get')
}

export const getReadingPracticeAgentConversationHistory = (session_id, reading_question_id) => {
  const route = `/chatbot/history?chatbot_type=reading_practice&session_id=${encodeURIComponent(session_id)}&reading_question_id=${encodeURIComponent(reading_question_id)}`
  const prefix = 'GET_CHATBOT_HISTORY'
  return callBuilder(route, prefix, 'get')
}

export const setConversationHistory = (chatbot_history = []) => ({
  type: 'SET_CHATBOT_HISTORY',
  chatbot_history: chatbot_history,
})

export const getGeneralChatbotResponse = message => {
  const route = `/chatbot/general`
  const prefix = 'GET_CHATBOT_RESPONSE'
  const payload = { message }
  return callBuilder(route, prefix, 'post', payload)
}

export const getPracticeChatbotResponse = (
  session_id,
  story_id,
  snippet_id,
  sentence_id,
  word_id,
  message,
  answer,
  context = {},
  hints = [],
) => {
  const route = `/chatbot/practice`
  const prefix = 'GET_CHATBOT_RESPONSE'
  const payload = {
    session_id,
    story_id,
    snippet_id,
    sentence_id,
    word_id,
    message,
    answer,
    context,
    hints,
  }
  return callBuilder(route, prefix, 'post', payload)
}

export const getReadingPracticeChatbotResponse = (
  session_id,
  reading_question_id,
  user_attempts_and_feedbacks,
  message,
) => {
  const route = `/chatbot/reading_practice`
  const prefix = 'GET_CHATBOT_RESPONSE'
  const payload = { session_id, reading_question_id, user_attempts_and_feedbacks, message }
  return callBuilder(route, prefix, 'post', payload)
}

export const getEssayChatbotResponse = ({
  sessionId,
  message,
  originalText = '',
  correctedText = '',
  sentenceId = null,
  focusedWord = '',
}) => {
  const route = `/chatbot/essay`
  const prefix = 'GET_ESSAY_CHATBOT_RESPONSE'
  const payload = {
    session_id: sessionId,
    message,
    original_text: originalText || '',
    corrected_text: correctedText || '',
    sentence_id: sentenceId || '',
    // No focused sentence means no focused word.
    focused_word: sentenceId ? focusedWord || '' : '',
  }

  return callBuilder(route, prefix, 'post', payload, {
    showFollowUpQuestion: !sentenceId,
  })
}

const initialState = {
  messages: [],
  essayMessages: [],
  exerciseContext: '',
  isWaitingForResponse: false,
  isWaitingForEssayResponse: false,
  isLoadingHistory: false,
  isOpen: false,
}

export default (state = initialState, action) => {
  const { response } = action
  switch (action.type) {
    case 'SET_CURRENT_CONTEXT':
      return {
        ...state,
        exerciseContext: action.context,
      }

    case 'GET_CHATBOT_RESPONSE_ATTEMPT':
      return {
        ...state,
        isWaitingForResponse: true,
        messages: [...state.messages, { type: 'user', text: action.requestSettings.data.message }],
      }
    case 'GET_CHATBOT_RESPONSE_FAILURE':
      return {
        ...state,
        isWaitingForResponse: false,
      }
    case 'GET_CHATBOT_RESPONSE_SUCCESS':
      return {
        ...state,
        isWaitingForResponse: false,
        messages: [...state.messages, { type: 'bot', text: response.response }],
      }

    case 'GET_ESSAY_CHATBOT_RESPONSE_ATTEMPT':
      return {
        ...state,
        isWaitingForEssayResponse: true,
        essayMessages: [
          ...state.essayMessages,
          { type: 'user', text: action.requestSettings.data.message },
        ],
      }
    case 'GET_ESSAY_CHATBOT_RESPONSE_FAILURE':
      return {
        ...state,
        isWaitingForEssayResponse: false,
      }
    case 'GET_ESSAY_CHATBOT_RESPONSE_SUCCESS': {
      const essayResponseMessages = [
        ...state.essayMessages,
        { type: 'bot', text: getEssayChatbotResponseText(response) },
      ]

      return {
        ...state,
        isWaitingForEssayResponse: false,
        essayMessages: action.query?.showFollowUpQuestion
          ? essayResponseMessages.concat({
              type: 'bot',
              messageId: ESSAY_CHATBOT_FOLLOW_UP_MESSAGE_ID,
              text: ESSAY_CHATBOT_FOLLOW_UP_MESSAGE,
            })
          : essayResponseMessages,
      }
    }

    case 'GET_CHATBOT_HISTORY_ATTEMPT':
      return {
        ...state,
        isLoadingHistory: true,
        messages: [],
      }
    case 'GET_CHATBOT_HISTORY_FAILURE':
      return {
        ...state,
        isLoadingHistory: false,
        messages: [],
      }
    case 'GET_CHATBOT_HISTORY_SUCCESS':
      return {
        ...state,
        isLoadingHistory: false,
        messages: response.history,
      }

    case 'SET_CHATBOT_HISTORY':
      return {
        ...state,
        isLoadingHistory: false,
        messages: action.chatbot_history,
      }
    case 'TOGGLE_CHATBOT':
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    default:
      return state
  }
}
