import callBuilder from '../apiConnection'

export const setFocusedSpan = span => {
  return {
    type: 'SET_FOCUSED_SPAN',
    span,
  }
}

export const setHighlightRange = (start, end) => {
  return {
    type: 'SET_HIGHLIGHT_RANGE',
    highlightRange: { start, end },
  }
}

export const resetAnnotations = () => {
  return {
    type: 'RESET_ANNOTATIONS',
  }
}

export const setAnnotations = words => {
  const annotationsToSet = []
  let currentSpan = { annotationString: '' }

  words.forEach(word => {
    if (word.annotation) {
      currentSpan.startId = word.ID
      currentSpan.endId = word.annotation[0].end_token_id
      currentSpan.annotationString += word.surface
      const annotationTexts = word.annotation.map(e => {
        return {
          text: e.annotation,
          username: e.username,
          uid: e.uid,
          thread_id: e.thread_id,
          name: e.name,
        }
      })

      currentSpan.annotationTexts = annotationTexts

      if (word.ID === currentSpan.endId) {
        annotationsToSet.push(currentSpan)
        currentSpan = { annotationString: '' }
      }
    } else if (word.ID > currentSpan.startId && word.ID < currentSpan.endId) {
      currentSpan.annotationString += word.surface
    } else if (word.ID === currentSpan.endId) {
      currentSpan.annotationString += word.surface
      annotationsToSet.push(currentSpan)
      currentSpan = { annotationString: '' }
    }
  })

  return {
    type: 'SET_ANNOTATIONS',
    annotations: annotationsToSet,
  }
}

export const updateSeveralSpanAnnotationStore = spanAnnotations => {
  return {
    type: 'UPDATE_SEVERAL_SPAN_ANNOTATIONS',
    spanAnnotations,
  }
}

export const setAnnotationsVisibility = visibility => {
  return {
    type: 'SET_ANNOTATIONS_VISIBILITY',
    visibility,
  }
}

export const resetAnnotationCandidates = () => {
  return {
    type: 'RESET_ANNOTATION_CANDIDATES',
  }
}

export const addAnnotationCandidates = candidates => {
  return {
    type: 'ADD_ANNOTATION_CANDIDATES',
    candidates,
  }
}

export const removeAnnotationCandidates = () => {
  return {
    type: 'REMOVE_ANNOTATION_CANDIDATES',
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

export const getAllAnnotations = () => {
  const route = '/annotation/'
  const prefix = 'GET_ALL_ANNOTATIONS'
  return callBuilder(route, prefix, 'get')
}

const initialState = {
  spanAnnotations: [],
  highlightRange: null,
  focusedSpan: null,
  annotationCandidates: [],
  pending: false,
  showAnnotations: false,
  showAnnotationForm: false,
  mobileDisplayAnnotations: false,
  allAnnotations: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_ANNOTATIONS_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'GET_ALL_ANNOTATIONS_FAILURE':
      return {
        ...state,
        pending: false,
      }
    case 'GET_ALL_ANNOTATIONS_SUCCESS':
      return {
        ...state,
        pending: false,
        allAnnotations: action.response.annotations,
      }
    case 'SET_FOCUSED_SPAN':
      return {
        ...state,
        focusedSpan: action.span,
      }
    case 'SET_ANNOTATIONS':
      return {
        ...state,
        spanAnnotations: action.annotations,
      }
    case 'RESET_ANNOTATIONS':
      return initialState

    case 'SET_HIGHLIGHT_RANGE':
      return {
        ...state,
        highlightRange: { start: action.highlightRange.start, end: action.highlightRange.end },
      }
    case 'ADD_ANNOTATION_CANDIDATES':
      return {
        ...state,
        annotationCandidates: state.annotationCandidates.concat(action.candidates),
      }
    case 'REMOVE_ANNOTATION_CANDIDATES':
      return {
        ...state,
        annotationCandidates: state.annotationCandidates.slice(
          0,
          state.annotationCandidates.length - 2
        ),
      }
    case 'RESET_ANNOTATION_CANDIDATES':
      return {
        ...state,
        annotationCandidates: [],
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

    case 'UPDATE_SEVERAL_SPAN_ANNOTATIONS':
      return {
        ...state,
        spanAnnotations: state.spanAnnotations.concat(action.spanAnnotations),
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
