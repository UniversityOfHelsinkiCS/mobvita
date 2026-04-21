import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getBackgroundColor } from 'Utilities/common'
import HomeView from 'Components/HomeView'
import LibraryView from 'Components/LibraryView'
import ReadingTestView from 'Components/Tests/ReadingTest/index'
import ExhaustiveTestView from 'Components/Tests/ExhaustiveTest/index'
import AdaptiveTestView from 'Components/Tests/AdaptiveTest/index'
import ReadViews from 'Components/ReadViews'
import ControlledStoryEditView from 'Components/ControlledStoryEditView'
import ConstructTestView from 'Components/ConstructTestView'
import VocabularyView from 'Components/VocabularyView'
import PracticeView from 'Components/PracticeView'
import LanguageSelectView from 'Components/LanguageSelectView'
// import InterfaceLanguageView from 'Components/LanguageSelectView/InterfaceLanguageView'
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
import {
  closeEncouragement,
  closeFCEncouragement,
  openEncouragement } from 'Utilities/redux/encouragementsReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import GroupAnalytics from './GroupView/GroupAnalytics'
import GroupPeople from './GroupView/GroupPeople'
import GroupSetting from './GroupView/GroupSetting'
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
import DebugCorrectionView from './DebugCorrectionView'
import AnnotationsLibrary from './AnnotationsLibrary'
import ReferenceView from './ReferenceView'
import EditStoryView from './EditStoryView'
import LessonPracticeView from './Lessons/LessonPracticeView'
import LessonLibrary from './Lessons/LessonLibrary'
import GecView from './GecView'
import StoryGeneration from './StoryGeneration'
import Estimator from './Estimator'
import ReadingComprehensionView from './ReadingComprehension'
import ReadingPracticeView from 'Components/Tests/ReadingTest/ReadingPracticeByStoryID'

