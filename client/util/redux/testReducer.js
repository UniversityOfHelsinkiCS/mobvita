import moment from 'moment'
import callBuilder from '../apiConnection'

const initialState = {
  language: window.localStorage.getItem('testLanguage'),
  exhaustiveTestSessionId: null,
  currentExhaustiveQuestionIndex: 0,
  currentExhaustiveTestQuestion: null,
  exhaustiveTestQuestions: [],
  report: null,
  adaptiveTestSessionId: null,
  currentAdaptiveQuestionIndex: 0,
  adaptiveTestResults: null,
}

const clearLocalStorage = () => {
  window.localStorage.removeItem('questions')
  window.localStorage.removeItem('testIndex')
  window.localStorage.removeItem('testLanguage')
}

export const getTestQuestions = (language, groupId, restart = false) => {
  const route = `/test/${language}?group_id=${groupId}`
  const prefix = 'GET_TEST_QUESTIONS'

  const cache = JSON.parse(localStorage.getItem('questions'))
  const cachedIndex = Number(window.localStorage.getItem('testIndex'))
  const lastIndex = !Number.isNaN(cachedIndex) ? cachedIndex : 0

  if (cache && !restart) {
    return { type: `${prefix}_SUCCESS`, response: cache, startingIndex: lastIndex + 1 }
  }

  const call = callBuilder(route, prefix, 'get', undefined, undefined, 'questions')
  window.localStorage.setItem('testLanguage', language)
  return { ...call, language, startingIndex: 0 }
}

export const InitAdaptiveTest = language => {
  const route = `/test/${language}/adaptive`
  const prefix = 'INIT_ADAPTIVE_TEST'

  return callBuilder(route, prefix, 'get')
}

// in case of network error
export const resumeAdaptiveTest = (language, sessionId) => {
  const route = `/test/${language}/adaptive?session_id=${sessionId}`
  const prefix = 'RESUME_ADAPTIVE_TEST'

  return callBuilder(route, prefix, 'get')
}

export const sendExhaustiveTestAnswer = (language, sessionId, answer, duration, breakTimestamp) => {
  const route = `/test/${language}/answer`
  const prefix = 'ANSWER_TEST_QUESTION'
  const breaks = breakTimestamp ? [breakTimestamp] : []
  const payload = {
    session_id: sessionId,
    language,
    breaks,
    duration,
    is_completed: false,
    answers: [answer],
  }
  return callBuilder(route, prefix, 'post', payload)
}

export const sendAdaptiveTestAnswer = (language, sessionId, answer, duration, questionId) => {
  const route = `/test/${language}/adaptive/answer`
  const prefix = 'ANSWER_ADAPTIVE_TEST_QUESTION'
  const payload = {
    session_id: sessionId,
    answer,
    duration,
    question_id: questionId,
  }
  return callBuilder(route, prefix, 'post', payload)
}

export const finishExhaustiveTest = (language, sessionId) => {
  const route = `/test/${language}/answer`
  const prefix = 'FINISH_EXHAUSTIVE_TEST'
  const payload = {
    session_id: sessionId,
    language,
    is_completed: true,
    answers: [],
  }

  clearLocalStorage()
  return callBuilder(route, prefix, 'post', payload)
}

export const getHistory = language => {
  const now = moment().format('YYYY-MM-DD')
  const route = `/test/${language}/history?start_time=2019-01-01&end_time=${now}`
  const prefix = 'GET_TEST_HISTORY'
  return callBuilder(route, prefix, 'get')
}

export const removeFromHistory = (language, sessionId) => {
  const route = `/test/${language}/session/${sessionId}/remove`
  const prefix = 'REMOVE_FROM_TEST_HISTORY'
  return callBuilder(route, prefix, 'post')
}

export const resetTests = () => {
  clearLocalStorage()
  return { type: 'RESET_TESTS' }
}

