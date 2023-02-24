
const initialState = {
    showProfileDropdown: false
}

export default (state = initialState, action) =>{
    switch (action.type) {
        case 'SHOW_PROFILE_DROPDOWN':
            return {...initialState, showProfileDropdown: true}
        case 'CLOSE_PROFILE_DROPDOWN':
            return {...initialState, showProfileDropdown: false}
        default:
            return state
    }
}