import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { images, hiddenFeatures, supportedLearningLanguages } from 'Utilities/common'
import { useDispatch, useSelector } from 'react-redux'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { getAllStories } from 'Utilities/redux/storiesReducer'
import { openEncouragement } from 'Utilities/redux/encouragementsReducer'
import { Popup } from 'semantic-ui-react'
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
import Recommender from 'Components/NewEncouragements/Recommender'
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
        const intl = useIntl()
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
        return (
          <>
            {content &&  <Popup
                           position="top center"
                           trigger={button}
                           content={<FormattedHTMLMessage id={content} />}
                           // was: content={intl.formatMessage({id: content})}
                           basic
                         /> || button
            }
          </>
        )}


const HomeviewButtons = ({
  setPracticeModalOpen,
  setAddStoryModalOpen,
  setLessonModalOpen,
  aTestIsEnabled,
  aReadingComprehensionEnabled,
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { hasTests, hasAdaptiveTests } = useSelector(({ metadata }) => metadata)
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const {lastActivity} = useSelector(({activity}) => activity)
  const {data: stories} = useSelector(({stories}) => stories)
  const userData = useSelector(state => state.user.data.user)
  const learningLanguage = userData ? userData.last_used_language : null
  
  const homeViewButtonsGridClassName = user?.user.is_teacher && user?.teacherView ? "teacher" : "student"
  
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
          return `/stories/${lastActivity.story_id}/${story.exercise_mode}/practice/`
        else return null
      
      case 'lesson':
        if (lastActivity.group_id) return `/lesson/group/${lastActivity.group_id}/practice`
        else return `/lesson/practice`

      case 'crossword':
        return `/crossword/${lastActivity.story_id}`

      case 'reading-test':
        if (learningLanguage == lastActivity.language && aReadingComprehensionEnabled) return `/reading-test`
        else return null
      default:
        return null
    }
  }
  const activityLink = assembleActivityLink(lastActivity)
  return (
    <div className="" style={{width: '100%'}}>
      {(user?.user.is_teacher && user?.teacherView) && (
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
              handleClick={() => history.push('/groups/teacher')}
              dataCy="groups-button"
            />
          </div>
          <div className="library-btn-cont tour-library">
            <HomeviewButton
              imgSrc={images.library}
              altText="two books in a pile"
              translationKey="Library"
              handleClick={() => history.push('/library')}
              dataCy="library-button"
              content="Home-Library-EXPLANATION"
            />
          </div>
          <div className="lesson-btn-cont tour-lesson">
            <HomeviewButton
              imgSrc={images.readingBook}
              altText="reading a book"
              translationKey="lesson-home-btn"
              beta_feature={true}
              handleClick={() => history.push('/lessons/library')}
              content="Home-Lessons-EXPLANATION"
            />
          </div>
        </div>
      )}

      {(!user?.user.is_teacher || (user?.user.is_teacher && !user?.teacherView)) && (
        <div className={`homeview-btns-cont homeview-btns-cont-${homeViewButtonsGridClassName}`}>
          {activityLink && (
            <div className="continue-activity-btn-cont">
              <HomeviewButton
                imgSrc={images.notesIcon}
                altText="Continue"
                translationKey="continue-activity"
                handleClick={() => history.push(activityLink)}
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
          <div className="lesson-btn-cont tour-lesson">
            <HomeviewButton
              imgSrc={images.readingBook}
              altText="reading a book"
              translationKey="lesson-home-btn"
              beta_feature={true}
              handleClick={() => history.push('/lessons/library')}
              content="Home-Lessons-EXPLANATION"
            />
          </div>
          <div className="library-btn-cont tour-library">
            <HomeviewButton
              imgSrc={images.library}
              altText="two books in a pile"
              translationKey="Library"
              handleClick={() => history.push('/library')}
              dataCy="library-button"
              content="Home-Library-EXPLANATION"
            />
          </div>
          <div className="flashcards-btn-cont tour-flashcards">
            <HomeviewButton
              imgSrc={images.flashcards}
              altText="three playing cards"
              translationKey="Flashcards"
              handleClick={() => history.push('/flashcards')}
              content="Home-Flashcards-EXPLANATION"
            />
          </div>
          {hasTests && aTestIsEnabled && (
            <div className="test-btn-cont">
              <HomeviewButton
                imgSrc={images.exhaustiveTest}
                altText="a test form with a clock on it"
                translationKey="Tests"
                handleClick={() => history.push('/tests')}
                dataCy="tests-button"
              />
            </div>
          )}
          {/* {user.user.email !== 'anonymous_email' && (
            <div>
              <HomeviewButton
                imgSrc={images.lightbulbIcon}
                altText="light bulb"
                translationKey="Recommendations"
                handleClick={() => dispatch(openEncouragement())}
              />
            </div>
          )} */}


          {learningLanguage != undefined && learningLanguage == "English" && aReadingComprehensionEnabled && (
            <div  className="reading-test-btn-cont">
              <HomeviewButton
                imgSrc={images.readingBook}
                altText="reading test"
                translationKey="reading-test"
                handleClick={() => history.push('/reading-test')}
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
  const { groups } = useSelector(({ groups }) => groups)
  const aTestIsEnabled = groups.some(e => e.test_deadline - Date.now() > 0)
  const aReadingComprehensionEnabled = groups.some(e => e.reading_comprehension)
  const history = useHistory()
  const userData = useSelector(state => state.user.data.user)
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const { username } = userData
  const { enable_recmd } = useSelector(({ user }) => user.data.user)
  const { selected } = useSelector(({ user }) => user)
  const { open } = useSelector(({ encouragement }) => encouragement)
  const storiesCovered = userData.stories_covered
  const learningLanguage = userData ? userData.last_used_language : null
  const { incomplete, loading } = useSelector(({ incomplete }) => ({
    incomplete: incomplete.data,
    loading: incomplete.pending,
  }))
  const { exercise_setting_template: exerciseSettingTemplate } = useSelector(
    ({ user }) => user.data.user
  )
  const [betaModalOpen, setBetaModalOpen] = useState(false)
  const [practiceModalOpen, setPracticeModalOpen] = useState(false)
  const [addStoryModalOpen, setAddStoryModalOpen] = useState(false)
  const [lessonModalOpen, setLessonModalOpen] = useState(false)
  const userIsAnonymous = userData?.email === 'anonymous_email'
  const [openReminder, setOpenReminder] = useState(true)
  const welcomeView = history.location.pathname.endsWith('/welcome')
  const homeView = history.location.pathname.endsWith('/home')
  const showDAModal = open && homeView && !userIsAnonymous
  const showWelcomeModal = open && welcomeView && !userIsAnonymous && !userData.is_new_user

  const [showDDLangIntroductory, setShowDDLangIntroductory] = useState(false)
  const [showDDLangBackGroundQuestions, setShowDDLangBackGroundQuestions] = useState(false)

  useEffect(() => {
    dispatch(getGroups())
    if (showDAModal && !showWelcomeModal) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        })
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
    if (!user.user.has_seen_home_tour) {
      dispatch(homeTourViewed())
      dispatch(startTour())
    }
  }, [])

  useEffect(() => {
    if (
        !user.user.has_seen_ddlang_introductory && 
        user.user.last_used_language == "English" &&
        (
          user.user.developer_of_language == "all" ||
          user.user.in_any_ddlang_groups == true
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
        !user.user.ddlang_years || 
        !user.user.ddlang_obligatoryCourses || 
        !user.user.ddlang_optionalCourses || 
        !user.user.ddlang_grade
      ) &&
      user.user.last_used_language == "English" &&
      (
        user.user.developer_of_language == "all" ||
        user.user.in_any_ddlang_groups == true
      )
    ) {
      dispatch(ddlangBackgroundQuestionsAnswered())
      setShowDDLangBackGroundQuestions(true)
    }
  }, [])

  const homeviewButtonsContainerClassName = user?.user.is_teacher && user?.teacherView ? "pn-nm" : "flex pb-nm"

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

      {(!user?.user.is_teacher || (user?.user.is_teacher && !user?.teacherView)) && (
        <Recommender />
      )}
      {(!userData.is_teacher || !userData.is_teacher[learningLanguage]) &&
        !userData.grade &&
        !userIsAnonymous &&
        userData.is_new_user && (
          <SetCEFRReminder
            open={openReminder}
            setOpen={setOpenReminder}
            newUser={userData.is_new_user}
          />
      )}
      <div className="grow flex-col">
        {bigScreen ? (
          <div className="grow flex-col space-between gap-row-nm">
            <div className={homeviewButtonsContainerClassName} style={{ gap: '1.5em' }}>
              <HomeviewButtons
                setPracticeModalOpen={setPracticeModalOpen}
                setAddStoryModalOpen={setAddStoryModalOpen}
                setLessonModalOpen={setLessonModalOpen}
                aTestIsEnabled={aTestIsEnabled}
                aReadingComprehensionEnabled={aReadingComprehensionEnabled}
              />
              {(!user?.user.is_teacher || (user?.user.is_teacher && !user?.teacherView)) && (
                <div
                  className="flex-col"
                  style={{
                    width: '350px',
                    gap: '1.9em',
                  }}
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
            {(!user?.user.is_teacher || (user?.user.is_teacher && !user?.teacherView)) && (
              <>
                <EloChart width="100%" />
                <LeaderboardSummary />
                <MedalSummary />
              </>
            )}
          </div>
        )}
        {hiddenFeatures && (<GeneralChatbot />)}
        {showFooter && <Footer />}
      </div>
    </div>
  )
}

export default HomeView
