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

// Open the assistant sidebar AND show the "add new stories" options inside it (replaces the old modal).
export const openAddStoryOptions = () => ({
  type: 'OPEN_ADD_STORY_OPTIONS',
})

export const closeAddStoryOptions = () => ({
  type: 'CLOSE_ADD_STORY_OPTIONS',
})

const initialState = {
  isOpen: typeof window !== 'undefined' && window.innerWidth >= 450 ? true : false,
  activeTab: undefined,
  addStoryOptionsOpen: false,
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
    case 'OPEN_ADD_STORY_OPTIONS':
      return {
        ...state,
        isOpen: true,
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
