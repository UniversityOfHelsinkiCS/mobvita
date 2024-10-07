export const setLocale = locale => ({ type: 'SET_LOCALE', locale })
const initialState = {
  locale: 'en',
  updated: false
}
export default (state=initialState, action) => {
  switch (action.type) {
    case 'SET_LOCALE':
      return {
        locale: action.locale,
        updated: true
      }
    default:
      return state
  }
}
