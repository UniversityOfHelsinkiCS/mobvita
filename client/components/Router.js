import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { hiddenFeatures } from 'Utilities/common'
import ReadView from 'Components/ReadView'
import PracticeView from 'Components/PracticeView'
import MenuTabs from 'Components/MenuTabs'
import LanguageSelectView from 'Components/LanguageSelectView'
import EmailConfirm from 'Components/AccessControl/EmailConfirm'
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
import Achievements from './Profile/Achievements'
import Leaderboard from './Leaderboard'

export default () => {
  const user = useSelector(state => state.user.data)

  return (
    <div style={{ width: '100%' }}>
      <Switch>
        <Route exact path="/">
          {user ? <Redirect to="/home" /> : <LandingPage />}
        </Route>
        <Route>
          <div className="application-content">
            <Switch>
              <Route exact path="/email-confirm/:token" component={EmailConfirm} />
              <Route exact path="/reset-password/:token" component={ResetPassword} />
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
              <ProtectedRoute exact path="/stories/:id" component={StoryDetails} />
              <ProtectedRoute exact path="/stories/:id/practice/" component={PracticeView} />
              <ProtectedRoute exact path="/stories/:id/read/" component={ReadView} />
              <ProtectedRoute exact path="/crossword/:storyId" component={CrosswordView} />
              <ProtectedRoute exact path="/groups" component={GroupView} />
              <ProtectedRoute exact path="/groups/:tab" component={GroupView} />
              <ProtectedRoute exact path="/:target/:id/concepts" component={Concepts} />
              <ProtectedRoute exact path="/concepts" component={Concepts} />
              <ProtectedRoute exact path="/profile/account" component={Profile} />
              <ProtectedRoute exact path="/profile/progress" component={Profile} />
              <ProtectedRoute exact path="/profile/settings" component={Profile} />
              <ProtectedRoute exact path="/tests" component={MenuTabs} />
              {hiddenFeatures && <ProtectedRoute exact path="/achievements" component={Achievements} />}
              <ProtectedRoute exact path="/leaderboard" component={Leaderboard} />
            </Switch>
          </div>
        </Route>
      </Switch>
    </div>
  )
}
