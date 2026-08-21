/**
 * Route for the "continue previous activity" shortcut, or null when the activity can no longer be
 * resumed (the story is gone, or reading-comprehension is off for the current language).
 *
 * Shared by the home page and the sidebar so the two shortcuts can never point at different places.
 */
export const assembleActivityLink = (
  lastActivity,
  { stories, learningLanguage, readingComprehensionEnabled } = {},
) => {
  const storyId = lastActivity?.story_id
  const story = stories?.find(x => x._id === storyId)

  switch (lastActivity?.type) {
    case 'flashcard':
      return '/flashcards'
    case 'preview':
      return story ? `/stories/${storyId}/preview/` : null
    case 'review':
      return story ? `/stories/${storyId}/review/` : null
    case 'practice':
      if (story?.control_story) return `/stories/${storyId}/controlled-practice/`
      return story ? `/stories/${storyId}/practice/` : null
    case 'lesson':
      return lastActivity.group_id
        ? `/lesson/group/${lastActivity.group_id}/practice`
        : '/lesson/practice'
    case 'crossword':
      return `/crossword/${storyId}`
    case 'reading-test':
      return learningLanguage === lastActivity.language && readingComprehensionEnabled
        ? '/reading-test'
        : null
    default:
      return null
  }
}

export default assembleActivityLink
