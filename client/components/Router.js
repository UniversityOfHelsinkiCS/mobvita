import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HomeView from 'Components/HomeView'
import LibraryView from 'Components/LibraryView'
import TestIndex from 'Components/TestView/index'
import ReadView from 'Components/ReadView'
import PracticeView from 'Components/PracticeView'
import LanguageSelectView from 'Components/LanguageSelectView'
import EmailConfirm from 'Components/AccessControl/EmailConfirm'
import InvitationConfirm from 'Components/GroupView/InvitationConfirm'
import ProtectedRoute from 'Components/AccessControl/ProtectedRoute'
import CrosswordView from 'Components/CrosswordView'
import GroupView from './GroupView'
import Concepts from './Concepts'
import Profile from './Profile/Profile'
import ResetPassword from './AccessControl/ResetPassword'
import Register from './AccessControl/Register'
import Help from './StaticContent/Help'
import Flashcards from './Flashcards'
import LandingPage from './LandingPage'
import StoryDetails from './StoryView/StoryDetails'
import Achievements from './Achievements'
import Leaderboard from './LeaderboardView'
import NavBar from './NavBar'

export default () => {
  const user = useSelector(state => state.user.data)

  return (
    <Switch>
      <Route exact path="/">
        {user ? <Redirect to="/home" /> : <LandingPage />}
      </Route>
      <Route>
        <NavBar />
        <main className="application-content">
          <Switch>
            <Route exact path="/email-confirm/:token" component={EmailConfirm} />
            <Route exact path="/reset-password/:token" component={ResetPassword} />
            <Route exact path="/group-confirmation/:token" component={InvitationConfirm} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/help" component={Help} />
            <ProtectedRoute
              languageRequired={false}
              exact
              path="/learningLanguage"
              component={LanguageSelectView}
            />
            <ProtectedRoute exact path="/home" component={HomeView} />
            <ProtectedRoute exact path="/library" component={LibraryView} />
            <ProtectedRoute exact path="/flashcards" component={Flashcards} />
            <ProtectedRoute exact path="/flashcards/:mode" component={Flashcards} />
            <ProtectedRoute exact path="/flashcards/:mode/:storyId" component={Flashcards} />
            <ProtectedRoute exact path="/stories/:id" component={StoryDetails} />
            <ProtectedRoute exact path="/stories/:id/practice/" component={PracticeView} />
            <ProtectedRoute exact path="/stories/:id/read/" component={ReadView} />
            <ProtectedRoute exact path="/crossword/:storyId" component={CrosswordView} />
            <ProtectedRoute exact path="/groups" component={GroupView} />
            <ProtectedRoute exact path="/groups/:role" component={GroupView} />
            <ProtectedRoute exact path="/groups/:role/:tab" component={GroupView} />
            <ProtectedRoute exact path="/:target/:role/:id/concepts" component={Concepts} />
            <ProtectedRoute exact path="/concepts" component={Concepts} />
            <ProtectedRoute exact path="/profile/account" component={Profile} />
            <ProtectedRoute exact path="/profile/progress" component={Profile} />
            <ProtectedRoute exact path="/profile/settings" component={Profile} />
            <ProtectedRoute exact path="/tests" component={TestIndex} />
            <ProtectedRoute exact path="/achievements" component={Achievements} />
            <ProtectedRoute exact path="/leaderboard" component={Leaderboard} />
          </Switch>
        </main>
      </Route>
    </Switch>
  )
}