export default (state = initialState, action) => {
  const { currentExhaustiveQuestionIndex, currentAdaptiveQuestionIndex, exhaustiveTestQuestions } =
    state
  const { response, startingIndex } = action

  switch (action.type) {
    case 'GET_TEST_QUESTIONS_ATTEMPT':
      return {
        ...initialState,
        pending: true,
        language: action.language,
        currentExhaustiveQuestionIndex: startingIndex,
      }
    case 'GET_TEST_QUESTIONS_SUCCESS':
      return {
        ...state,
        exhaustiveTestQuestions: response.question_list,
        currentExhaustiveTestQuestion: response.question_list[startingIndex || 0],
        exhaustiveTestSessionId: response.session_id,
        currentExhaustiveQuestionIndex: startingIndex || 0,
        pending: false,
      }
    case 'GET_TEST_QUESTIONS_FAILURE':
      return {
        ...state,
        error: true,
        pending: false,
      }

    case 'INIT_ADAPTIVE_TEST_ATTEMPT':
      return {
        ...initialState,
        pending: true,
      }
    case 'INIT_ADAPTIVE_TEST_SUCCESS':
      return {
        ...initialState,
        pending: false,
        adaptiveTestSessionId: response.session_id,
        currentAdaptiveQuestion: response.next_question,
      }
    case 'INIT_ADAPTIVE_TEST_FAILURE':
      return {
        ...initialState,
        pending: false,
      }

    case 'RESUME_ADAPTIVE_TEST_ATTEMPT':
      return {
        ...state,
        resumePending: true,
      }
    case 'RESUME_ADAPTIVE_TEST_SUCCESS':
      return {
        ...state,
        pending: false,
        adaptiveTestSessionId: response.session_id,
        currentAdaptiveQuestion: response.next_question,
        answerFailure: false,
      }
    case 'RESUME_ADAPTIVE_TEST_FAILURE':
      return {
        ...state,
        resumePending: false,
        answerFailure: true,
      }

    case 'ANSWER_TEST_QUESTION_ATTEMPT':
      return {
        ...state,
        answerPending: true,
      }
    case 'ANSWER_TEST_QUESTION_SUCCESS':
      return {
        ...state,
        currentExhaustiveQuestionIndex: currentExhaustiveQuestionIndex + 1,
        currentExhaustiveTestQuestion: exhaustiveTestQuestions[currentExhaustiveQuestionIndex + 1],
        answerPending: false,
      }
    case 'ANSWER_TEST_QUESTION_FAILURE':
      return {
        ...state,
        answerFailure: true,
        answerPending: false,
      }

    case 'ANSWER_ADAPTIVE_TEST_QUESTION_ATTEMPT':
      return {
        ...state,
        answerPending: false,
      }
    case 'ANSWER_ADAPTIVE_TEST_QUESTION_SUCCESS':
      return {
        ...state,
        theta: response.theta,
        currentAdaptiveQuestion: response.next_question,
        cefrLevel: response.cefr,
        answerPending: false,
        currentAdaptiveQuestionIndex: currentAdaptiveQuestionIndex + 1,
        adaptiveTestResults: response.result,
        answerFailure: false,
      }
    case 'ANSWER_ADAPTIVE_TEST_QUESTION_FAILURE':
      return {
        ...state,
        answerFailure: true,
        answerPending: false,
      }

    case 'FINISH_EXHAUSTIVE_TEST_SUCCESS':
      return {
        ...initialState,
        language: null,
        report: {
          message: response.message,
          correct: response.correct,
          total: response.total,
          correctRate: response.correct_rate,
        },
        debugReport: response,
      }

    case 'GET_TEST_HISTORY_SUCCESS':
      return {
        ...state,
        history: response.history,
      }

    case 'REMOVE_FROM_TEST_HISTORY_SUCCESS':
      return {
        ...state,
        history: state.history.filter(h => h.test_session !== response.session_id),
      }

    case 'RESET_TESTS':
      return initialState

    default:
      return state
  }
}
