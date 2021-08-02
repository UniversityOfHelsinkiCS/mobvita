import callBuilder from '../apiConnection'

const sortById = annotations => {
  return annotations.sort((a, b) => (a.ID > b.ID ? 1 : -1))
}

export const annotateWord = (storyId, payload) => {
  const route = `/stories/${storyId}/annotate`
  const prefix = 'ANNOTATE_WORD'
  return callBuilder(route, prefix, 'post', payload)
}

export const setFocusedWord = word => {
  return {
    type: 'SET_NOTE_WORD',
    word,
  }
}

export const setHighlightedWord = word => {
  return {
    type: 'SET_HIGHLIGHT_WORD',
    word,
  }
}

export const initializeAnnotations = annotations => {
  return {
    type: 'INIT_ANNOTATIONS',
    annotations,
  }
}

export const saveAnnotation = annotations => {
  return {
    type: 'SAVE_ANNOTATION',
    annotations,
  }
}

export const setNoteVisibility = visibility => {
  return {
    type: 'SET_NOTE_VISIBILITY',
    visibility,
  }
}

export const setFormVisibility = visibility => {
  return {
    type: 'SET_FORM_VISIBILITY',
    visibility,
  }
}

const initialState = {
  focusedWord: null,
  highlightedWord: null,
  annotations: [],
  refreshed: false,
  pending: false,
  showNotes: false,
  showNoteForm: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ANNOTATE_WORD_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'ANNOTATE_WORD_SUCCESS':
      return {
        ...state,
        news: action.response.news,
        pending: false,
        // refreshed: true,
      }
    case 'ANNOTATE_WORD_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'SET_NOTE_WORD':
      return {
        ...state,
        focusedWord: action.word,
      }
    case 'SET_HIGHLIGHT_WORD':
      return {
        ...state,
        highlightedWord: action.word,
      }
    case 'SET_NOTE_VISIBILITY':
      return {
        ...state,
        showNotes: action.visibility,
      }
    case 'SET_FORM_VISIBILITY':
      return {
        ...state,
        showNoteForm: action.visibility,
      }
    case 'INIT_ANNOTATIONS':
      return {
        ...state,
        annotations: action.annotations,
        refreshed: false,
      }
    case 'SAVE_ANNOTATION':
      return {
        ...state,
        annotations: sortById(action.annotations),
        refreshed: true,
      }
    default:
      return state
  }
}
