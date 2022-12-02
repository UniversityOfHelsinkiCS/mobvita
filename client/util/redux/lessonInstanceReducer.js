import callBuilder from '../apiConnection'


export const getLessonActiveInstance = lesson_syllabus_id => {
  if (lesson_syllabus_id) {
    const route = `/lesson/active_instance/${lesson_syllabus_id}`
    const prefix = 'GET_LESSON_ACTIVE_INSTANCE'
  
    return callBuilder(route, prefix, 'get')
  }
}

export const getLessonInstance = (lesson_instance_id) => {
  if (lesson_instance_id){
    let route = `/lesson/${lesson_instance_id}`
    const prefix = 'GET_LESSON_INSTNACE'
  
    return callBuilder(route, prefix, 'get')
  }
}

export const setLessonInstance = (lesson_instance_id, payload) => {
  let route = '/lesson'
  if (lesson_instance_id !== null) {
    route = `/lesson/${lesson_instance_id}`
  }
  const prefix = 'SET_LESSON_INSTNACE'

  return callBuilder(route, prefix, 'post', payload)
}

const initialState = {
  lesson_instance: {},
  pending: false,
  error: false,
}

export default (state = initialState, action) => {
  switch (action.type) {

    case 'GET_LESSON_ACTIVE_INSTANCE_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_LESSON_ACTIVE_INSTANCE_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_LESSON_ACTIVE_INSTANCE_SUCCESS':
      return {
        ...state,
        pending: false,
        lesson_instance: action.response.lesson_active_instance,
      }

    case 'GET_LESSON_INSTNACE_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_LESSON_INSTNACE_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_LESSON_INSTNACE_SUCCESS':
      return {
        ...state,
        pending: false,
        lesson_instance: action.response.lesson_active_instance,
      }

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
        lesson_instance: action.response.lesson,
      }
      
    default:
      return state
  }
}
