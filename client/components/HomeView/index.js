import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import { images, supportedLearningLanguages } from 'Utilities/common'
import { useDispatch, useSelector } from 'react-redux'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { getAllStories } from 'Utilities/redux/storiesReducer'
import { Tooltip } from '@mui/material'
import useWindowDimensions from 'Utilities/windowDimensions'
import Footer from 'Components/Footer'
import AddStoryModal from 'Components/AddStoryModal'
import SetCEFRReminder from 'Components/SetCEFRReminder'
import BetaLanguageModal from 'Components/BetaLanguageModal'
import { startTour } from 'Utilities/redux/tourReducer'
import { 
  homeTourViewed, 
  ddlangIntroductoryViewed, 
  ddlangBackgroundQuestionsAnswered 
} from 'Utilities/redux/userReducer'
import MedalSummary from './MedalSummary'
import PracticeModal from './PracticeModal'
import EloChart from './EloChart'
import LeaderboardSummary from './LeaderboardSummary'
import DDLangIntroductory from 'Components/Tests/ReadingTest/ReadingTestIntroductory'
// import DDLangTermsAndConditions from 'Components/StaticContent/DDLangTermsAndConditions'
import GeneralChatbot from 'Components/ChatBot/GeneralChatbot'


const HomeviewButton = ({imgSrc, altText,
                         translationKey, handleClick,
                         dataCy, wide, beta_feature, content=null
                        }) =>
      {
        const button = (
          <button
            className={`flex justify-center homeview-btn${wide ? ' homeview-btn-wide' : ' homeview-btn-narrow'}`}
            type="button"
            onClick={handleClick}
            data-cy={dataCy}
          >
            {!wide && <img src={imgSrc} alt={altText} style={{ maxWidth: '50px', maxHeight: '50px' }}/>}
            <div 
              className="homeview-btn-text flex items-center justify-center" 
              style={{ width: '100%', height: '100%', alignItems: 'center'}}
            >
              <FormattedMessage id={translationKey} />
              {beta_feature && (
                <sup>
                  <b style={{ color: 'red' }}>BETA</b>
                </sup>
              )}
            </div>
          </button>
        )
        if (!content) {
          return button
        }

        return (
          <Tooltip placement="top" title={<FormattedHTMLMessage id={content} />} arrow>
            <span>{button}</span>
          </Tooltip>
        )}


