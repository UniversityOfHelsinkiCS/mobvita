// Route `type` for a story's terminology deck: same-language word : explanation cards (fin2fin).
export const TERMINOLOGY = 'terminology'
export const TERMINOLOGY_DEFAULT_MODE = 'match'
// Translate cards ask for a translation, which terminology cards do not have.
export const TERMINOLOGY_EXCLUDED_MODES = ['fillin']

// Path for a practice mode: keeps a story or terminology deck, leaves the blue-cards test.
export const flashcardModePath = (mode, type, storyId) => {
  if (!storyId || type === 'test') return `/flashcards/${mode}`
  const keepTerminology = type === TERMINOLOGY && !TERMINOLOGY_EXCLUDED_MODES.includes(mode)
  return `/flashcards/${mode}/${keepTerminology ? TERMINOLOGY : 'story'}/${storyId}`
}
