import { combineReducers } from 'redux'

import stories from './storiesReducer'
import snippets from './snippetsReducer'

export default combineReducers({
  stories,
  snippets,
})
