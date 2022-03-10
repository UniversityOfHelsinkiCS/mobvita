export const enableFetcher = () => ({ type: 'ENABLE_FETCHER' })
export const disableFetcher = () => ({ type: 'DISABLE_FETCHER' })

const initialState = {
  disabled: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ENABLE_FETCHER':
      return {
        ...state,
        disabled: false,
      }
    case 'DISABLE_FETCHER':
      return {
        ...state,
        disabled: true,
      }
    default:
      return state
  }
}
