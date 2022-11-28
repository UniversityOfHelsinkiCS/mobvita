import callBuilder from '../apiConnection'


export const getLessonInstance = lesson_syllabus_id => {
  const route = `/lesson/active_instance/${lesson_syllabus_id}`
  const prefix = 'GET_LESSON_INSTANCE'

  return callBuilder(route, prefix)
}

const initialState = {
  lesson_instance: {},
  pending: false,
  error: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    
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
      return {
        ...state,
        pending: false,
        lesson_instance: action.response.lesson_active_instance,
      }
    default:
      return state
  }
}
