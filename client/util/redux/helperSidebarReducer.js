export const setHelperSidebarOpen = isOpen => ({
  type: 'SET_HELPER_SIDEBAR_OPEN',
  isOpen,
})

export const toggleHelperSidebar = () => ({
  type: 'TOGGLE_HELPER_SIDEBAR',
})

const initialState = {
  isOpen: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_HELPER_SIDEBAR_OPEN':
      return {
        ...state,
        isOpen: action.isOpen,
      }
    case 'TOGGLE_HELPER_SIDEBAR':
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    default:
      return state
  }
}