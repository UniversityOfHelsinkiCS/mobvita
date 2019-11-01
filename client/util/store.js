import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import { handleRequest } from 'Utilities/apiConnection'
import combinedReducers from 'Utilities/redux'

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  combinedReducers,
  composeEnhancers(applyMiddleware(thunk, handleRequest)),
)

export default store
