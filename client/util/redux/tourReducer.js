import { tourSteps } from 'Utilities/common'

const initialState = {
  key: new Date(), // This field makes the tour to re-render when we restart the tour
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  steps: tourSteps,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TOUR_START':
      return { ...state, run: true }
    case 'TOUR_RESET':
      return { ...state, stepIndex: 0 }
    case 'TOUR_STOP':
      return { ...state, run: false }
    case 'TOUR_NEXT_OR_PREV':
      return { ...state, ...action.payload }
    case 'TOUR_RESTART':
      return {
        ...state,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      }
    default:
      return state
  }
}
