export const setHelperSidebarOpen = isOpen => ({
  type: 'SET_HELPER_SIDEBAR_OPEN',
  isOpen,
})

export const toggleHelperSidebar = () => ({
  type: 'TOGGLE_HELPER_SIDEBAR',
})

export const setHelperSidebarTab = tab => ({
  type: 'SET_HELPER_SIDEBAR_TAB',
  tab,
})

const initialState = {
  isOpen: false,
  activeTab: undefined,
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
    case 'SET_HELPER_SIDEBAR_TAB':
      return {
        ...state,
        activeTab: action.tab,
      }
    default:
      return state
  }
}