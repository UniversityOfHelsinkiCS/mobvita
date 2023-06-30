export const setAnswers = newAnswers => ({ type: 'SET_ANSWERS', newAnswers })
export const setPreviousAnswers = snippetId => ({ type: 'SET_PREVIOUS_ANSWERS', snippetId })
export const setFocusedWord = focusedWord => ({ type: 'SET_FOCUSED_WORD', focusedWord })
export const setTouchedIds = id => ({ type: 'SET_TOUCHED_IDS', id })
export const incrementAttempts = () => ({ type: 'INCREMENT_ATTEMPTS' })
export const addToOptions = options => ({ type: 'SET_OPTIONS', options })
export const addToAudio = audio => ({ type: 'SET_AUDIO', audio })
export const addToVoice = voice => ({ type: 'SET_VOICE', voice })
export const clearPractice = () => ({ type: 'CLEAR_PRACTICE' })
export const clearCurrentPractice = () => ({ type: 'CLEAR_CURRENT_PRACTICE' })
export const clearCurrentAnswers = () => ({ type: 'CLEAR_CURRENT_ANSWERS' })
export const clearTouchedIds = () => ({ type: 'CLEAR_TOUCHED_IDS' })
export const finishSnippet = () => ({ type: 'FINISH_SNIPPET' })
export const setReferences = references => ({ type: 'SET_REFERENCES', references })
export const clearReferences = () => ({ type: 'CLEAR_REFERENCES' })
export const setExplanation = explanation => ({ type: 'SET_EXPLANATION', explanation })
export const clearExplanation = () => ({ type: 'CLEAR_EXPLANATION' })
export const startSnippet = () => ({ type: 'SET_SNIPPET_STARTED' })
export const addToCorrectAnswerIDs = ids => ({ type: 'ADD_CORRECT_ANSWER_IDS', ids })
export const setWillPause = state => ({ type: 'SET_WILL_PAUSE', state })
export const setIsPaused = state => ({ type: 'SET_IS_PAUSED', state })
export const setPracticeFinished = state => ({ type: 'SET_PRACTICE_FINISHED', state })
export const handleVoiceSampleCooldown = () => ({ type: 'HANDLE_VOICE_SAMPLE_COOLDOWN' })
export const incrementHintRequests = (wordId, newReqAmount, newHintList, penalties) => ({
  type: 'INCREMENT_HINT_REQUESTS',
  wordId,
  newReqAmount,
  newHintList,
  penalties
})
export const mcExerciseTouched = word => ({ type: 'HANDLE_TOUCH_MC', word })

const initialState = {
  previousAnswers: {},
  snippetsInPrevious: [],
  currentAnswers: {},
  focusedWord: {},
  touchedIds: [],
  attempt: 0,
  options: {},
  audio: {},
  voice: {},
  snippetFinished: false,
  references: null,
  explanation: null,
  refModalOpen: false,
  isNewSnippet: true,
  correctAnswerIDs: [],
  willPause: false,
  isPaused: false,
  practiceFinished: false,
  voiceSampleOnCooldown: false,
  latestMCTouched: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'HANDLE_VOICE_SAMPLE_COOLDOWN':
      return {
        ...state,
        voiceSampleOnCooldown: !state.voiceSampleOnCooldown,
      }
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
    case 'HANDLE_TOUCH_MC':
      return {
        ...state,
        latestMCTouched: action.word,
      }
    case 'ADD_CORRECT_ANSWER_IDS':
      return {
        ...state,
        correctAnswerIDs: state.correctAnswerIDs.concat(action.ids),
      }
    case 'INCREMENT_HINT_REQUESTS':
      return {
        ...state,
        currentAnswers: {
          ...state.currentAnswers,
          [action.wordId]: {
            ...state.currentAnswers[action.wordId],
            hintsRequested: action.newReqAmount,
            requestedHintsList: action.newHintList,
            penalties: action.penalties,
          },
        },
      }
    case 'INCREMENT_ATTEMPTS':
      let update_current_answers = {}
      Object.entries(state.currentAnswers).forEach(entry => {
        let [key, answer] = entry;
        answer['hintsRequested'] = 0
        // answer['requestedHintsList'] = []
        answer['penalties'] = []
        update_current_answers[key] = answer
      });
      return {
        ...state,
        attempt: state.attempt + 1,
        currentAnswers: update_current_answers
      }
    case 'SET_OPTIONS':
      return {
        ...state,
        options: { ...state.options, ...action.options },
      }
    case 'SET_AUDIO':
      return {
        ...state,
        audio: { ...state.audio, ...action.audio },
      }
    case 'SET_VOICE':
      return {
        ...state,
        voice: { ...state.voice, ...action.voice },
      }
    case 'SET_SNIPPET_STARTED':
      return {
        ...state,
        isNewSnippet: false,
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
        voice: initialState.voice,
        snippetFinished: initialState.snippetFinished,
        isNewSnippet: initialState.isNewSnippet,
        hintRequestsNum: {},
        latestMCTouched: initialState.latestMCTouched,
      }
    case 'CLEAR_CURRENT_ANSWERS':
      return {
        ...state,
        currentAnswers: {},
        hintRequestsNum: {},
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
    case 'SET_WILL_PAUSE':
      return {
        ...state,
        willPause: action.state,
      }
    case 'SET_IS_PAUSED':
      return {
        ...state,
        isPaused: action.state,
      }
    case 'SET_PRACTICE_FINISHED':
      return {
        ...state,
        practiceFinished: action.state,
      }
    case 'CLEAR_REFERENCES':
      return {
        ...state,
        references: initialState.references,
      }
    case 'SET_EXPLANATION':
      return {
        ...state,
        explanation: action.explanation,
      }
    case 'CLEAR_EXPLANATION':
      return {
        ...state,
        explanation: initialState.explanation,
      }
    default:
      return state
  }
}
