import callBuilder from '../apiConnection'

export const getAnswerFeedback = (learningLanguage, userAnswer, correctAnswer) => {
  const route = `/debug/${learningLanguage}/feedback?user_answer=${userAnswer}&true_answer=${correctAnswer}`
  const prefix = 'GET_ANSWER_FEEDBACK'

  return callBuilder(route, prefix, 'get')
}

const initialState = {
  pending: false,
  error: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ANSWER_FEEDBACK_ATTEMPT':
      return {
        pending: false,
        error: false,
      }
    case 'GET_ANSWER_FEEDBACK_FAILURE':
      return {
        pending: false,
        error: true,
      }
    case 'GET_ANSWER_FEEDBACK_SUCCESS':
      return {
        pending: false,
        error: false,
        feedback: action.response,
      }
    default:
      return state
  }
}
