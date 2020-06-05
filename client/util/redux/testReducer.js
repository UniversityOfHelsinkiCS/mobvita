import callBuilder from '../apiConnection'

const initialState = {
  currentIndex: 0,
  currentQuestion: null,
  questions: [],
  report: null,
  sessionId: null,
  language: window.localStorage.getItem('testLanguage'),
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
  const startingIndex = !Number.isNaN(cachedIndex) ? cachedIndex : 0

  if (cache && !restart) {
    return { type: `${prefix}_SUCCESS`, response: cache, startingIndex }
  }

  const call = callBuilder(route, prefix, 'get', undefined, undefined, 'questions')
  window.localStorage.setItem('testLanguage', language)
  return { ...call, language, startingIndex: 0 }
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

  clearLocalStorage()
  return callBuilder(route, prefix, 'post', payload)
}

export const getHistory = (language) => {
  const route = `/test/${language}/history`
  const prefix = 'GET_TEST_HISTORY'
  return callBuilder(route, prefix, 'get')
}

export const resetTest = () => {
  clearLocalStorage()
  return { type: 'RESET_TEST' }
}

export default (state = initialState, action) => {
  const { currentIndex, questions } = state
  const { response, startingIndex } = action
  switch (action.type) {
    case 'GET_TEST_QUESTIONS_ATTEMPT':
      return {
        ...initialState,
        pending: true,
        language: action.language,
        currentIndex: startingIndex,
      }
    case 'GET_TEST_QUESTIONS_SUCCESS':
      return {
        ...state,
        questions: response.question_list,
        currentQuestion: response.question_list[startingIndex || 0],
        sessionId: response.session_id,
        currentIndex: startingIndex || 0,
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
    case 'ANSWER_TEST_QUESTION_FAILURE':
      return {
        ...state,
        answerFailure: true,
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
    case 'GET_TEST_HISTORY_SUCCESS':
      return {
        ...state,
        history: response.history,
      }
    case 'RESET_TEST':
      return initialState
    default:
      return state
  }
}
