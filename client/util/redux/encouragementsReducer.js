export const openEncouragement = () => ({ type: 'OPEN_ENCOURAGEMENT' })
export const closeEncouragement = () => ({ type: 'CLOSE_ENCOURAGEMENT' })
export const showIcon = () => ({ type: 'SHOW_ICON' })
export const hideIcon = () => ({ type: 'HIDE_ICON' })
export const openLPEncouragement = () => ({ type: 'OPEN_LESSON_PRACTICE_ENCOURAGEMENT' })
export const openFCEncouragement = () => ({ type: 'OPEN_FLASHCARDS_ENCOURAGEMENT' })
export const closeLPEncouragement = () => ({ type: 'CLOSE_LESSON_PRACTICE_ENCOURAGEMENT' })
export const closeFCEncouragement = () => ({ type: 'CLOSE_FLASHCARDS_ENCOURAGEMENT' })
export const showFCIcon = () => ({ type: 'SHOW_FLASHCARDS_ICON' })
export const hideFCIcon = () => ({ type: 'HIDE_FLASHCARDS_ICON' })

export default (state = { open: false, show: false, fcOpen: false, fcShow: false }, action) => {
  switch (action.type) {
    case 'OPEN_ENCOURAGEMENT':
      return {
        ...state,
        open: true,
      }
    case 'CLOSE_ENCOURAGEMENT':
      return {
        ...state,
        open: false,
      }
    case 'SHOW_ICON':
      return {
        ...state,
        show: true,
      }
    case 'HIDE_ICON':
      return {
        ...state,
        show: false,
      }
    case 'OPEN_FLASHCARDS_ENCOURAGEMENT':
      return {
        ...state,
        fcOpen: true,
      }
    case 'OPEN_LESSON_PRACTICE_ENCOURAGEMENT':
      return {
        ...state,
        fcOpen: true,
      }
    case 'CLOSE_FLASHCARDS_ENCOURAGEMENT':
      return {
        ...state,
        fcOpen: false,
      }
    case 'CLOSE_LESSON_PRACTICE_ENCOURAGEMENT':
      return {
        ...state,
        fcOpen: false,
      }
    case 'SHOW_FLASHCARDS_ICON':
      return {
        ...state,
        fcShow: true,
      }
    case 'HIDE_FLASHCARDS_ICON':
      return {
        ...state,
        fcShow: false,
      }
    default:
      return state
  }
}
