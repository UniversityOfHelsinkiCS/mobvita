import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import { handleRequest } from 'Utilities/apiConnection'
import combinedReducers from 'Utilities/redux'
import userMiddleware from 'Utilities/redux/userMiddleware'

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const getInitialUserFromLocalStorage = () => {
  const user = localStorage.getItem('user')
  if (!user) return undefined

  return { data: JSON.parse(user) }
}

const store = createStore(
  combinedReducers,
  { user: getInitialUserFromLocalStorage() },
  composeEnhancers(applyMiddleware(thunk, handleRequest, userMiddleware)),
)

store.subscribe(() => {
  const { user } = store.getState()
  if (!user) return undefined
  if (!user.data) return localStorage.clear()

  return localStorage.setItem('user', JSON.stringify(user.data))
})

export default store
