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

// Show the "Add New Story" dialog (mounted app-wide in App.js).
export const openAddStoryOptions = () => ({
  type: 'OPEN_ADD_STORY_OPTIONS',
})

// Hide the "Add New Story" dialog.
export const closeAddStoryOptions = () => ({
  type: 'CLOSE_ADD_STORY_OPTIONS',
})

const initialState = {
  isOpen: typeof window !== 'undefined' && window.innerWidth >= 450 ? true : false,
  activeTab: undefined,
  addStoryOptionsOpen: false,
}

// Assistant sidebar state: open/collapsed, the active tab, and the add-story dialog flag.
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
    case 'OPEN_ADD_STORY_OPTIONS':
      return {
        ...state,
        addStoryOptionsOpen: true,
      }
    case 'CLOSE_ADD_STORY_OPTIONS':
      return {
        ...state,
        addStoryOptionsOpen: false,
      }
    default:
      return state
  }
}
