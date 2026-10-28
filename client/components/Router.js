import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { colors } from 'Assets/mui_theme/designTokens'
import ProtectedRoute from 'Components/AccessControl/ProtectedRoute'
// DEMO ONLY — see the /essay-writing + /writing-clinic routes below.
import DemoPublicRoute from 'Components/DemoPublicRoute'
import NavBar from './NavBar'
import LandingPage from './LandingPage'
import Footer from './Footer'
import ErrorBoundary from './ErrorBoundary'
import {
  closeEncouragement,
  closeFCEncouragement,
  openEncouragement,
} from 'Utilities/redux/encouragementsReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import useWindowDimensions from 'Utilities/windowDimensions'

// React.lazy that stays suspended when a stale chunk resolves empty (deployUpdates' preload-error
// handler is reloading), instead of crashing into the ErrorBoundary and reporting to Sentry.
const lazyRoute = factory => lazy(() => factory().then(module => module ?? new Promise(() => {})))

// Route components are code-split via React.lazy so they are not shipped in the
// initial bundle.
const HomeView = lazyRoute(() => import('Components/HomeView'))
const LibraryView = lazyRoute(() => import('Components/LibraryView'))
const ReadingTestView = lazyRoute(() => import('Components/Tests/ReadingTest/index'))
const ExhaustiveTestView = lazyRoute(() => import('Components/Tests/ExhaustiveTest/index'))
const AdaptiveTestView = lazyRoute(() => import('Components/Tests/AdaptiveTest/index'))
const ReadViews = lazyRoute(() => import('Components/ReadViews'))
const ControlledStoryEditView = lazyRoute(() => import('Components/ControlledStoryEditView'))
const ConstructTestView = lazyRoute(() => import('Components/ConstructTestView'))
const VocabularyView = lazyRoute(() => import('Components/VocabularyView'))
const PracticeView = lazyRoute(() => import('Components/PracticeView'))
const LanguageSelectView = lazyRoute(() => import('Components/LanguageSelectView'))
const EmailConfirm = lazyRoute(() => import('Components/AccessControl/EmailConfirm'))
const AcceptSharedStory = lazyRoute(() => import('Components/AccessControl/AcceptStory'))
const BlockStorySender = lazyRoute(() => import('Components/AccessControl/BlockStorySender'))
const AcceptStoryFollowUser = lazyRoute(
  () => import('Components/AccessControl/AcceptStoryFollowUser'),
)
const UnfollowStorySender = lazyRoute(() => import('Components/AccessControl/UnfollowStorySender'))
const InvitationConfirm = lazyRoute(() => import('Components/GroupView/InvitationConfirm'))
const CrosswordView = lazyRoute(() => import('Components/CrosswordView'))
const CompeteView = lazyRoute(() => import('Components/CompeteView'))
const GroupView = lazyRoute(() => import('Components/GroupView'))
const GroupAnalytics = lazyRoute(() => import('./GroupView/GroupAnalytics'))
const GroupPeople = lazyRoute(() => import('./GroupView/GroupPeople'))
const GroupSetting = lazyRoute(() => import('./GroupView/GroupSetting'))
const Profile = lazyRoute(() => import('./Profile/Profile'))
const ResetPassword = lazyRoute(() => import('./AccessControl/ResetPassword'))
const Help = lazyRoute(() => import('./StaticContent/Help'))
const Flashcards = lazyRoute(() => import('./Flashcards'))
const Achievements = lazyRoute(() => import('./Achievements'))
const Leaderboard = lazyRoute(() => import('./LeaderboardView'))
const RegisterView = lazyRoute(() => import('./RegisterView'))
const DesignSystem = lazyRoute(() => import('./DesignSystem'))
const DebugTestView = lazyRoute(() => import('./DebugTestView'))
const DebugCorrectionView = lazyRoute(() => import('./EssayWritingView/DebugCorrectionView'))
const AnnotationsLibrary = lazyRoute(() => import('./AnnotationsLibrary'))
const ReferenceView = lazyRoute(() => import('./ReferenceView'))
const EditStoryView = lazyRoute(() => import('./EditStoryView'))
const LessonPracticeView = lazyRoute(() => import('./Lessons/LessonPracticeView'))
const LessonLibrary = lazyRoute(() => import('./Lessons/LessonLibrary'))
const GecView = lazyRoute(() => import('./GecView'))
const ReadingComprehensionView = lazyRoute(() => import('./ReadingComprehension'))
const ReadingPracticeView = lazyRoute(
  () => import('Components/Tests/ReadingTest/ReadingPracticeByStoryID'),
)
const EssayWritingView = lazyRoute(() => import('./EssayWritingView'))
const WritingClinic = lazyRoute(() => import('./WritingClinic'))
const Dashboard = lazyRoute(() => import('./Dashboard'))
const NotFound = lazyRoute(() => import('./NotFound'))
const UploadCachedStory = lazyRoute(() => import('./UploadCachedStory'))

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
                    {/* Backend-composed link: adds the cached story, then opens it. Static, so it
                        ranks above the /stories/:id/* routes below. */}
                    <Route
                      path="/stories/cached"
                      element={<ProtectedRoute component={UploadCachedStory} />}
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
                    {/* DEMO ONLY — these two are public so they can be shown without an account.
                        DemoPublicRoute stands in for ProtectedRoute: a visitor with no session gets
                        an anonymous one, since the API needs a token either way.
                        REVERT BEFORE RELEASE: wrap both back in <ProtectedRoute component={…} />
                        and delete DemoPublicRoute. Neither component takes props, so ProtectedRoute
                        was only the auth gate. See also the 'DEMO ONLY' fallback in
                        EssayWritingView. */}
                    <Route
                      path="/essay-writing"
                      element={
                        <DemoPublicRoute>
                          <EssayWritingView />
                        </DemoPublicRoute>
                      }
                    />
                    <Route
                      path="/writing-clinic"
                      element={
                        <DemoPublicRoute>
                          <WritingClinic />
                        </DemoPublicRoute>
                      }
                    />
                    {/* Hidden admin page — no link in the app; gated to developer_of_language "all" inside the component. */}
                    <Route
                      path="/dashboard"
                      element={<ProtectedRoute component={Dashboard} languageRequired={false} />}
                    />
                    <Route path="/404" element={<NotFound />} />
                    {/* Catch-all: any unknown URL renders the 404 page (inside the normal layout),
                        instead of an empty <main>. */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
            {/* Global footer — rendered once here instead of per-view. */}
            <Footer />
          </>
        }
      />
    </Routes>
  )
}
