import {
  studentHomeTourSteps,
  teacherHomeTourSteps,
  libraryTourSteps,
  progressTourSteps,
  anonymousProgressTourSteps,
  practiceTourSteps,
  practiceTourStepsAlternative,
  lessonsTourSteps,
} from 'Utilities/common'

const initialState = {
  key: new Date(), // This field makes the tour to re-render it is restarted
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  steps: studentHomeTourSteps,
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

export const startAnonymousProgressTour = () => ({
  type: 'ANONYMOUS_PROGRESS_TOUR_RESTART',
})

export const startPracticeTour = () => ({
  type: 'PRACTICE_TOUR_RESTART',
})

export const startLessonsTour = () => ({
  type: 'LESSONS_TOUR_RESTART'
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
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      }
    case 'SET_STUDENT_HOME_TOUR_STEPS':
      return {
        ...state,
        steps: studentHomeTourSteps,
      }
    case 'SET_TEACHER_HOME_TOUR_STEPS':
      return {
        ...state,
        steps: teacherHomeTourSteps,
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
    case 'ANONYMOUS_PROGRESS_TOUR_RESTART':
      return {
        ...state,
        steps: anonymousProgressTourSteps,
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
    // This alternative is used when practice tour is started
    // in practice view instead of preview view, so that
    // the progress shown in the tour starts at eg. 1/6 and not 5/10
    case 'PRACTICE_TOUR_ALTERNATIVE':
      return {
        ...state,
        steps: practiceTourStepsAlternative,
        stepIndex: 0,
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
