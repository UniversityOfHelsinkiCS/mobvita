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

  if (word.mc_correct && !isPreviewMode) {
    items.push({ kind: 'mc', text: word.frozen_messages?.[0] })
    ;(word.choices || []).forEach(choice => {
      items.push({ kind: 'choice', text: choice })
    })
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
  if (usedAnswer) {
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
