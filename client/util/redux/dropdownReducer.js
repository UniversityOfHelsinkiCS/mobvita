
const initialState = {
    showProfileDropdown: false,
    showPracticeDropdown: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_PROFILE_DROPDOWN':
            return { ...initialState, showProfileDropdown: true }
        case 'CLOSE_PROFILE_DROPDOWN':
            return { ...initialState, showProfileDropdown: false }
        case 'SHOW_PRACTICE_DROPDOWN':
            return { ...initialState, showPracticeDropdown: true }
        case 'CLOSE_PRACTICE_DROPDOWN':
            return { ...initialState, showPracticeDropdown: false }
        default:
            return state
    }
}