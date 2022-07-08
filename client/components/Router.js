import React from 'react'
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getBackgroundColor } from 'Utilities/common'
import HomeView from 'Components/HomeView'
import LibraryView from 'Components/LibraryView'
import ExhaustiveTestView from 'Components/Tests/ExhaustiveTest/index'
import AdaptiveTestView from 'Components/Tests/AdaptiveTest/index'
import ReadViews from 'Components/ReadViews'
import ControlledStoryEditView from 'Components/ControlledStoryEditView'
import ConstructTestView from 'Components/ConstructTestView'
import VocabularyView from 'Components/VocabularyView'
import PracticeView from 'Components/PracticeView'
import LanguageSelectView from 'Components/LanguageSelectView'
import EmailConfirm from 'Components/AccessControl/EmailConfirm'
import AcceptSharedStory from 'Components/AccessControl/AcceptStory'
import BlockStorySender from 'Components/AccessControl/BlockStorySender'
import AcceptStoryFollowUser from 'Components/AccessControl/AcceptStoryFollowUser'
import UnfollowStorySender from 'Components/AccessControl/UnfollowStorySender'
import InvitationConfirm from 'Components/GroupView/InvitationConfirm'
import ProtectedRoute from 'Components/AccessControl/ProtectedRoute'
import CrosswordView from 'Components/CrosswordView'
import CompeteView from 'Components/CompeteView'
import GroupView from 'Components/GroupView'
import GroupAnalytics from './GroupView/GroupAnalytics'
import GroupPeople from './GroupView/GroupPeople'
import Concepts from './Concepts'
import Profile from './Profile/Profile'
import ResetPassword from './AccessControl/ResetPassword'
import Help from './StaticContent/Help'
import Flashcards from './Flashcards'
import LandingPage from './LandingPage'
import Achievements from './Achievements'
import Leaderboard from './LeaderboardView'
import NavBar from './NavBar'
import RegisterView from './RegisterView'
import DebugTestView from './DebugTestView'

export default () => {
  const user = useSelector(state => state.user.data)
  const location = useLocation()

  return (
    <Switch>
      <Route exact path="/">
        {user ? <Redirect to="/welcome" /> : <LandingPage />}
      </Route>
      <Route>
        <NavBar />
        <main className={`application-content ${getBackgroundColor()}`}>
          <Switch>
            <Route exact path="/email-confirm/:token" component={EmailConfirm} />
            <Route exact path="/reset-password/:token" component={ResetPassword} />
            <Route exact path="/group-confirmation/:token" component={InvitationConfirm} />
            <Route exact path="/register" component={RegisterView} />
            <Route exact path="/help" component={Help} />
            <Route
              exact
              path="/accept_story"
              render={() => <AcceptSharedStory queryParams={location.search} />}
            />

            <Route
              exact
              path="/block_user"
              render={() => <BlockStorySender queryParams={location.search} />}
            />

            <Route
              exact
              path="/remove_friend_email"
              render={() => <UnfollowStorySender queryParams={location.search} />}
            />

            <Route
              exact
              path="/accept_and_add"
              render={() => <AcceptStoryFollowUser queryParams={location.search} />}
            />

            <ProtectedRoute
              languageRequired={false}
              exact
              path="/learningLanguage"
              component={LanguageSelectView}
            />

            <ProtectedRoute exact path="/login" component={HomeView} />
            <ProtectedRoute exact path="/home" component={HomeView} />
            <ProtectedRoute exact path="/welcome" component={HomeView} />
            <ProtectedRoute exact path="/library" component={LibraryView} />
            <ProtectedRoute exact path="/flashcards" component={Flashcards} />
            <ProtectedRoute exact path="/flashcards/:mode" component={Flashcards} />
            <ProtectedRoute exact path="/flashcards/:mode/:storyId" component={Flashcards} />
            <ProtectedRoute exact path="/flashcards/:mode/:storyId-retry" component={Flashcards} />
            <ProtectedRoute exact path="/stories/:id/practice/" component={PracticeView} />
            <ProtectedRoute
              exact
              path="/stories/:id/controlled-practice/"
              component={PracticeView}
            />
            <ProtectedRoute exact path="/stories/:id/review/" component={ReadViews} />
            <ProtectedRoute exact path="/stories/:id/preview/" component={ReadViews} />
            <ProtectedRoute exact path="/stories/:id/group-review" component={ReadViews} />
            <ProtectedRoute exact path="/stories/:id/group-preview" component={ReadViews} />

            {/* <ProtectedRoute
              exact
              path="/stories/:id/preview-controlled-story/"
              component={ControlledStoryPreviewView}
            /> */}
            <ProtectedRoute exact path="/stories/:id/compete/" component={CompeteView} />
            <ProtectedRoute
              exact
              path="/stories/:id/controlled-story-editor/"
              component={ControlledStoryEditView}
            />
            <ProtectedRoute exact path="/crossword/:storyId" component={CrosswordView} />

            <ProtectedRoute exact path="/groups/:role" component={GroupView} />
            <ProtectedRoute exact path="/groups/teacher/analytics" component={GroupAnalytics} />
            <ProtectedRoute exact path="/groups/:role/people" component={GroupPeople} />
            <ProtectedRoute exact path="/:target/:role/:id/concepts" component={Concepts} />
            <ProtectedRoute
              exact
              path="/:target/:role/:id/concepts/settings"
              component={Concepts}
            />
            <ProtectedRoute exact path="/concepts" component={Concepts} />
            <ProtectedRoute exact path="/profile/account" component={Profile} />
            <ProtectedRoute exact path="/profile/progress" component={Profile} />
            <ProtectedRoute exact path="/profile/settings" component={Profile} />
            <ProtectedRoute exact path="/profile/following" component={Profile} />
            <ProtectedRoute exact path="/tests" component={ExhaustiveTestView} />
            <ProtectedRoute exact path="/adaptive-test" component={AdaptiveTestView} />
            <ProtectedRoute exact path="/achievements" component={Achievements} />
            <ProtectedRoute exact path="/leaderboard" component={Leaderboard} />
            <ProtectedRoute exact path="/test-construction" component={ConstructTestView} />
            <ProtectedRoute exact path="/test-debug" component={DebugTestView} />
            <ProtectedRoute exact path="/vocabulary-view" component={VocabularyView} />
          </Switch>
        </main>
      </Route>
    </Switch>
  )
}
