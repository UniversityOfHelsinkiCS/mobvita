import callBuilder from '../apiConnection'

// Unified "dialogues" store. Holds dialogue items of different `type`s, each tagged with a
// `scope` key that links it to a view/service/word/exercise. Items live for the life of the
// Redux store (survive navigation, cleared only on full refresh / logout). Components filter
// `dialogues.items` by their own scope instead of clearing via useEffect.
//
// Item shape (serializable — no React / no {__html}):
//   { id, type: 'chatbot-message' | 'translation' | 'sentence-translation' | 'hint' | 'note',
//     scope: string, role?: 'user' | 'bot', text?: string, removable?: boolean }
//
// Phase 1 only wires `type: 'chatbot-message'` for the general chatbot, scoped by URL pathname.

export const addDialogue = item => ({
  type: 'ADD_DIALOGUE',
  item,
})

export const removeDialogue = id => ({
  type: 'REMOVE_DIALOGUE',
  id,
})

// Omit `scope` to clear everything; pass a scope to clear just that thread.
export const clearDialogues = scope => ({
  type: 'CLEAR_DIALOGUES',
  scope,
})

// Posts a general chatbot message (same /general_chatbot endpoint) but routes the
// user/bot bubbles into this scope's thread in the dialogues store.
export const sendGeneralDialogue = (message, scope) => {
  const route = `/general_chatbot`
  const prefix = 'GET_DIALOGUE_RESPONSE'
  const payload = { message }
  return { ...callBuilder(route, prefix, 'post', payload), scope, message }
}

const initialState = {
  items: [],
  nextId: 1,
  pending: {}, // pending[scope] = bool — a chat response is in flight for that scope
  // The API middleware only echoes `requestId` (not our custom `scope`) onto _SUCCESS/_FAILURE,
  // so we stash scope by requestId on _ATTEMPT and look it back up when the call resolves.
  scopeByRequest: {},
}

const dropKey = (obj, key) => {
  const next = { ...obj }
  delete next[key]
  return next
}

export default (state = initialState, action) => {
  const { response } = action
  switch (action.type) {
    case 'ADD_DIALOGUE':
      return {
        ...state,
        items: [...state.items, { removable: true, ...action.item, id: state.nextId }],
        nextId: state.nextId + 1,
      }

    case 'REMOVE_DIALOGUE':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.id),
      }

    case 'CLEAR_DIALOGUES':
      return {
        ...state,
        items: action.scope ? state.items.filter(item => item.scope !== action.scope) : [],
      }

    case 'GET_DIALOGUE_RESPONSE_ATTEMPT':
      return {
        ...state,
        pending: { ...state.pending, [action.scope]: true },
        scopeByRequest: { ...state.scopeByRequest, [action.requestId]: action.scope },
        items: [
          ...state.items,
          {
            id: state.nextId,
            type: 'chatbot-message',
            role: 'user',
            text: action.message,
            scope: action.scope,
            removable: true,
          },
        ],
        nextId: state.nextId + 1,
      }

    case 'GET_DIALOGUE_RESPONSE_FAILURE': {
      const scope = state.scopeByRequest[action.requestId]
      return {
        ...state,
        pending: { ...state.pending, [scope]: false },
        scopeByRequest: dropKey(state.scopeByRequest, action.requestId),
      }
    }

    case 'GET_DIALOGUE_RESPONSE_SUCCESS': {
      const scope = state.scopeByRequest[action.requestId]
      return {
        ...state,
        pending: { ...state.pending, [scope]: false },
        scopeByRequest: dropKey(state.scopeByRequest, action.requestId),
        items: [
          ...state.items,
          {
            id: state.nextId,
            type: 'chatbot-message',
            role: 'bot',
            text: response.response,
            scope,
            removable: true,
          },
        ],
        nextId: state.nextId + 1,
      }
    }

    default:
      return state
  }
}
