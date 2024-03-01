export const sidebarSetOpen = open => ({ type: 'TOGGLE_SIDEBAR', open })

export default (state = { open: false }, action) => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        open: action.open,
      }
    default:
      return state
  }
}
