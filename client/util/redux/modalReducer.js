const initialState = {
  showModal: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_MODAL':
        console.log("moimoi")
      return { ...initialState, showModal: true }
    case 'CLOSE_MODAL':
        console.log("heihei")
      return { ...initialState, showModal: false }
    default:
      return state
  }
}