export default () => {
  const userData = useSelector(state => state.user?.data?.user)
  let enableRecmd = null
  if (userData) {
    enableRecmd = userData.enable_recmd
  }
  const location = useLocation()
  const dispatch = useDispatch()

  const smallWindow = useWindowDimensions().width < 640

  useEffect(() => {
    dispatch(closeEncouragement())
    dispatch(closeFCEncouragement())
    if (
      (enableRecmd && location.pathname.includes('welcome')) ||
      (enableRecmd &&
        location.pathname.includes('flashcards') &&
        !location.pathname.includes('test'))
    ) {
      dispatch(openEncouragement())
    }
    dispatch(
      sidebarSetOpen(
        ['/', '/welcome', '/home'].includes(location.pathname) &&
          userData !== null &&
          userData !== undefined &&
          !smallWindow
      )
    )
  }, [location.pathname])

  return (
    <Routes>
      <Route path="/selkomitta" element={<Estimator />} />
      <Route path="/" element={userData ? <Navigate to="/welcome" replace /> : <LandingPage />} />
      <Route
        path="*"
        element={(
          <>
            <NavBar />
            <main className={`application-content ${getBackgroundColor()}`}>
              <Routes>
                <Route path="/email-confirm/:token" element={<EmailConfirm />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/group-confirmation/:token" element={<InvitationConfirm />} />
                <Route path="/register" element={<RegisterView />} />
                <Route path="/help" element={<Help />} />
                <Route path="/accept_story" element={<AcceptSharedStory queryParams={location.search} />} />
                <Route path="/block_user" element={<BlockStorySender queryParams={location.search} />} />
                <Route
                  path="/remove_friend_email"
                  element={<UnfollowStorySender queryParams={location.search} />}
                />
                <Route
                  path="/accept_and_add"
                  element={<AcceptStoryFollowUser queryParams={location.search} />}
                />

                {/* <ProtectedRoute
                  languageRequired={false}
                  exact
                  path="/interfaceLearningLanguage"
                  component={InterfaceLanguageView}
                /> */}

                <Route
                  path="/learningLanguage"
                  element={<ProtectedRoute languageRequired={false} component={LanguageSelectView} />}
                />

                <Route path="/login" element={<ProtectedRoute component={HomeView} />} />
                <Route path="/home" element={<ProtectedRoute component={HomeView} />} />
                <Route path="/welcome" element={<ProtectedRoute component={HomeView} />} />

                <Route path="/lessons/library" element={<ProtectedRoute component={LessonLibrary} />} />
                <Route path="/lesson/practice" element={<ProtectedRoute component={LessonPracticeView} />} />
                <Route
                  path="/lesson/group/:id/practice"
                  element={<ProtectedRoute component={LessonPracticeView} />}
                />

                <Route path="/library" element={<ProtectedRoute component={LibraryView} />} />
                <Route path="/library/private" element={<ProtectedRoute component={LibraryView} />} />
                <Route path="/library/group" element={<ProtectedRoute component={LibraryView} />} />
                <Route path="/flashcards" element={<ProtectedRoute component={Flashcards} />} />
                <Route path="/flashcards/:mode" element={<ProtectedRoute component={Flashcards} />} />
                <Route
                  path="/flashcards/:mode/:type/:storyId"
                  element={<ProtectedRoute component={Flashcards} />}
                />
                <Route path="/stories/:id/practice/" element={<ProtectedRoute component={PracticeView} />} />
                <Route
                  path="/stories/:id/grammar/practice/"
                  element={<ProtectedRoute component={PracticeView} />}
                />
                <Route
                  path="/stories/:id/listening/practice"
                  element={<ProtectedRoute component={PracticeView} />}
                />
                <Route path="/stories/:id/speech/practice" element={<ProtectedRoute component={PracticeView} />} />
                <Route
                  path="/stories/:id/controlled-practice/"
                  element={<ProtectedRoute component={PracticeView} />}
                />
                <Route
                  path="/stories/:id/practice-preview/"
                  element={<ProtectedRoute component={ReadViews} />}
                />
                <Route path="/stories/:id/review/" element={<ProtectedRoute component={ReadViews} />} />
                <Route path="/stories/:id/preview/" element={<ProtectedRoute component={ReadViews} />} />
                <Route path="/stories/:id/edit" element={<ProtectedRoute component={EditStoryView} />} />
                <Route path="/stories/:id/group/review" element={<ProtectedRoute component={ReadViews} />} />
                <Route path="/stories/:id/group/preview" element={<ProtectedRoute component={ReadViews} />} />
                <Route path="/stories/:id/compete/" element={<ProtectedRoute component={CompeteView} />} />
                <Route
                  path="/stories/:id/controlled-story-editor/"
                  element={<ProtectedRoute component={ControlledStoryEditView} />}
                />
                <Route
                  path="/stories/:storyId/reading-comprehension-options"
                  element={<ProtectedRoute component={ReadingComprehensionView} />}
                />
                <Route
                  path="/stories/:id/reading_practice"
                  element={<ProtectedRoute component={ReadingPracticeView} />}
                />

                <Route path="/crossword/:storyId" element={<ProtectedRoute component={CrosswordView} />} />

                <Route path="/groups/:role" element={<ProtectedRoute component={GroupView} />} />
                <Route
                  path="/groups/teacher/analytics"
                  element={<ProtectedRoute component={GroupAnalytics} />}
                />
                <Route path="/groups/:role/people" element={<ProtectedRoute component={GroupPeople} />} />
                <Route path="/groups/:role/:id/topics" element={<ProtectedRoute component={GroupSetting} />} />
                <Route path="/groups/:role/:id/settings" element={<ProtectedRoute component={GroupSetting} />} />
                {/* <ProtectedRoute exact path="/concepts" component={Concepts} /> */}
                <Route path="/profile/main" element={<ProtectedRoute component={Profile} />} />
                <Route path="/profile/account" element={<ProtectedRoute component={Profile} />} />
                <Route path="/profile/progress" element={<ProtectedRoute component={Profile} />} />
                <Route
                  path="/profile/progress/flashcards"
                  element={<ProtectedRoute component={Profile} />}
                />
                <Route path="/profile/progress/grammar" element={<ProtectedRoute component={Profile} />} />
                <Route path="/profile/settings" element={<ProtectedRoute component={Profile} />} />
                <Route path="/profile/following" element={<ProtectedRoute component={Profile} />} />
                <Route path="/tests" element={<ProtectedRoute component={ExhaustiveTestView} />} />
                <Route path="/reading-test" element={<ProtectedRoute component={ReadingTestView} />} />
                <Route path="/adaptive-test" element={<ProtectedRoute component={AdaptiveTestView} />} />
                <Route path="/achievements" element={<ProtectedRoute component={Achievements} />} />
                <Route path="/leaderboard" element={<ProtectedRoute component={Leaderboard} />} />
                <Route path="/notes-library" element={<ProtectedRoute component={AnnotationsLibrary} />} />
                <Route path="/test-construction" element={<ProtectedRoute component={ConstructTestView} />} />
                <Route path="/test-debug" element={<ProtectedRoute component={DebugTestView} />} />
                <Route path="/correction-debug" element={<ProtectedRoute component={DebugCorrectionView} />} />
                <Route path="/vocabulary-view" element={<ProtectedRoute component={VocabularyView} />} />
                <Route path="/gec" element={<ProtectedRoute component={GecView} />} />
                <Route path="/reference" element={<ProtectedRoute component={ReferenceView} />} />
                <Route path="/story-generation" element={<ProtectedRoute component={StoryGeneration} />} />
              </Routes>
            </main>
          </>
        )}
      />
    </Routes>
  )
}
