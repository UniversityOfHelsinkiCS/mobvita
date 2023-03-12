const initialState = {
  showProfileDropdown: false,
  showPracticeDropdown: false,
  showLessonTopicDropdown: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_PROFILE_DROPDOWN':
      return { ...initialState, showProfileDropdown: true }
    case 'CLOSE_PROFILE_DROPDOWN':
      return { ...initialState, showProfileDropdown: false }
    case 'SHOW_PRACTICE_DROPDOWN':
      return { ...initialState, showPracticeDropdown: true }
    case 'CLOSE_PRACTICE_DROPDOWN':
      return { ...initialState, showPracticeDropdown: false }
      case 'SHOW_LESSON_TOPIC_DROPDOWN':
        console.log("click")
        return { ...initialState, showLessonTopicDropdown: true }
    case 'CLOSE_LESSON_TOPIC_DROPDOWN':
        return { ...initialState, showLessonTopicDropdown: false }
    default:
      return state
  }
}
