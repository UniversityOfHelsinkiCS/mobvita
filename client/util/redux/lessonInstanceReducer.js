import callBuilder from '../apiConnection'

export const clearLessonInstanceState = () => ({ type: 'CLEAR_LESSON_INSTANCE_STATE' })

export const setLessonStep = (lessonStep) => ({ type: 'SET_LESSON_STEP', lessonStep })
export const resetLessonStep = () => ({ type: 'RESET_LESSON_STEP' })

export const getLessonInstance = group_id => {
  let route = '/lesson'
  if (group_id) route = route + `?group_id=${group_id}`
  const prefix = 'GET_LESSON_INSTANCE'
  return callBuilder(route, prefix, 'get')
}

export const setLessonInstance = payload => {
  // check if the set lesson endpoint is changed
  const route = '/lesson'
  const prefix = 'SET_LESSON_INSTNACE'
  
  return callBuilder(route, prefix, 'post', payload)
}

const initialState = {
  lesson: {},
  pending: false,
  error: false,
  step: -1,
}

export default (state = initialState, action) => {
  switch (action.type) {

    case 'TOGGLE_LESSON_SEMANTIC':
      const { semantic } = action;
      if (state.lesson.semantic.includes(semantic)) {
        return {
          ...state,
          lesson: {
            ...state.lesson,
            semantic: state.lesson.semantic.filter(item => item !== semantic),
          },
        };
      } else {
        return {
          ...state,
          lesson: {
            ...state.lesson,
            semantic: [...state.lesson.semantic, semantic],
          },
        };
      }


    case 'SET_LESSON_SELECTED_TOPICS':
      let newLesson = JSON.parse(JSON.stringify(state.lesson));
      newLesson.topic_ids = action.topic_ids
      return {
        ...state,
        lesson: newLesson,
      }

    case 'CLEAR_LESSON_INSTANCE_STATE':
      return initialState
      
    case 'GET_LESSON_INSTANCE_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_LESSON_INSTANCE_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_LESSON_INSTANCE_SUCCESS':
      const uniqueSemantics = Array.from(new Set(action.response.lesson.semantic));
      return {
        ...state,
        pending: false,
        lesson: {
          ...action.response.lesson,
          semantic: uniqueSemantics,
        },
      };

    case 'SET_LESSON_INSTNACE_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'SET_LESSON_INSTNACE_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'SET_LESSON_INSTNACE_SUCCESS':
      return {
        ...state,
        pending: false,
        lesson: action.response.lesson,
      }
    case 'SET_LESSON_STEP':
      return {
        ...state,
        step: action.lessonStep,
      }
    
    case 'RESET_LESSON_STEP':
      return {
        ...state,
        step: -1,
      }
      
    default:
      return state
  }
}
