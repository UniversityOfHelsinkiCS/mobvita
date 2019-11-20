import { combineReducers } from 'redux'

import stories from './storiesReducer'
import snippets from './snippetsReducer'
import translation from './translationReducer'
import user from './userReducer'

export default combineReducers({
  stories,
  snippets,
  translation,
  user,
})
