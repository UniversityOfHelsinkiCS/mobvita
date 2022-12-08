import callBuilder from '../apiConnection'

export const clearExerciseState = () => ({ type: 'CLEAR_LESSON_EXERCISE_STATE' })
export const addToPrevious = snippets => ({ type: 'ADD_TO_PREVIOUS_LESSON_SNIPPETS', snippets })
export const setFocusingSnippets = snippets => ({ type: 'SET_FOCUSING_LESSON_SNIPPETS', snippets })

export const setAttempt = (attempt) => ({ type: 'SET_ATTEMPT', attempt })
export const setNextSnippet = () => ({ type: 'SET_NEXT_LESSON_SNIPPET' })
export const finishCurrentSnippet = () => ({ type: 'FINISH_CURRENT_SNIPPET'})

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

const append_story_id_to_exercise_tokens = (exercises) => {
  let _exercises = []
  exercises.forEach(exercise => {
    let exercise_tokens = []
    exercise.sent.forEach(token => {
      token['story_id'] = exercise['story_id']
      exercise_tokens.push(token)
    })
    exercise['sent'] = exercise_tokens
    _exercises.push(exercise)
  })
  return _exercises
}

const initialState = {
  current_attempt: 0,
  max_attempt_per_snippet: 3,
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
    case 'SET_ATTEMPT':
      return {
        ...state,
        current_attempt: action.attempt,
      }
    case 'CLEAR_LESSON_EXERCISE_STATE':
      return initialState
    case 'SET_NEXT_LESSON_SNIPPET':
      let practiced_snippets = state.previous_snippets.concat(state.focusing_snippets)
      let next_focusing_snippets = []
      if (practiced_snippets.length < state.lesson_exercises.length){
        next_focusing_snippets = [state.lesson_exercises[practiced_snippets.length]]
      }
      return {
        ...state,
        focusing_snippets: next_focusing_snippets,
        previous_snippets: practiced_snippets,
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
      const lesson_exercises = append_story_id_to_exercise_tokens(action.response.exercises)
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
      const exercised_snippets_responses = action.response.exercises
      let has_wrong_answers = false
      for (let i=0; i < exercised_snippets_responses.length; i++){
        let snippet_exerice_response = exercised_snippets_responses[i]
        snippet_exerice_response.sent.forEach((e, i) => {
          if (e.isWrong) { has_wrong_answers = true }
        }); 
      }

      if (state.current_attempt < state.max_attempt_per_snippet && has_wrong_answers) {
        const focusing_snippets_feedback = append_story_id_to_exercise_tokens(action.response.exercises)
        return {
          ...state,
          focusing_snippets: focusing_snippets_feedback,
          answersPending: false,
        }
      } else {
        let practiced_snippets = state.previous_snippets.concat(action.response.exercises)
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
