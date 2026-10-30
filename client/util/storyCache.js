// Last-known story list per user and language, shown at once while the fresh list loads. store.js
// rewrites it whenever the list in Redux changes, and logout's localStorage.clear() removes it.
const keyFor = (userId, language) => `stories-cache:${userId}:${language}`

// The logged-in user's id from the stored session, or undefined when logged out.
export const currentUserId = () => {
  try {
    return JSON.parse(localStorage.getItem('user'))?.user?.oid
  } catch {
    return undefined
  }
}

// The cached list, or null when there is none or storage is unavailable.
export const readStoryCache = (userId, language) => {
  if (!userId || !language) return null
  try {
    const stories = JSON.parse(localStorage.getItem(keyFor(userId, language)))
    return Array.isArray(stories) ? stories : null
  } catch {
    return null
  }
}

// Saves the list; full or blocked storage just leaves the cache out.
export const writeStoryCache = (userId, language, stories) => {
  if (!userId || !language || !Array.isArray(stories)) return
  try {
    localStorage.setItem(keyFor(userId, language), JSON.stringify(stories))
  } catch {
    // The cache is only a speed-up; the app works the same without it.
  }
}
