export const setNotes = items => ({
  type: 'SET_NOTES',
  items,
})

export const clearNotes = () => ({
  type: 'CLEAR_NOTES',
})

// Pure builder: turns an exercise word into a flat list of note items, mirroring the
// content blocks that used to be shown in the word tooltip. No React / i18n / formatting
// here — the renderer (CombinedChatbot) formats each item by `kind`.
export const buildWordNotes = (word, { answer, tiedAnswer, isPreviewMode, hiddenFeatures } = {}) => {
  if (!word) return []
  const items = []

  // Show the multiple-choice bubble for any MC word (right OR wrong answer) — i.e.
  // whenever there's an MC marker or a set of choices to display.
  if ((word.mc_correct || word.choices?.length) && !isPreviewMode) {
    // The MC feedback message and its choices belong together in one bubble.
    items.push({ kind: 'mc', text: word.frozen_messages?.[0], choices: word.choices || [] })
  }

  if (word.hints?.length && !isPreviewMode) {
    word.hints.forEach(hint => {
      items.push({
        kind: 'hint',
        text: hint.easy,
        info: {
          ref: hint.ref,
          explanation: hint.explanation,
          example: hint.example,
          easy: hint.easy,
          meta: hint.meta,
          keyword: hint.keyword,
        },
      })
    })
  }

  const usedAnswer = answer || tiedAnswer
  // Only show "You answered: …" when the user actually gave an answer.
  // When a word isn't answered, `users_answer` falls back to the correct surface
  // (see PreviousSnippets/Word/index.js), so `users_answer === correct` means
  // "not answered" (or answered correctly) — skip it in that case.
  const givenAnswer = usedAnswer?.users_answer?.trim()
  if (
    givenAnswer &&
    givenAnswer !== usedAnswer.correct &&
    !/^_+$/.test(givenAnswer) // skip blank placeholders like "___" (not answered)
  ) {
    items.push({ kind: 'your-answer', text: usedAnswer.users_answer })
  }

  if (isPreviewMode && word.concepts?.length === 0 && hiddenFeatures) {
    items.push({ kind: 'no-topics' })
  }

  if (isPreviewMode && word.concepts?.length > 0) {
    items.push({ kind: 'topics-header' })
    word.concepts.forEach(concept => {
      items.push({ kind: 'concept', text: concept.concept })
    })
  }

  return items
}

const initialState = {
  items: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        ...state,
        items: action.items,
      }
    case 'CLEAR_NOTES':
      return initialState
    default:
      return state
  }
}
