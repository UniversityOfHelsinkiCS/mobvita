const ESSAY_WRITING_TEXT_STORAGE_KEY = 'essay-writing-text'
const ESSAY_CHATBOT_SESSION_STORAGE_KEY = 'essay-chatbot-session-id'

const createEssayChatbotSessionId = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `essay-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

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

export const getEssayChatbotSessionId = () => {
  try {
    const storedSessionId = window.localStorage.getItem(ESSAY_CHATBOT_SESSION_STORAGE_KEY)

    if (storedSessionId) return storedSessionId

    const sessionId = createEssayChatbotSessionId()
    window.localStorage.setItem(ESSAY_CHATBOT_SESSION_STORAGE_KEY, sessionId)
    return sessionId
  } catch {
    return createEssayChatbotSessionId()
  }
}
