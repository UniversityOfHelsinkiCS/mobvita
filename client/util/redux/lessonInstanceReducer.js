import callBuilder from '../apiConnection'

export const clearLessonInstanceState = () => ({ type: 'CLEAR_LESSON_INSTANCE_STATE' })


export const getLessonInstance = group_id => {
  let route = '/lesson'
  if (group_id) route = route + `?group_id=${group_id}`
  const prefix = 'GET_LESSON_INSTANCE'
  return callBuilder(route, prefix, 'get')
}

export const setLessonInstance = payload => {
  const route = '/lesson'
  const prefix = 'SET_LESSON_INSTNACE'
  
  return callBuilder(route, prefix, 'post', payload)
}

const initialState = {
  lesson: {},
  pending: false,
  error: false,
}

export default (state = initialState, action) => {
  switch (action.type) {

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
      return {
        ...state,
        pending: false,
        lesson: action.response.lesson,
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
        lesson: action.response.lesson,
      }
      
    default:
      return state
  }
}
