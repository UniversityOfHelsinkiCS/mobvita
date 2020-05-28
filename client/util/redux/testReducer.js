import callBuilder from '../apiConnection'

const initialState = {
  currentIndex: 0,
  currentQuestion: null,
  questions: [],
  report: null,
  sessionId: null,
}

export const getTestQuestions = (language, groupId) => {
  const route = `/test/${language}?group_id=${groupId}`
  const prefix = 'GET_TEST_QUESTIONS'
  return callBuilder(route, prefix, 'get')
}

export const sendAnswer = (language, sessionId, answer, breakTimestamp) => {
  const route = `/test/${language}/answer`
  const prefix = 'ANSWER_TEST_QUESTION'
  const breaks = breakTimestamp ? [breakTimestamp] : []
  const payload = {
    session_id: sessionId,
    language,
    breaks,
    is_completed: false,
    answers: [answer],
  }
  return callBuilder(route, prefix, 'post', payload)
}

export const finishTest = (language, sessionId) => {
  const route = `/test/${language}/answer`
  const prefix = 'FINISH_TEST'
  const payload = {
    session_id: sessionId,
    language,
    is_completed: true,
    answers: [],
  }
  return callBuilder(route, prefix, 'post', payload)
}

export default (state = initialState, action) => {
  const { currentIndex, questions } = state
  const { response } = action
  switch (action.type) {
    case 'GET_TEST_QUESTIONS_ATTEMPT':
      return {
        ...initialState,
        pending: true,
      }
    case 'GET_TEST_QUESTIONS_SUCCESS':
      return {
        ...state,
        questions: response.question_list,
        currentQuestion: response.question_list[0],
        sessionId: response.session_id,
        pending: false,
      }
    case 'GET_TEST_QUESTIONS_FAILURE':
      return {
        ...state,
        error: true,
        pending: false,
      }
    case 'ANSWER_TEST_QUESTION_ATTEMPT':
      return {
        ...state,
        answerPending: true,
      }
    case 'ANSWER_TEST_QUESTION_SUCCESS':
      return {
        ...state,
        currentIndex: currentIndex + 1,
        currentQuestion: questions[currentIndex + 1],
        answerPending: false,
      }
    case 'FINISH_TEST_SUCCESS':
      return {
        ...initialState,
        report: {
          message: response.message,
          correct: response.correct,
          total: response.total,
          correctRate: response.correct_rate,
        },
      }
    default:
      return state
  }
}
