import callBuilder from '../apiConnection'

export const clearExerciseState = () => ({ type: 'CLEAR_LESSON_EXERCISE_STATE' })
export const addToPrevious = snippets => ({ type: 'ADD_TO_PREVIOUS_LESSON_SNIPPETS', snippets })
export const setFocusingSnippets = snippets => ({ type: 'SET_FOCUSING_LESSON_SNIPPETS', snippets })

export const getExerciseLesson = lessonId => {
  const route = `/lesson/${lessonId}/exercise`
  const prefix = 'GET_EXERCISE_LESSON'

  return callBuilder(route, prefix)
}

export const postLessonExerciseAnswers = (lessonId, answersObject, compete = false) => {
  const payload = answersObject
  payload.compete = compete
  const route = `/lesson/${lessonId}/exercise`
  const prefix = 'GET_LESSON_ANSWERS'

  return callBuilder(route, prefix, 'post', payload)
}

const initialState = {
  lesson_exercises: [],
  focusing_snippets: [],
  previous_snippets: [],
  session_id: '',
  starttime: null,
  pending: false,
  error: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CLEAR_LESSON_EXERCISE_STATE':
      return {
        ...state,
        lesson_exercises: [],
        focusing_snippets: [],
        previous_snippets: [],
      }

    case 'SET_FOCUSING_LESSON_SNIPPETS':
      return {
        ...state,
        focusing_snippets: action.snippets,
      }
    case 'GET_EXERCISE_LESSON_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_EXERCISE_LESSON_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_EXERCISE_LESSON_SUCCESS':
      let lesson_exercises = []
      action.response.exercises.forEach(exercise => {
        let exercise_tokens = []
        exercise.sent.forEach(token => {
          token['story_id'] = exercise['story_id']
          exercise_tokens.push(token)
        })
        exercise['sent'] = exercise_tokens
        lesson_exercises.push(exercise)
      })
      return {
        ...state,
        pending: false,
        lesson_exercises: lesson_exercises,
        session_id: action.response.session_id,
        starttime: action.response.starttime,
        previous_snippets: [],
        focusing_snippets: [],
      }
    case 'GET_LESSON_ANSWERS_ATTEMPT':
      return {
        ...state,
        answersPending: true,
      }
    case 'GET_LESSON_ANSWERS_FAILURE':
      return {
        ...state,
        answersPending: false,
        pending: false,
        error: true,
      }
    case 'GET_LESSON_ANSWERS_SUCCESS':
      let practiced_snippets = action.response.exercises// state.previous_snippets.concat(action.response.exercises)
      let focusing_snippets = []
      if (practiced_snippets.length < state.lesson_exercises.length){
        focusing_snippets = [state.lesson_exercises[practiced_snippets.length]]
      }
      return {
        ...state,
        previous_snippets: practiced_snippets,
        focusing_snippets: focusing_snippets,
        answersPending: false,
      }


    // case 'ADD_TO_PREVIOUS_LESSON_SNIPPETS':
    //   return {
    //     ...state,
    //     previous_snippets: state.previous_snippets.concat(action.snippets),
    //   }
    default:
      return state
  }
}
