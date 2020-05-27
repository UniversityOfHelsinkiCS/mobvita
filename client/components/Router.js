import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import SingleStoryView from 'Components/SingleStoryView'
import PracticeView from 'Components/PracticeView'
import MenuTabs from 'Components/StoryListView/MenuTabs'
import LanguageSelectView from 'Components/LanguageSelectView'
import CompeteView from 'Components/CompeteView'
import EmailConfirm from 'Components/AccessControl/EmailConfirm'
import ProtectedRoute from 'Components/AccessControl/ProtectedRoute'
import Register from 'Components/AccessControl/Register'
import Login from './AccessControl/Login'
import GroupView from './Groups/index'
import Concepts from './Concepts'
import Profile from './Profile/Profile'
import ResetPassword from './AccessControl/ResetPassword'
import Help from './StaticContent/Help'
import Flashcards from './Flashcards'
import TestView from './TestView/index'

export default () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/home" />
    </Route>
    <Route exact path="/email-confirm/:token" component={EmailConfirm} />
    <Route exact path="/reset-password/:token" component={ResetPassword} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/help" component={Help} />
    <ProtectedRoute
      languageRequired={false}
      exact
      path="/learningLanguage"
      component={LanguageSelectView}
    />
    <ProtectedRoute exact path="/home" component={MenuTabs} />
    <ProtectedRoute exact path="/library" component={MenuTabs} />
    <ProtectedRoute exact path="/flashcards" component={Flashcards} />
    <ProtectedRoute exact path="/flashcards/:mode" component={Flashcards} />
    <ProtectedRoute exact path="/flashcards/:mode/:storyId" component={Flashcards} />
    <ProtectedRoute exact path="/stories/:id" component={SingleStoryView} />
    <ProtectedRoute exact path="/stories/:id/practice/" component={PracticeView} />
    <ProtectedRoute exact path="/stories/:id/compete/" component={CompeteView} />
    <ProtectedRoute exact path="/groups" component={GroupView} />
    <ProtectedRoute exact path="/:target/:id/concepts" component={Concepts} />
    <ProtectedRoute exact path="/concepts" component={Concepts} />
    <ProtectedRoute exact path="/profile/account" component={Profile} />
    <ProtectedRoute exact path="/profile/progress" component={Profile} />
    <ProtectedRoute exact path="/profile/settings" component={Profile} />
    <ProtectedRoute exact path="/test" component={TestView} />
  </Switch>
)
