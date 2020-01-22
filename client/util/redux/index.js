import { combineReducers } from 'redux'

import stories from './storiesReducer'
import snippets from './snippetsReducer'
import translation from './translationReducer'
import locale from './localeReducer'
import user from './userReducer'
import compete from './competitionReducer'
import sidebar from './sidebarReducer'
import email from './emailReducer'
import register from './registerReducer'
import notification from './notificationReducer'


const rootReducer = combineReducers({
  stories,
  snippets,
  translation,
  user,
  locale,
  compete,
  sidebar,
  email,
  register,
  notification,
})

export default (state, action) => (
  action.type === 'LOGOUT_SUCCESS'
    ? rootReducer(undefined, action)
    : rootReducer(state, action)
)
