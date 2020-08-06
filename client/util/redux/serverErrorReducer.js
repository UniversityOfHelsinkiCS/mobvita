export const setServerError = () => ({ type: 'SET_SERVER_ERROR' })
export const clearServerError = () => ({ type: 'CLEAR_SERVER_ERROR' })

const initialState = { serverError: false }

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SERVER_ERROR':
      return {
        serverError: true,
      }
    case 'CLEAR_SERVER_ERROR':
      return {
        serverError: false,
      }
    default:
      return state
  }
}
