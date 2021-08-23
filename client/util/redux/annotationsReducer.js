import callBuilder from '../apiConnection'

const sortById = annotations => {
  return annotations.sort((a, b) => (a.ID > b.ID ? 1 : -1))
}

export const saveAnnotation = (storyId, op, tokenId, annotation) => {
  const route = `/stories/${storyId}/annotate`
  const prefix = 'SAVE_ANNOTATION'
  return callBuilder(route, prefix, 'post', { op, token_id: tokenId, annotation })
}

export const removeAnnotation = (storyId, op, tokenId) => {
  const route = `/stories/${storyId}/annotate`
  const prefix = 'REMOVE_ANNOTATION'
  return callBuilder(route, prefix, 'post', { op, token_id: tokenId })
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

export const resetAnnotations = () => {
  return {
    type: 'RESET_ANNOTATIONS',
  }
}

export const initializeAnnotations = annotations => {
  return {
    type: 'INIT_ANNOTATIONS',
    annotations,
  }
}

export const updateAnnotationStore = annotations => {
  return {
    type: 'UPDATE_ANNOTATION',
    annotations,
  }
}

export const updateSeveralAnnotationStore = annotations => {
  return {
    type: 'UPDATE_SEVERAL_ANNOTATIONS',
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

export const setAnnotationvisibilityMobile = visibility => {
  return {
    type: 'SET_ANNOTATION_VISIBILITY_MOBILE',
    visibility,
  }
}

const initialState = {
  focusedWord: null,
  highlightedWord: null,
  annotations: [],
  pending: false,
  showAnnotations: true,
  showAnnotationForm: false,
  mobileDisplayAnnotations: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_ANNOTATION_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'SAVE_ANNOTATION_SUCCESS':
      return {
        ...state,
        pending: false,
      }
    case 'SAVE_ANNOTATION_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'REMOVE_ANNOTATION_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'REMOVE_ANNOTATION_SUCCESS':
      return {
        ...state,
        pending: false,
      }
    case 'REMOVE_ANNOTATION_FAILURE':
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
    case 'SET_ANNOTATION_VISIBILITY_MOBILE':
      return {
        ...state,
        mobileDisplayAnnotations: action.visibility,
      }
    case 'RESET_ANNOTATIONS':
      return initialState
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
    case 'UPDATE_SEVERAL_ANNOTATIONS':
      return {
        ...state,
        annotations: state.annotations.concat(action.annotations),
      }
    case 'GET_TRANSLATION_ATTEMPT': // always switch to translation view when fetching them
      return {
        ...state,
        mobileDisplayAnnotations: false,
      }

    default:
      return state
  }
}
