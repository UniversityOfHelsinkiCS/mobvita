import { homeTourSteps, libraryTourSteps, progressTourSteps, practiceTourSteps, lessonsTourSteps } from 'Utilities/common'

const initialState = {
  key: new Date(), // This field makes the tour to re-render it is restarted
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  steps: homeTourSteps,
}

export const startTour = () => ({
  type: 'TOUR_START',
})

export const startLibraryTour = () => ({
  type: 'LIBRARY_TOUR_RESTART',
})

export const startProgressTour = () => ({
  type: 'PROGRESS_TOUR_RESTART',
})

export const startPracticeTour = () => ({
  type: 'PRACTICE_TOUR_RESTART',
})

export const startLessonsTour = () => ({
  type : 'LESSONS_TOUR_RESTART'
})

export const handleNextTourStep = stepIndex => ({
  type: 'TOUR_NEXT_OR_PREV',
  payload: { stepIndex },
})

export const stopTour = () => ({
  type: 'TOUR_STOP',
})

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
        steps: homeTourSteps,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      }
    case 'LIBRARY_TOUR_RESTART':
      return {
        ...state,
        steps: libraryTourSteps,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      }
    case 'PROGRESS_TOUR_RESTART':
      return {
        ...state,
        steps: progressTourSteps,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      }
    case 'PRACTICE_TOUR_RESTART':
      return {
        ...state,
        steps: practiceTourSteps,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      }
    case 'PRACTICE_TOUR_ALTERNATIVE':
      return {
        ...state,
        steps: practiceTourSteps,
        stepIndex: 4,
        run: true,
        loading: false,
        key: new Date(),
      }
    case 'PRACTICE_TOUR_MOBILE_ALTERNATIVE':
      return {
        ...state,
        steps: practiceTourSteps,
        stepIndex: 3,
        run: true,
        loading: false,
        key: new Date(),
      }
      case 'LESSONS_TOUR_RESTART':
      return {
        ...state,
        steps: lessonsTourSteps,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      }
    default:
      return state
  }
}
