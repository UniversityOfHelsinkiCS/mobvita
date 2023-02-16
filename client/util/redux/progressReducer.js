
const initialState = {
    currentChart: 'progress'
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TIMELINE_CHART':
            return { ...state, currentChart: 'progress' }
        case 'SET_VOCABULARY_CHART':
            return { ...state, currentChart: 'vocabulary'}
        case 'SET_GRAMMAR_CHART':
            return { ...state, currentChart: 'hex-map'}
        case 'SET_EXERCISE_HISTORY_CHART':
            return { ...state, currentChart: 'exercise-history'}
        case 'SET_TEST_HISTORY_CHART':
            return { ...state, currentChart: 'test-history'}
        default:
            return state
    }
}