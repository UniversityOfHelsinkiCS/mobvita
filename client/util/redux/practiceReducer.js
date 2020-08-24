export const setAnswers = newAnswers => ({ type: 'SET_ANSWERS', newAnswers })
export const setPreviousAnswers = snippetId => ({ type: 'SET_PREVIOUS_ANSWERS', snippetId })
export const setFocusedWord = focusedWord => ({ type: 'SET_FOCUSED_WORD', focusedWord })
export const setTouchedIds = id => ({ type: 'SET_TOUCHED_IDS', id })
export const setAttempts = attempts => ({ type: 'SET_ATTEMPTS', attempts })
export const addToOptions = options => ({ type: 'SET_OPTIONS', options })
export const addToAudio = id => ({ type: 'SET_AUDIO', id })
export const clearPractice = () => ({ type: 'CLEAR_PRACTICE' })
export const clearCurrentPractice = () => ({ type: 'CLEAR_CURRENT_PRACTICE' })
export const clearCurrentAnswers = () => ({ type: 'CLEAR_CURRENT_ANSWERS' })
export const clearTouchedIds = () => ({ type: 'CLEAR_TOUCHED_IDS' })
export const finishSnippet = () => ({ type: 'FINISH_SNIPPET' })
export const setReferences = references => ({ type: 'SET_REFERENCES', references })
export const clearReferences = () => ({ type: 'CLEAR_REFERENCES' })

const initialState = {
  previousAnswers: {},
  snippetsInPrevious: [],
  currentAnswers: {},
  focusedWord: {},
  touchedIds: [],
  attempt: 0,
  options: {},
  audio: [],
  snippetFinished: false,
  references: null,
  refModalOpen: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ANSWERS':
      return {
        ...state,
        currentAnswers: { ...state.currentAnswers, ...action.newAnswers },
      }
    case 'SET_PREVIOUS_ANSWERS':
      return {
        ...state,
        previousAnswers: { ...state.previousAnswers, ...state.currentAnswers },
        snippetsInPrevious: state.snippetsInPrevious.concat(action.snippetId),
      }
    case 'SET_FOCUSED_WORD':
      return {
        ...state,
        focusedWord: action.focusedWord,
      }
    case 'SET_TOUCHED_IDS':
      return {
        ...state,
        touchedIds: state.touchedIds.includes(action.id)
          ? state.touchedIds
          : state.touchedIds.concat(action.id),
      }
    case 'SET_ATTEMPTS':
      return {
        ...state,
        attempt: action.attempts,
      }
    case 'SET_OPTIONS':
      return {
        ...state,
        options: { ...state.options, ...action.options },
      }
    case 'SET_AUDIO':
      return {
        ...state,
        audio: state.audio.concat(action.id.toString()),
      }
    case 'CLEAR_PRACTICE':
      return initialState
    case 'CLEAR_CURRENT_PRACTICE':
      return {
        ...state,
        currentAnswers: initialState.currentAnswers,
        focusedWord: initialState.focusedWord,
        touchedIds: initialState.touchedIds,
        attempt: initialState.attempt,
        options: initialState.options,
        audio: initialState.audio,
        snippetFinished: initialState.snippetFinished,
      }
    case 'CLEAR_CURRENT_ANSWERS':
      return {
        ...state,
        currentAnswers: {},
      }
    case 'CLEAR_TOUCHED_IDS':
      return {
        ...state,
        touchedIds: initialState.touchedIds,
      }
    case 'FINISH_SNIPPET':
      return {
        ...state,
        snippetFinished: true,
      }
    case 'SET_REFERENCES':
      return {
        ...state,
        references: action.references,
      }
    case 'CLEAR_REFERENCES':
      return {
        ...state,
        references: initialState.references,
      }
    default:
      return state
  }
}
