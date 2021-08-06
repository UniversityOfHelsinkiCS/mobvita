export const setReferences = references => ({ type: 'SET_REVIEW_REFERENCES', references })
export const clearReferences = () => ({ type: 'CLEAR_REVIEW_REFERENCES' })

const initialState = {
  references: null,
  refModalOpen: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_REVIEW_REFERENCES':
      return {
        ...state,
        references: action.references,
      }
    case 'CLEAR_REVIEW_REFERENCES':
      return {
        ...state,
        references: initialState.references,
      }
    default:
      return state
  }
}
