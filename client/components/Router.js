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
import Flashcards from 'Components/Flashcards'
import Login from './AccessControl/Login'
import GroupView from './Groups/index'
import Concepts from './Concepts'

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
    <ProtectedRoute exact path="/flashcards" component={Flashcards} />
    <ProtectedRoute exact path="/flashcards/:storyId" component={Flashcards} />
    <ProtectedRoute exact path="/stories/:id" component={SingleStoryView} />
    <ProtectedRoute exact path="/stories/:id/practice/" component={PracticeView} />
    <ProtectedRoute exact path="/stories/:id/compete/" component={CompeteView} />
    <ProtectedRoute exact path="/groups" component={GroupView} />
    <ProtectedRoute exact path="/concepts" component={Concepts} />
  </Switch>
)
