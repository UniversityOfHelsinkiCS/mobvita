import { progressTour } from 'Utilities/common'

const initialState = {
  key: new Date(), // This field makes the tour to re-render it is restarted
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  steps: progressTour,
}

export const startProgressTour = () => ({
  type: 'PROGRESS_TOUR_START',
})

export const handleNextProgressTourStep = stepIndex => ({
  type: 'PROGRESS_TOUR_NEXT_OR_PREV',
  payload: { stepIndex },
})

export const stopProgressTour = () => ({
  type: 'PROGRESS_TOUR_STOP',
})

export default (state = initialState, action) => {
  switch (action.type) {
    case 'PROGRESS_TOUR_START':
      return { ...state, run: true }
    case 'PROGRESS_TOUR_RESET':
      return { ...state, stepIndex: 0 }
    case 'PROGRESS_TOUR_STOP':
      return { ...state, run: false }
    case 'PROGRESS_TOUR_NEXT_OR_PREV':
      return { ...state, ...action.payload }
    case 'PROGRESS_TOUR_RESTART':
      console.log("kyllä tää ajaa")
      console.log(state.steps)
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
