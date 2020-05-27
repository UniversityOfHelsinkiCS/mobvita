import callBuilder from '../apiConnection'

const initialState = {
  currentIndex: 0,
  currentQuestion: null,
  questions: [],
  ready: false,
}

export const getTestQuestions = (language) => {
  const route = `/test/${language}`
  const prefix = 'GET_TEST_QUESTIONS_SUCCESS'
  return {
    type: 'GET_TEST_QUESTIONS_SUCCESS',
    response: {
      questions: [
        'kala',
        'hirvi',
        'kotka',
        'lohikäärme',
        'ihminen',
      ],
    },
  }
}

export const nextQuestion = () => ({ type: 'NEXT_QUESTION' })

export default (state = initialState, action) => {
  const { currentIndex, questions } = state
  switch (action.type) {
    case 'GET_TEST_QUESTIONS_SUCCESS':
      return {
        ...state,
        questions: action.response.questions,
        ready: true,
      }
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentIndex: currentIndex + 1,
        currentQuestion: questions[currentIndex],
      }
    default:
      return state
  }
}
