import callBuilder from '../apiConnection'

const initialState = {
  currentIndex: 0,
  currentQuestion: null,
  questions: [],
  answers: [],
  ready: false,
  report: '',
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
  switch (action.type) {
    case 'GET_TEST_QUESTIONS_SUCCESS':
      return {
        ...initialState,
        questions: action.response.question_list,
        currentQuestion: action.response.question_list[0],
        sessionId: action.response.session_id,
      }
    case 'GET_TEST_QUESTIONS_FAILURE':
      return {
        ...state,
        error: true,
      }
    case 'GET_TEST_RESULTS_SUCCESS':
      return {
        ...state,
        report: 'you did well',
      }
    case 'ANSWER_TEST_QUESTIONS_SUCCESS':
      return {
        ...state,
        report: action.response.message,
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
