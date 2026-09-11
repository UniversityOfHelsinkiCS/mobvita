// The in-progress essay, kept in localStorage so it survives a reload or a trip to another view.
// Until the first upload the essay has no backend record, so this is the only place its title can
// live; once it does have one, `essayId` is what keeps a later save going back into that essay
// instead of creating a duplicate under the same (now taken) title.
const ESSAY_WRITING_TEXT_STORAGE_KEY = 'essay-writing-text'
const ESSAY_WRITING_TITLE_STORAGE_KEY = 'essay-writing-title'
const ESSAY_WRITING_ESSAY_ID_STORAGE_KEY = 'essay-writing-essay-id'

const read = key => {
  try {
    return window.localStorage.getItem(key) || ''
  } catch {
    return ''
  }
}

const write = (key, value) => {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Ignore storage errors so writing correction still works normally.
  }
}

const remove = key => {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore storage errors.
  }
}

export const getStoredEssayText = () => read(ESSAY_WRITING_TEXT_STORAGE_KEY)

export const saveEssayText = text => write(ESSAY_WRITING_TEXT_STORAGE_KEY, text)

export const getStoredEssayTitle = () => read(ESSAY_WRITING_TITLE_STORAGE_KEY)

export const saveEssayTitle = title => write(ESSAY_WRITING_TITLE_STORAGE_KEY, title)

// '' for a draft that has never been uploaded, so callers can treat it as "no essay yet".
export const getStoredEssayId = () => read(ESSAY_WRITING_ESSAY_ID_STORAGE_KEY)

export const saveEssayId = essayId =>
  essayId
    ? write(ESSAY_WRITING_ESSAY_ID_STORAGE_KEY, essayId)
    : remove(ESSAY_WRITING_ESSAY_ID_STORAGE_KEY)

// Text, title and essay id are one draft — clear them together, or a new essay inherits the old
// one's title and writes itself into the old one's record.
export const clearEssayDraft = () => {
  remove(ESSAY_WRITING_TEXT_STORAGE_KEY)
  remove(ESSAY_WRITING_TITLE_STORAGE_KEY)
  remove(ESSAY_WRITING_ESSAY_ID_STORAGE_KEY)
}
