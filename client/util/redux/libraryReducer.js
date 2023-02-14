export const libraryDropdownOpen = open => ({ type: 'TOGGLE_DROPDOWN', open })

export default (state = { open: false }, action) => {
    switch (action.type) {
        case 'TOGGLE_DROPDOWN':
            return {
                ...state,
                open: action.open !== state.open && action.open,
            }
        default: return state
    }
}