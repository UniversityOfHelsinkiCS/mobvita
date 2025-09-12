import moment from 'moment'
import callBuilder from '../apiConnection'

const initialState = {
  language: window.localStorage.getItem('testLanguage'),

  lastReadingSessionFinished: false,
  readingTestSessionId: null,
  currentReadingQuestionIndex: 0,
  currentReadingTestQuestion: null,
  currentReadingSet: null,
  currentQuestionIdxinSet: 0,
  prevReadingSet: null,
  readingSetLength: 0,
  readingTestQuestions: [],
  readingTestSetDict: {},
  readingHistory: {},

  exhaustiveTestSessionId: null,
  currentExhaustiveQuestionIndex: 0,
  currentExhaustiveTestQuestion: null,
  exhaustiveTestQuestions: [],

  adaptiveTestSessionId: null,
  currentAdaptiveQuestionIndex: 0,
  adaptiveTestResults: null,

  timedTest: true,
  report: null,
  feedbacks: [],
  attempt_and_feedbacks: [],
  testDone: undefined,
}

const clearLocalStorage = () => {
  window.localStorage.removeItem('questions')
  window.localStorage.removeItem('testIndex')
  window.localStorage.removeItem('testLanguage')
}

export const getReadingTestQuestions = (language, is_continue = true, cycle = null) => {
  const route = `/test/${language}/reading`
  const prefix = 'GET_READING_TEST_QUESTIONS'
  const query = {
    'is_continue': is_continue
  }

  if (cycle) {
    query.cycle = cycle
  }

  console.log("check the query", query)

  const call = callBuilder(route, prefix, 'get', undefined, query, 'questions')
  return { ...call, language, startingIndex: 0 }
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

export const sendReadingTestAnswer = (language, sessionId, answer) => {
  const route = `/test/${language}/answer`
  const prefix = 'ANSWER_TEST_QUESTION'
  const payload = {
    session_id: sessionId,
    language,
    is_completed: false,
    answers: [answer],
  }
  return callBuilder(route, prefix, 'post', payload)
}

export const sendReadingTestQuestionnaireResponses = (reflection_response, language) => {
  const route = `/questionnaire/${language}`;
  const prefix = 'SEND_READING_TEST_QUESTIONNAIRE_RESPONSES';
  const payload = reflection_response;
  return callBuilder(route, prefix, 'post', payload);
};

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

export const sendAdaptiveTestAnswer = (
  language,
  sessionId,
  answer,
  duration,
  questionId,
  timedTest,
  is_stopped
) => {
  const route = `/test/${language}/adaptive/answer`
  const prefix = 'ANSWER_ADAPTIVE_TEST_QUESTION'
  const payload = {
    session_id: sessionId,
    answer,
    duration,
    question_id: questionId,
    timed_test: timedTest,
    is_stopped
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

export const getReadingHistory = (language, sessionId) => {
  console.log("getReadingHistory", sessionId)
  const route = `/test/${language}/reading/history?session_id=${sessionId}`
  const prefix = 'GET_READING_TEST_HISTORY'
  return callBuilder(route, prefix, 'get')
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

export const updateTimed = isTimed => ({ type: 'UPDATE_TIMED_TEST', isTimed })

export const resetTests = () => {
  clearLocalStorage()
  return { type: 'RESET_TESTS' }
}

export const updateTestFeedbacks = (answer, feedbacks) => ({
  type: 'UPDATE_TEST_FEEDBACKS', answer, feedbacks
})

export const updateReadingTestElicitation = (eliciated_construct) => ({
  type: 'UPDATE_READING_TEST_QUESTION_ELICITATION', eliciated_construct
})

export const nextTestQuestion = () => ({ type: 'NEXT_TEST_QUESTION' })

export const nextReadingTestQuestion = () => ({ type: 'NEXT_READING_TEST_QUESTION' })

export const finishLastReadingTestQuestion = () => ({ type: 'FINISH_LAST_READING_TEST_QUESTION' })

export const finishReadingTest = () => ({ type: 'FINISH_READING_TEST' })

export const markAnsweredChoice = (answer) => ({ type: 'MARK_ANSWERED_CHOICE', answer })

export const markQuestionAsSeen = (learningLanguage, questionId, sessionId) => {
  const route = `/test/${learningLanguage}/reading/seen?question_id=${questionId}&session_id=${sessionId}`
  const prefix = 'MARK_QUESTION_AS_SEEN'
  return callBuilder(route, prefix)
}

export default (state = initialState, action) => {
  const {
    currentAdaptiveQuestionIndex,
    currentExhaustiveQuestionIndex, exhaustiveTestQuestions,
    currentReadingQuestionIndex, readingTestQuestions,
    currentReadingSet, prevReadingSet, currentQuestionIdxinSet
  } = state
  const { response, startingIndex } = action

  switch (action.type) {
    case 'UPDATE_TIMED_TEST':
      return {
        ...initialState,
        timedTest: action.isTimed,
      }

    case 'GET_READING_TEST_QUESTIONS_ATTEMPT':
      return {
        ...initialState,
        testDone: state.testDone,
        timedTest: state.timedTest,
        pending: true,
        language: action.language,
      }
    case 'GET_READING_TEST_QUESTIONS_SUCCESS': {
      const {
        question_list,
        session_id,
        question_set_dict,
        all_cycles: allCycles,
        current_cycle: currentCycle,
        previous_status: previousStatus,
      } = response

      console.log('previousStatus: ', previousStatus)

      // Split questions by set
      const questionsBySet = question_list.reduce((acc, question) => {
        const set = question.set;
        if (!acc[set]) {
          acc[set] = { seen: [], unseen: [] };
        }
        if (question.seen) {
          acc[set].seen.push(question);
        } else {
          acc[set].unseen.push(question);
        }
        return acc;
      }, {});

      // Sort sets by set number
      const sortedSets = Object.keys(questionsBySet).sort((a, b) => parseInt(a) - parseInt(b));

      // Find the current question
      let tmpcurrentReadingTestQuestion = null;
      let currentSet = null;
      let tmpcurrentQuestionIdxinSet = -1;
      let tmpcurrentReadingQuestionIndex = -1;
      let tmpreadingSetLength = 0;
      let tempreadingTestQuestions = []

      let tmp_reading_question_idx = 0
      let current_question_is_set = false
      for (const set of sortedSets) {
        const { seen, unseen } = questionsBySet[set];
        tempreadingTestQuestions = tempreadingTestQuestions.concat(seen)
        tempreadingTestQuestions = tempreadingTestQuestions.concat(unseen)
        if (unseen.length > 0 && current_question_is_set != true) {
          tmpcurrentReadingTestQuestion = unseen[0];
          currentSet = set;
          tmpcurrentQuestionIdxinSet = seen.length;
          tmpcurrentReadingQuestionIndex = tmp_reading_question_idx + tmpcurrentQuestionIdxinSet;
          tmpreadingSetLength = unseen.length + seen.length;
          current_question_is_set = true
        } else {
          tmp_reading_question_idx = tempreadingTestQuestions.length;
        }
      }

      // Calculate previous reading set
      const prevReadingSet = currentSet && parseInt(currentSet) > 1 ? parseInt(currentSet) - 1 : null;

      // If the current question has only one construct, set the eliciated_construct field
      if (tmpcurrentReadingTestQuestion?.constructs?.length === 1) {
        tmpcurrentReadingTestQuestion.eliciated_construct = tmpcurrentReadingTestQuestion.constructs[0];
      }

      if (!previousStatus?.is_correct && previousStatus?.responses?.length && tmpcurrentReadingTestQuestion) {
        tmpcurrentReadingTestQuestion.choices = tmpcurrentReadingTestQuestion.choices.map(choice =>
          previousStatus?.responses.includes(choice.option)
            ? { ...choice, isSelected: true }
            : { ...choice }
        )
      }

      console.log('reducer tempreadingTestQuestions: ', tempreadingTestQuestions)

      console.log(
        'reducer testDone: ',
        tempreadingTestQuestions.filter(question => !question.seen).length === 0
      )

      return {
        ...state,
        readingTestSetDict: question_set_dict,
        readingTestQuestions: tempreadingTestQuestions,
        currentReadingTestQuestion: tmpcurrentReadingTestQuestion,
        currentReadingSet: currentSet,
        prevReadingSet: prevReadingSet,
        readingTestSessionId: session_id,
        currentReadingQuestionIndex: tmpcurrentReadingQuestionIndex,
        currentQuestionIdxinSet: tmpcurrentQuestionIdxinSet,
        feedbacks: [],
        attempt_and_feedbacks: [],
        readingSetLength: tmpreadingSetLength,
        pending: false,
        resumedTest: Object.values(questionsBySet).some(x => x.seen.length > 0),
        testDone: tempreadingTestQuestions.filter(question => !question.seen).length === 0,
        allCycles,
        currentCycle,
        previousStatus,
      };
    }
    case 'GET_READING_TEST_QUESTIONS_FAILURE':
      return {
        ...state,
        error: true,
        pending: false,
      }

    case 'GET_TEST_QUESTIONS_ATTEMPT':
      return {
        ...initialState,
        timedTest: state.timedTest,
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
        timedTest: state.timedTest,
        pending: true,
      }
    case 'INIT_ADAPTIVE_TEST_SUCCESS':
      return {
        ...initialState,
        timedTest: state.timedTest,
        pending: false,
        adaptiveTestSessionId: response.session_id,
        currentAdaptiveQuestion: response.next_question,
      }
    case 'INIT_ADAPTIVE_TEST_FAILURE':
      return {
        ...initialState,
        timedTest: state.timedTest,
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

    case 'NEXT_TEST_QUESTION':
      return {
        ...state,
        currentExhaustiveQuestionIndex: currentExhaustiveQuestionIndex + 1,
        currentExhaustiveTestQuestion: exhaustiveTestQuestions[currentExhaustiveQuestionIndex + 1],
        feedbacks: [],
        attempt_and_feedbacks: []
      }

    case 'FINISH_LAST_READING_TEST_QUESTION':
      let _lastSet = readingTestQuestions[currentReadingQuestionIndex]?.set;
      return {
        ...state,
        currentReadingSet: "-1",
        prevReadingSet: _lastSet,
        lastReadingSessionFinished: true,
      }

    case 'FINISH_READING_TEST':
      return {
        ...state,
        testDone: true
      }

    case 'GET_READING_TEST_HISTORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }

    case 'GET_READING_TEST_HISTORY_SUCCESS': {
      const { history } = response;

      // Initialize variables for tracking the statistics
      let totalQuestions = 0;
      let firstTimeCorrectCount = 0;
      let overallCorrectCount = 0;

      console.log("history", history)

      // Iterate through each question's history
      for (const questionId in history) {
        const attempts = history[questionId].attempts;

        if (attempts.length > 0) {
          totalQuestions += 1;

          // Check if the first attempt was correct
          if (attempts[0].correct) {
            firstTimeCorrectCount += 1;
          }

          // Check if any attempt was correct
          if (attempts.some(attempt => attempt.correct)) {
            overallCorrectCount += 1;
          }
        }
      }

      // Calculate rates
      const firstTimeCorrectRate = totalQuestions > 0 ? (firstTimeCorrectCount / totalQuestions) * 100 : 0;
      const overallCorrectRate = totalQuestions > 0 ? (overallCorrectCount / totalQuestions) * 100 : 0;

      // Return the updated state
      return {
        ...state,
        pending: false,
        readingHistory: {
          total_num_question: totalQuestions,
          first_time_answer_correct_rate: firstTimeCorrectRate,
          overall_correct_rate: overallCorrectRate,
        },
      };
    }

    case 'GET_READING_TEST_HISTORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }

    case 'NEXT_READING_TEST_QUESTION':
      if (currentReadingQuestionIndex < readingTestQuestions.length - 1) {
        let _currentReadingSet = readingTestQuestions[currentReadingQuestionIndex + 1].set;
        let _prevReadingSet = readingTestQuestions[currentReadingQuestionIndex].set;
        let currentReadingTestQuestion = readingTestQuestions[currentReadingQuestionIndex + 1];
        if (currentReadingTestQuestion?.constructs?.length === 1) {
          currentReadingTestQuestion.eliciated_construct = currentReadingTestQuestion.constructs[0];
        }
        let readingSetLength = readingTestQuestions.filter(question => question.set === _currentReadingSet).length;
        return {
          ...state,
          currentReadingQuestionIndex: currentReadingQuestionIndex + 1,
          currentReadingTestQuestion: currentReadingTestQuestion,
          currentReadingSet: _currentReadingSet,
          prevReadingSet: _prevReadingSet,
          currentQuestionIdxinSet: _currentReadingSet !== _prevReadingSet ? 0 : currentQuestionIdxinSet + 1,
          feedbacks: [],
          attempt_and_feedbacks: [],
          readingSetLength: readingSetLength,
        }
      }

    case 'ANSWER_TEST_QUESTION_ATTEMPT':
      return {
        ...state,
        answerPending: true,
      }
    case 'ANSWER_TEST_QUESTION_SUCCESS':
      return {
        ...state,
        // currentExhaustiveQuestionIndex: currentExhaustiveQuestionIndex + 1,
        // currentExhaustiveTestQuestion: exhaustiveTestQuestions[currentExhaustiveQuestionIndex + 1],
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
      return {
        ...initialState,
        testDone: false,
      }

    case 'UPDATE_TEST_FEEDBACKS':
      return {
        ...state,
        feedbacks: [...state.feedbacks, action.feedbacks],
        attempt_and_feedbacks: [
          ...(state.attempt_and_feedbacks || []),
          { attempt: action.answer, feedback: action.feedbacks },
        ],
      };

    case 'UPDATE_READING_TEST_QUESTION_ELICITATION':
      if (state.currentReadingTestQuestion) {
        return {
          ...state,
          currentReadingTestQuestion: {
            ...state.currentReadingTestQuestion,
            eliciated_construct: action.eliciated_construct
          }
        }
      }
      break
    case 'MARK_ANSWERED_CHOICE':
      if (state.currentReadingTestQuestion) {
        const updatedChoices = state.currentReadingTestQuestion.choices.map(choice => {
          if (choice.option === action.answer) {
            return { ...choice, isSelected: true };
          } else {
            return { ...choice };
          }
        });

        const updatedCurrentReadingTestQuestion = {
          ...state.currentReadingTestQuestion,
          choices: updatedChoices,
        };

        return {
          ...state,
          currentReadingTestQuestion: updatedCurrentReadingTestQuestion,
        };
      }
      break
    case 'MARK_QUESTION_AS_SEEN_SUCCESS':
      return {
        ...state,
        readingTestQuestions: state.readingTestQuestions.map(question =>
          question.question_id === response.question_id ? { ...question, seen: true } : question
        ),
      }
    default:
      return state
  }
}
