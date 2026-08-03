import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { colors } from 'Assets/mui_theme/designTokens'
// Eagerly loaded: always present (NavBar), wrapper (ProtectedRoute),
// initial public route (LandingPage), and Suspense fallback (Spinner).
import ProtectedRoute from 'Components/AccessControl/ProtectedRoute'
import NavBar from './NavBar'
import LandingPage from './LandingPage'
import Spinner from 'Components/Spinner'
import ErrorBoundary from './ErrorBoundary'
import {
  closeEncouragement,
  closeFCEncouragement,
  openEncouragement,
} from 'Utilities/redux/encouragementsReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import useWindowDimensions from 'Utilities/windowDimensions'

// Route components are code-split via React.lazy so they are not shipped in the
// initial bundle.
const HomeView = lazy(() => import('Components/HomeView'))
const LibraryView = lazy(() => import('Components/LibraryView'))
const ReadingTestView = lazy(() => import('Components/Tests/ReadingTest/index'))
const ExhaustiveTestView = lazy(() => import('Components/Tests/ExhaustiveTest/index'))
const AdaptiveTestView = lazy(() => import('Components/Tests/AdaptiveTest/index'))
const ReadViews = lazy(() => import('Components/ReadViews'))
const ControlledStoryEditView = lazy(() => import('Components/ControlledStoryEditView'))
const ConstructTestView = lazy(() => import('Components/ConstructTestView'))
const VocabularyView = lazy(() => import('Components/VocabularyView'))
const PracticeView = lazy(() => import('Components/PracticeView'))
const LanguageSelectView = lazy(() => import('Components/LanguageSelectView'))
const EmailConfirm = lazy(() => import('Components/AccessControl/EmailConfirm'))
const AcceptSharedStory = lazy(() => import('Components/AccessControl/AcceptStory'))
const BlockStorySender = lazy(() => import('Components/AccessControl/BlockStorySender'))
const AcceptStoryFollowUser = lazy(() => import('Components/AccessControl/AcceptStoryFollowUser'))
const UnfollowStorySender = lazy(() => import('Components/AccessControl/UnfollowStorySender'))
const InvitationConfirm = lazy(() => import('Components/GroupView/InvitationConfirm'))
const CrosswordView = lazy(() => import('Components/CrosswordView'))
const CompeteView = lazy(() => import('Components/CompeteView'))
const GroupView = lazy(() => import('Components/GroupView'))
const GroupAnalytics = lazy(() => import('./GroupView/GroupAnalytics'))
const GroupPeople = lazy(() => import('./GroupView/GroupPeople'))
const GroupSetting = lazy(() => import('./GroupView/GroupSetting'))
const Profile = lazy(() => import('./Profile/Profile'))
const ResetPassword = lazy(() => import('./AccessControl/ResetPassword'))
const Help = lazy(() => import('./StaticContent/Help'))
const Flashcards = lazy(() => import('./Flashcards'))
const Achievements = lazy(() => import('./Achievements'))
const Leaderboard = lazy(() => import('./LeaderboardView'))
const RegisterView = lazy(() => import('./RegisterView'))
const DesignSystem = lazy(() => import('./DesignSystem'))
const DebugTestView = lazy(() => import('./DebugTestView'))
const DebugCorrectionView = lazy(() => import('./EssayWritingView/DebugCorrectionView'))
const AnnotationsLibrary = lazy(() => import('./AnnotationsLibrary'))
const ReferenceView = lazy(() => import('./ReferenceView'))
const EditStoryView = lazy(() => import('./EditStoryView'))
const LessonPracticeView = lazy(() => import('./Lessons/LessonPracticeView'))
const LessonLibrary = lazy(() => import('./Lessons/LessonLibrary'))
const GecView = lazy(() => import('./GecView'))
const StoryGeneration = lazy(() => import('./StoryGeneration'))
const ReadingComprehensionView = lazy(() => import('./ReadingComprehension'))
const ReadingPracticeView = lazy(
  () => import('Components/Tests/ReadingTest/ReadingPracticeByStoryID'),
)
const EssayWritingView = lazy(() => import('./EssayWritingView'))
const Dashboard = lazy(() => import('./Dashboard'))

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
          !smallWindow,
      ),
    )
  }, [location.pathname])

  return (
    <Routes>
      {/* <Route path="/selkomitta" element={<Estimator />} /> */}
      <Route path="/" element={userData ? <Navigate to="/welcome" replace /> : <LandingPage />} />
      <Route
        path="*"
        element={
          <>
            <NavBar />
            <main className="application-content" style={{ backgroundColor: colors.panel }}>
              <ErrorBoundary>
                <Suspense fallback={null}>
                  <Routes>
                    <Route path="/email-confirm/:token" element={<EmailConfirm />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/group-confirmation/:token" element={<InvitationConfirm />} />
                    <Route path="/register" element={<RegisterView />} />
                    <Route path="/design" element={<DesignSystem />} />
                    <Route path="/help" element={<Help />} />
                    <Route
                      path="/accept_story"
                      element={<AcceptSharedStory queryParams={location.search} />}
                    />
                    <Route
                      path="/block_user"
                      element={<BlockStorySender queryParams={location.search} />}
                    />
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
                      element={
                        <ProtectedRoute languageRequired={false} component={LanguageSelectView} />
                      }
                    />

                    <Route path="/login" element={<ProtectedRoute component={HomeView} />} />
                    <Route path="/home" element={<ProtectedRoute component={HomeView} />} />
                    <Route path="/welcome" element={<ProtectedRoute component={HomeView} />} />

                    <Route
                      path="/lessons/library"
                      element={<ProtectedRoute component={LessonLibrary} />}
                    />
                    <Route
                      path="/lesson/practice"
                      element={<ProtectedRoute component={LessonPracticeView} />}
                    />
                    <Route
                      path="/lesson/group/:id/practice"
                      element={<ProtectedRoute component={LessonPracticeView} />}
                    />

                    <Route path="/library" element={<ProtectedRoute component={LibraryView} />} />
                    <Route
                      path="/library/private"
                      element={<ProtectedRoute component={LibraryView} />}
                    />
                    <Route
                      path="/library/group"
                      element={<ProtectedRoute component={LibraryView} />}
                    />
                    <Route path="/flashcards" element={<ProtectedRoute component={Flashcards} />} />
                    <Route
                      path="/flashcards/:mode"
                      element={<ProtectedRoute component={Flashcards} />}
                    />
                    <Route
                      path="/flashcards/:mode/:type/:storyId"
                      element={<ProtectedRoute component={Flashcards} />}
                    />
                    <Route
                      path="/stories/:id/practice/"
                      element={<ProtectedRoute component={PracticeView} />}
                    />
                    <Route
                      path="/stories/:id/grammar/practice/"
                      element={<ProtectedRoute component={PracticeView} />}
                    />
                    <Route
                      path="/stories/:id/listening/practice"
                      element={<ProtectedRoute component={PracticeView} />}
                    />
                    <Route
                      path="/stories/:id/speech/practice"
                      element={<ProtectedRoute component={PracticeView} />}
                    />
                    <Route
                      path="/stories/:id/controlled-practice/"
                      element={<ProtectedRoute component={PracticeView} />}
                    />
                    <Route
                      path="/stories/:id/practice-preview/"
                      element={<ProtectedRoute component={ReadViews} />}
                    />
                    <Route
                      path="/stories/:id/review/"
                      element={<ProtectedRoute component={ReadViews} />}
                    />
                    <Route
                      path="/stories/:id/preview/"
                      element={<ProtectedRoute component={ReadViews} />}
                    />
                    <Route
                      path="/stories/:id/edit"
                      element={<ProtectedRoute component={EditStoryView} />}
                    />
                    <Route
                      path="/stories/:id/group/review"
                      element={<ProtectedRoute component={ReadViews} />}
                    />
                    <Route
                      path="/stories/:id/group/preview"
                      element={<ProtectedRoute component={ReadViews} />}
                    />
                    <Route
                      path="/stories/:id/compete/"
                      element={<ProtectedRoute component={CompeteView} />}
                    />
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

                    <Route
                      path="/crossword/:storyId"
                      element={<ProtectedRoute component={CrosswordView} />}
                    />

                    <Route
                      path="/groups/:role"
                      element={<ProtectedRoute component={GroupView} />}
                    />
                    <Route
                      path="/groups/teacher/analytics"
                      element={<ProtectedRoute component={GroupAnalytics} />}
                    />
                    <Route
                      path="/groups/:role/people"
                      element={<ProtectedRoute component={GroupPeople} />}
                    />
                    <Route
                      path="/groups/:role/:id/topics"
                      element={<ProtectedRoute component={GroupSetting} />}
                    />
                    <Route
                      path="/groups/:role/:id/settings"
                      element={<ProtectedRoute component={GroupSetting} />}
                    />
                    {/* <ProtectedRoute exact path="/concepts" component={Concepts} /> */}
                    <Route path="/profile/main" element={<ProtectedRoute component={Profile} />} />
                    <Route
                      path="/profile/account"
                      element={<ProtectedRoute component={Profile} />}
                    />
                    <Route
                      path="/profile/progress"
                      element={<ProtectedRoute component={Profile} />}
                    />
                    <Route
                      path="/profile/progress/flashcards"
                      element={<ProtectedRoute component={Profile} />}
                    />
                    <Route
                      path="/profile/progress/grammar"
                      element={<ProtectedRoute component={Profile} />}
                    />
                    <Route
                      path="/profile/settings"
                      element={<ProtectedRoute component={Profile} />}
                    />
                    <Route
                      path="/profile/following"
                      element={<ProtectedRoute component={Profile} />}
                    />
                    <Route
                      path="/tests"
                      element={<ProtectedRoute component={ExhaustiveTestView} />}
                    />
                    <Route
                      path="/reading-test"
                      element={<ProtectedRoute component={ReadingTestView} />}
                    />
                    <Route
                      path="/adaptive-test"
                      element={<ProtectedRoute component={AdaptiveTestView} />}
                    />
                    <Route
                      path="/achievements"
                      element={<ProtectedRoute component={Achievements} />}
                    />
                    <Route
                      path="/leaderboard"
                      element={<ProtectedRoute component={Leaderboard} />}
                    />
                    <Route
                      path="/notes-library"
                      element={<ProtectedRoute component={AnnotationsLibrary} />}
                    />
                    <Route
                      path="/test-construction"
                      element={<ProtectedRoute component={ConstructTestView} />}
                    />
                    <Route
                      path="/test-debug"
                      element={<ProtectedRoute component={DebugTestView} />}
                    />
                    <Route
                      path="/correction-debug"
                      element={<ProtectedRoute component={DebugCorrectionView} />}
                    />
                    <Route
                      path="/vocabulary-view"
                      element={<ProtectedRoute component={VocabularyView} />}
                    />
                    <Route path="/gec" element={<ProtectedRoute component={GecView} />} />
                    <Route
                      path="/reference"
                      element={<ProtectedRoute component={ReferenceView} />}
                    />
                    <Route
                      path="/story-generation"
                      element={<ProtectedRoute component={StoryGeneration} />}
                    />
                    <Route
                      path="/essay-writing"
                      element={<ProtectedRoute component={EssayWritingView} />}
                    />
                    {/* Hidden admin page — no link in the app; gated to developer_of_language "all" inside the component. */}
                    <Route
                      path="/dashboard"
                      element={<ProtectedRoute component={Dashboard} languageRequired={false} />}
                    />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
          </>
        }
      />
    </Routes>
  )
}