const HomeviewButtons = ({
  setPracticeModalOpen,
  setAddStoryModalOpen,
  aTestIsEnabled,
  aReadingComprehensionEnabled }) => {
  const navigate = useNavigate()

  const hasTests = useSelector(state => state.metadata.hasTests)
  const lessons = useSelector(state => state.metadata.lessons)
  const teacherAccess = useSelector(state => state.user.data.user?.is_teacher)
  const isTeacherView = useSelector(state => state.user.data.teacherView)
  const lastActivity = useSelector(state => state.activity.lastActivity)
  const stories = useSelector(state => state.stories.data)
  const learningLanguage = useSelector(state => state.user.data.user?.last_used_language)
  const hasTeacherRole = Boolean(teacherAccess)

  const homeViewButtonsGridClassName = hasTeacherRole && isTeacherView ? "teacher" : "student"
  
  const assembleActivityLink = (lastActivity) => {
    switch (lastActivity && lastActivity.type) {
      case 'flashcard':
        return `/flashcards`
      case 'preview':
        if (stories?.find(x => x._id === lastActivity.story_id))
          return `/stories/${lastActivity.story_id}/preview/`
        else return null
      case 'review':
        if (stories?.find(x => x._id === lastActivity.story_id))
          return `/stories/${lastActivity.story_id}/review/`
        else return null
      case 'practice':
        const story = stories?.find(x => x._id === lastActivity.story_id)
        if (story?.control_story) 
          return `/stories/${lastActivity.story_id}/controlled-practice/`
        else if (story) 
          return `/stories/${lastActivity.story_id}/practice/`
        else return null
      
      case 'lesson':
        if (lastActivity.group_id) return `/lesson/group/${lastActivity.group_id}/practice`
        else return `/lesson/practice`

      case 'crossword':
        return `/crossword/${lastActivity.story_id}`

      case 'reading-test':
        if (learningLanguage === lastActivity.language && aReadingComprehensionEnabled) return `/reading-test`
        else return null
      default:
        return null
    }
  }
  const activityLink = assembleActivityLink(lastActivity)
  return (
    <div className="" style={{width: '100%'}}>
      {(hasTeacherRole && isTeacherView) && (
        <div className={`homeview-btns-cont homeview-btns-cont-${homeViewButtonsGridClassName}`}>
          <div className="add-new-stories-btn-cont tour-add-new-stories">
            <HomeviewButton
              imgSrc={images.addStoriesIcon}
              altText="Add stories"
              // wide
              translationKey="add-your-stories"
              handleClick={() => setAddStoryModalOpen(true)}
              dataCy="add-story-button"
            />
          </div>
          <div className="groups-btn-cont tour-groups">
            <HomeviewButton
              imgSrc={images.group1}
              altText="two books in a pile"
              translationKey="Groups"
              handleClick={() => navigate('/groups/teacher')}
              dataCy="groups-button"
            />
          </div>
          <div className="library-btn-cont tour-library">
            <HomeviewButton
              imgSrc={images.library}
              altText="two books in a pile"
              translationKey="Library"
              handleClick={() => navigate('/library')}
              dataCy="library-button"
              content="Home-Library-EXPLANATION"
            />
          </div>
          {lessons && lessons.length > 0 && (
            <div className="lesson-btn-cont tour-lesson">
              <HomeviewButton
                imgSrc={images.readingBook}
                altText="reading a book"
                translationKey="lesson-home-btn"
                handleClick={() => navigate('/lessons/library')}
                content="Home-Lessons-EXPLANATION"
              />
            </div>
          )}
        </div>
      )}

      {(!hasTeacherRole || !isTeacherView) && (
        <div className={`homeview-btns-cont homeview-btns-cont-${homeViewButtonsGridClassName}`}>
          {activityLink && (
            <div className="continue-activity-btn-cont">
              <HomeviewButton
                imgSrc={images.notesIcon}
                altText="Continue"
                translationKey="continue-activity"
                handleClick={() => navigate(activityLink)}
                dataCy="continue-activity-button"
                content="Home-Continue-Activity-EXPLANATION"
              />
            </div>
          )}
          <div className="practice-btn-cont tour-practice-now">
            <HomeviewButton
              // imgSrc={images.dices}
              // altText="two dices"
              imgSrc={images.diveIn}
              altText="dive in"
              translationKey="practice-now"
              handleClick={() => setPracticeModalOpen(true)}
              dataCy="practice-now"
              content="Home-Dive-In-EXPLANATION"
            />
          </div>
          {lessons && lessons.length > 0 && (
            <div className="lesson-btn-cont tour-lesson">
              <HomeviewButton
                imgSrc={images.readingBook}
                altText="reading a book"
                translationKey="lesson-home-btn"
                handleClick={() => navigate('/lessons/library')}
                content="Home-Lessons-EXPLANATION"
              />
            </div>
          )}
          <div className="library-btn-cont tour-library">
            <HomeviewButton
              imgSrc={images.library}
              altText="two books in a pile"
              translationKey="Library"
              handleClick={() => navigate('/library')}
              dataCy="library-button"
              content="Home-Library-EXPLANATION"
            />
          </div>
          <div className="flashcards-btn-cont tour-flashcards">
            <HomeviewButton
              imgSrc={images.flashcards}
              altText="three playing cards"
              translationKey="Flashcards"
              handleClick={() => navigate('/flashcards/fillin')}
              content="Home-Flashcards-EXPLANATION"
            />
          </div>
          {hasTests && aTestIsEnabled && (
            <div className="test-btn-cont">
              <HomeviewButton
                imgSrc={images.exhaustiveTest}
                altText="a test form with a clock on it"
                translationKey="Tests"
                handleClick={() => navigate('/tests')}
                dataCy="tests-button"
              />
            </div>
          )}
          {learningLanguage != undefined && learningLanguage === "English" && aReadingComprehensionEnabled && (
            <div  className="reading-test-btn-cont">
              <HomeviewButton
                imgSrc={images.readingBook}
                altText="reading test"
                translationKey="reading-test"
                handleClick={() => navigate('/reading-test')}
                dataCy="reading-test-button"
              />
            </div>
          )}
        </div>
      )}     
    </div>
  )
}

