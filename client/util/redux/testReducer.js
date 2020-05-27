import callBuilder from '../apiConnection'

const initialState = {
  currentIndex: 0,
  currentQuestion: null,
  questions: [],
  ready: false,
  report: '',
}

export const getTestQuestions = (language) => {
  const route = `/test/${language}`
  const prefix = 'GET_TEST_QUESTIONS_SUCCESS'
  return {
    type: 'GET_TEST_QUESTIONS_SUCCESS',
    response: {
      questions: [
        {
          question: 'Tässä vähän pidempi kysymys',
          choices: ['joo', 'ei', 'ehkä'],
        },

        {
          question: 'Mikä on ihminen?',
          choices: ['eläin', 'ihminen', 'onneton kasa salaisuuksia', 'kaikki edellä mainitut'],
        },
        {
          question: 'Mikä on paras ohjelmointikieli?',
          choices: ['jäsä', 'java', 'ruby', 'rust'],
        },
      ],
    },
  }
}

export const getTestResults = () => ({ type: 'GET_TEST_RESULTS_SUCCESS' })

export const sendAnswer = answer => ({
  type: 'ANSWER',
  answer,
})

export default (state = initialState, action) => {
  const { currentIndex, questions } = state
  switch (action.type) {
    case 'GET_TEST_QUESTIONS_SUCCESS':
      return {
        ...initialState,
        questions: action.response.questions,
        currentQuestion: action.response.questions[0],
      }
    case 'GET_TEST_RESULTS_SUCCESS':
      return {
        ...state,
        report: 'you did well',
      }
    case 'ANSWER':
      return {
        ...state,
        currentIndex: currentIndex + 1,
        currentQuestion: questions[currentIndex + 1],
      }
    default:
      return state
  }
}
