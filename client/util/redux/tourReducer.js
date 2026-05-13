const initialState = {
  key: new Date(), // Forces Joyride to re-mount when restarted.
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  name: 'home',
}

export const startTour = () => ({ type: 'TOUR_START' })
export const startLibraryTour = () => ({ type: 'LIBRARY_TOUR_RESTART' })
export const startProgressTour = () => ({ type: 'PROGRESS_TOUR_RESTART' })
export const startAnonymousProgressTour = () => ({ type: 'ANONYMOUS_PROGRESS_TOUR_RESTART' })
export const startPracticeTour = () => ({ type: 'PRACTICE_TOUR_RESTART' })
export const startLessonsTour = () => ({ type: 'LESSONS_TOUR_RESTART' })

export const handleNextTourStep = stepIndex => ({
  type: 'TOUR_NEXT_OR_PREV',
  payload: { stepIndex },
})

export const stopTour = () => ({ type: 'TOUR_STOP' })

const restart = name => ({
  name,
  stepIndex: 0,
  run: true,
  loading: false,
  key: new Date(),
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
      return { ...state, ...restart(state.name) }
    case 'SET_STUDENT_HOME_TOUR_STEPS':
    case 'SET_TEACHER_HOME_TOUR_STEPS':
      return { ...state, name: 'home' }
    case 'LIBRARY_TOUR_RESTART':
      return { ...state, ...restart('library') }
    case 'PROGRESS_TOUR_RESTART':
      return { ...state, ...restart('progress') }
    case 'ANONYMOUS_PROGRESS_TOUR_RESTART':
      return { ...state, ...restart('progress-anonymous') }
    case 'PRACTICE_TOUR_RESTART':
      return { ...state, ...restart('practice') }
    case 'PRACTICE_TOUR_ALTERNATIVE':
      return { ...state, ...restart('practice-alt') }
    case 'LESSONS_TOUR_RESTART':
      return { ...state, ...restart('lessons') }
    default:
      return state
  }
}
