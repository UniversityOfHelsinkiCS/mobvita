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
    type: 'SET_ANNOTATION_WORD',
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

export const updateAnnotation = annotations => {
  return {
    type: 'UPDATE_ANNOTATION',
    annotations,
  }
}

export const setAnnotationsVisibility = visibility => {
  return {
    type: 'SET_ANNOTATIONS_VISIBILITY',
    visibility,
  }
}

export const setAnnotationFormVisibility = visibility => {
  return {
    type: 'SET_ANNOTATION_FORM_VISIBILITY',
    visibility,
  }
}

const initialState = {
  focusedWord: null,
  highlightedWord: null,
  annotations: [],
  pending: false,
  showAnnotations: false,
  showAnnotationForm: false,
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
      }
    case 'ANNOTATE_WORD_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'SET_ANNOTATION_WORD':
      return {
        ...state,
        focusedWord: action.word,
      }
    case 'SET_HIGHLIGHT_WORD':
      return {
        ...state,
        highlightedWord: action.word,
      }
    case 'SET_ANNOTATIONS_VISIBILITY':
      return {
        ...state,
        showAnnotations: action.visibility,
      }
    case 'SET_ANNOTATION_FORM_VISIBILITY':
      return {
        ...state,
        showAnnotationForm: action.visibility,
      }
    case 'INIT_ANNOTATIONS':
      return {
        ...state,
        annotations: action.annotations,
      }
    case 'UPDATE_ANNOTATION':
      return {
        ...state,
        annotations: sortById(action.annotations),
      }
    default:
      return state
  }
}
