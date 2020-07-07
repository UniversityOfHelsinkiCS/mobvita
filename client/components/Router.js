import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

import SingleStoryView from 'Components/SingleStoryView'
import PracticeView from 'Components/PracticeView'
import MenuTabs from 'Components/StoryListView/MenuTabs'
import LanguageSelectView from 'Components/LanguageSelectView'
import CompeteView from 'Components/CompeteView'
import EmailConfirm from 'Components/AccessControl/EmailConfirm'
import ProtectedRoute from 'Components/AccessControl/ProtectedRoute'
import Register from 'Components/AccessControl/Register'
import CrosswordView from 'Components/CrosswordView'
import GroupView from './Groups/index'
import Concepts from './Concepts'
import Profile from './Profile/Profile'
import ResetPassword from './AccessControl/ResetPassword'
import NewRegister from './AccessControl/NewRegister'
import Help from './StaticContent/Help'
import Flashcards from './Flashcards'
import LandingPage from './LandingPage'

export default () => {
  const user = useSelector(state => state.user.data)

  return (
    <Switch>
      <Route exact path="/">
        {user ? <Redirect to="/home" /> : <LandingPage />}
      </Route>
      <div className="application-content">
        <Route exact path="/email-confirm/:token" component={EmailConfirm} />
        <Route exact path="/reset-password/:token" component={ResetPassword} />
        <Route exact path="/register" component={NewRegister} />
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
        <ProtectedRoute exact path="/crossword/:storyId" component={CrosswordView} />
        <ProtectedRoute exact path="/groups" component={GroupView} />
        <ProtectedRoute exact path="/:target/:id/concepts" component={Concepts} />
        <ProtectedRoute exact path="/concepts" component={Concepts} />
        <ProtectedRoute exact path="/profile/account" component={Profile} />
        <ProtectedRoute exact path="/profile/progress" component={Profile} />
        <ProtectedRoute exact path="/profile/settings" component={Profile} />
        <ProtectedRoute exact path="/tests" component={MenuTabs} />
      </div>
    </Switch>
  )
}
