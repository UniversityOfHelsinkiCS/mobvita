
const type = {
  success: 'success',
  error: 'error',
  warn: 'warn',
  info: 'info',
}

export default (state = { message: null, type: null }, action) => {
  switch (action.type) {
    case 'POST_NEW_STORY_FAILURE':
      return {
        message: action.response.response.data,
        type: type.error,
      }
    case 'POST_NEW_STORY_SUCCESS':
      return {
        message: `Processing story: ${action.response.story_id}`,
        type: type.info,
      }
    case 'RESET_NOTIFICATION':
      return { message: null, type: null }
    default:
      return state
  }
}
