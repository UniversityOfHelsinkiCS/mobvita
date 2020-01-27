import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import SingleStoryView from 'Components/SingleStoryView'
import PracticeView from 'Components/PracticeView'
import MenuTabs from 'Components/StoryListView/MenuTabs'
import LanguageSelectView from 'Components/LanguageSelectView'
import CompeteView from 'Components/CompeteView'
import EmailConfirm from 'Components/AccessControl/EmailConfirm'
import Login from './AccessControl/Login'
import ProtectedRoute from './AccessControl/ProtectedRoute'
import Register from './AccessControl/Register'

export default () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/home" />
    </Route>
    <Route exact path="/email-confirm/:token" component={EmailConfirm} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <ProtectedRoute languageRequired={false} exact path="/learningLanguage" component={LanguageSelectView} />
    <ProtectedRoute exact path="/home" component={MenuTabs} />
    <ProtectedRoute exact path="/library" component={MenuTabs} />
    <ProtectedRoute exact path="/stories/:id" component={SingleStoryView} />
    <ProtectedRoute exact path="/stories/:id/practice/" component={PracticeView} />
    <ProtectedRoute exact path="/stories/:id/compete/" component={CompeteView} />
  </Switch>
)
