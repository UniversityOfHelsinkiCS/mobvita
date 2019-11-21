export const setLocale = locale => ({ type: 'SET_LOCALE', locale })

export default (state = 'fi', action) => {
  switch (action.type) {
    case 'SET_LOCALE':
      return action.locale
    default:
      return state
  }
}
