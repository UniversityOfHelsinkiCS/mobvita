const initialState = {
  showModal: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return { ...initialState, showModal: true }
    case 'CLOSE_MODAL':
      return { ...initialState, showModal: false }
    default:
      return state
  }
}