const HomeView = () => {
  const { width } = useWindowDimensions()
  const bigScreen = width >= 700
  const showFooter = width > 800
  const dispatch = useDispatch()
  const location = useLocation()

  const groups = useSelector(state => state.groups.groups)
  const aTestIsEnabled = groups.some(e => e.test_deadline - Date.now() > 0)
  const aReadingComprehensionEnabled = groups.some(e => e.reading_comprehension)

  const selected = useSelector(state => state.user.selected)
  const open = useSelector(state => state.encouragement.open)
  const teacherView = useSelector(state => state.user.data.teacherView)
  const teacherAccess = useSelector(state => state.user.data.user?.is_teacher)
  const userEmail = useSelector(state => state.user.data.user?.email)
  const isNewUser = useSelector(state => state.user.data.user?.is_new_user)
  const userGrade = useSelector(state => state.user.data.user?.grade)
  const learningLanguage = useSelector(state => state.user.data.user?.last_used_language)
  const hasSeenHomeTour = useSelector(state => state.user.data.user?.has_seen_home_tour)
  const hasSeenDDLangIntroductory = useSelector(
    state => state.user.data.user?.has_seen_ddlang_introductory
  )
  const ddlangDeveloperScope = useSelector(state => state.user.data.user?.developer_of_language)
  const inAnyDDLangGroups = useSelector(state => state.user.data.user?.in_any_ddlang_groups)
  const ddlangYears = useSelector(state => state.user.data.user?.ddlang_years)
  const ddlangObligatoryCourses = useSelector(state => state.user.data.user?.ddlang_obligatoryCourses)
  const ddlangOptionalCourses = useSelector(state => state.user.data.user?.ddlang_optionalCourses)
  const ddlangGrade = useSelector(state => state.user.data.user?.ddlang_grade)

    const [betaModalOpen, setBetaModalOpen] = useState(false)
  const [practiceModalOpen, setPracticeModalOpen] = useState(false)
  const [addStoryModalOpen, setAddStoryModalOpen] = useState(false)
  const userIsAnonymous = userEmail === 'anonymous_email'

  // If navigation set state to open practice modal (e.g. from Sidebar), open it and clear history state
  const navigate = useNavigate()
  useEffect(() => {
    if (location?.state?.practiceModalOpen) {
      setPracticeModalOpen(true)
      // clear the navigation state so modal doesn't reopen on back/refresh
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location?.state, navigate, location.pathname])
  const [openReminder, setOpenReminder] = useState(true)
  const welcomeView = location.pathname.endsWith('/welcome')
  const homeView = location.pathname.endsWith('/home')
  const showDAModal = open && homeView && !userIsAnonymous
  const showWelcomeModal = open && welcomeView && !userIsAnonymous && !isNewUser

  const [showDDLangIntroductory, setShowDDLangIntroductory] = useState(false)
  const [showDDLangBackGroundQuestions, setShowDDLangBackGroundQuestions] = useState(false)

  useEffect(() => {
    dispatch(getGroups())
    if (showDAModal && !showWelcomeModal) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1 })
      )
    }
  }, [])

  useEffect(() => {
    if (
      !userIsAnonymous &&
      learningLanguage &&
      !supportedLearningLanguages.major.includes(learningLanguage.toLowerCase()) &&
      selected
    ) {
      setBetaModalOpen(true)
    }
  }, [learningLanguage])

  useEffect(() => {
    if (teacherView) {
      dispatch({ type: 'SET_TEACHER_HOME_TOUR_STEPS' })
    } else {
      dispatch({ type: 'SET_STUDENT_HOME_TOUR_STEPS' })
    }
    if (!hasSeenHomeTour && !isNewUser && !showDDLangIntroductory) {
      dispatch(homeTourViewed())
      dispatch(startTour())
    }
  }, [isNewUser, showDDLangIntroductory])

  useEffect(() => {
    if (
        !hasSeenDDLangIntroductory && 
        learningLanguage === "English" &&
        (
          ddlangDeveloperScope === "all" ||
          inAnyDDLangGroups == true
        )
      ) {
      dispatch(ddlangIntroductoryViewed())
      setShowDDLangIntroductory(true)
    }
  }, [])

  useEffect(() => {
    if (
      // !user.user.has_answer_ddlang_background_questions && 
      (
        !ddlangYears || 
        !ddlangObligatoryCourses || 
        !ddlangOptionalCourses || 
        !ddlangGrade
      ) &&
      learningLanguage === "English" &&
      (
        ddlangDeveloperScope === "all" ||
        inAnyDDLangGroups == true
      )
    ) {
      dispatch(ddlangBackgroundQuestionsAnswered())
      setShowDDLangBackGroundQuestions(true)
    }
  }, [])

  const homeviewButtonsContainerClassName = teacherAccess && teacherView ? "pn-nm" : "flex pb-nm"

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm pt-lg blue-bg">
      {showDDLangIntroductory && <DDLangIntroductory setShowDDLangIntroductory={setShowDDLangIntroductory}/>}
      {/* {showDDLangBackGroundQuestions && <DDLangTermsAndConditions openModal={showDDLangBackGroundQuestions} setOpenModal={setShowDDLangBackGroundQuestions}/>} */}
      <AddStoryModal open={addStoryModalOpen} setOpen={setAddStoryModalOpen} />
      <PracticeModal open={practiceModalOpen} setOpen={setPracticeModalOpen} />
      <BetaLanguageModal
        open={betaModalOpen}
        setOpen={setBetaModalOpen}
        language={learningLanguage}
      />

      {/* (!user?.user.is_teacher || (user?.user.is_teacher && !user?.teacherView)) && (
        <Recommender />
      ) */}
      {(!teacherAccess || !teacherAccess[learningLanguage]) &&
        !userGrade &&
        !userIsAnonymous &&
        isNewUser && (
          <SetCEFRReminder
            open={openReminder}
            setOpen={setOpenReminder}
            newUser={isNewUser}
          />
      )}
      <div className="grow flex-col">
        {bigScreen ? (
          <div className="grow flex-col space-between gap-row-nm">
            <div className={homeviewButtonsContainerClassName} style={{ gap: '1.5em' }}>
              <HomeviewButtons
                setPracticeModalOpen={setPracticeModalOpen}
                setAddStoryModalOpen={setAddStoryModalOpen}
                aTestIsEnabled={aTestIsEnabled}
                aReadingComprehensionEnabled={aReadingComprehensionEnabled}
              />
              {(!teacherAccess || (teacherAccess && !teacherView)) && (
                <div
                  className="flex-col"
                  style={{
                    width: '350px',
                    gap: '1.9em' }}
                >
                  <EloChart width="100%" />
                  <LeaderboardSummary />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-col" style={{ gap: '1.5em', marginBottom: '.5em' }}>
            <HomeviewButtons
              setPracticeModalOpen={setPracticeModalOpen}
              setAddStoryModalOpen={setAddStoryModalOpen}
              aTestIsEnabled={aTestIsEnabled}
              aReadingComprehensionEnabled={aReadingComprehensionEnabled}
            />
            {(!teacherAccess || (teacherAccess && !teacherView)) && (
              <>
                <EloChart width="100%" />
                <LeaderboardSummary />
                <MedalSummary />
              </>
            )}
          </div>
        )}
        <GeneralChatbot />
        {showFooter && <Footer />}
      </div>
    </div>
  )
}

export default HomeView
