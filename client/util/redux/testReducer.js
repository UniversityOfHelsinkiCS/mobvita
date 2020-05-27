import callBuilder from '../apiConnection'

const initialState = {
  currentIndex: 0,
  currentQuestion: null,
  questions: [],
  answers: [],
  ready: false,
  report: null,
}

export const getTestQuestions = (language) => {
  const route = `/test/${language}`
  const prefix = 'GET_TEST_QUESTIONS'
  return callBuilder(route, prefix, 'get')
}

export const getTestResults = () => ({ type: 'GET_TEST_RESULTS_SUCCESS' })

export const answerQuestion = answer => ({ type: 'ANSWER', answer })

export const sendAnswers = (language, sessionId, answers) => {
  const route = `/test/${language}/answer`
  const prefix = 'ANSWER_TEST_QUESTIONS'
  const payload = {
    session_id: sessionId,
    language,
    is_completed: true,
    answers,
  }
  return callBuilder(route, prefix, 'post', payload)
}

export default (state = initialState, action) => {
  const { currentIndex, questions, answers } = state
  const { response } = action
  switch (action.type) {
    case 'GET_TEST_QUESTIONS_SUCCESS':
      return {
        ...initialState,
        questions: response.question_list,
        currentQuestion: response.question_list[0],
        sessionId: response.session_id,
      }
    case 'GET_TEST_QUESTIONS_FAILURE':
      return {
        ...state,
        error: true,
      }
    case 'ANSWER_TEST_QUESTIONS_SUCCESS':
      return {
        ...state,
        report: {
          message: response.message,
          correct: response.correct,
          total: response.total,
        },
      }
    case 'ANSWER':
      return {
        ...state,
        answers: answers.concat(action.answer),
        currentIndex: currentIndex + 1,
        currentQuestion: questions[currentIndex + 1],
      }
    default:
      return state
  }
}
