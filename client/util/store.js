import { createStore, applyMiddleware, compose } from 'redux'
import { thunk } from 'redux-thunk'
import * as Sentry from '@sentry/react'

import { handleRequest } from 'Utilities/apiConnection'
import { writeStoryCache } from 'Utilities/storyCache'
import combinedReducers from 'Utilities/redux'
import userMiddleware from 'Utilities/redux/userMiddleware'

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const getInitialUserFromLocalStorage = () => {
  const user = localStorage.getItem('user')
  if (!user) return undefined

  return { data: JSON.parse(user) }
}

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  stateTransformer: state => {
    return {
      user: state.user,
      practice: state.practice,
      focusedSnippet: state.snippets.focused,
      translation: state.translation,
      flashcards: state.flashcards,
      flashcardList: state.flashcardList,
      crossword: state.crossword,
      tests: state.tests,
      metadata: state.metadata,
      groups: state.groups,
      practiceHistory: state.practiceHistory,
      streak: state.streak,
      xp: state.xp,
      level: state.level
    }
  },
})

const store = createStore(
  combinedReducers,
  { user: getInitialUserFromLocalStorage() },
  composeEnhancers(applyMiddleware(thunk, handleRequest, userMiddleware), sentryReduxEnhancer)
)

store.subscribe(() => {
  const { user } = store.getState()
  if (!user) return undefined
  if (!user.data) return localStorage.clear()

  return localStorage.setItem('user', JSON.stringify(user.data))
})

// Mirrors the story list into its cache on every change (fetches, progress updates, deletes, moves),
// so the cache always matches what the app shows. Lists of unknown language are not cached.
let cachedStoryList = null
store.subscribe(() => {
  const { user, stories } = store.getState()
  if (stories.data === cachedStoryList) return
  cachedStoryList = stories.data
  writeStoryCache(user?.data?.user?.oid, stories.dataLanguage, stories.data)
})

// Cypress reads app state (e.g. the current tour step) from here; never set outside test runs.
if (typeof window !== 'undefined' && window.Cypress) window.store = store

export default store
