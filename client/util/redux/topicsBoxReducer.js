const initialState = {
    showTopicsBox: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_TOPICS_BOX':
            return {...initialState, showTopicsBox: true }
        case 'CLOSE_TOPICS_BOX':
            return { ...initialState, showTopicsBox: false }
        default:
            return state
    }
}