const ESSAY_WRITING_TEXT_STORAGE_KEY = 'essay-writing-text'

export const getStoredEssayText = () => {
  try {
    return window.localStorage.getItem(ESSAY_WRITING_TEXT_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export const saveEssayText = text => {
  try {
    window.localStorage.setItem(ESSAY_WRITING_TEXT_STORAGE_KEY, text)
  } catch {
    // Ignore storage errors so writing correction still works normally.
  }
}
