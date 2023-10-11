import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { images, hiddenFeatures, supportedLearningLanguages } from 'Utilities/common'
import { useDispatch, useSelector } from 'react-redux'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { getAllStories } from 'Utilities/redux/storiesReducer'
import { openEncouragement } from 'Utilities/redux/encouragementsReducer'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import Footer from 'Components/Footer'
import AddStoryModal from 'Components/AddStoryModal'
import SetCEFRReminder from 'Components/SetCEFRReminder'
import BetaLanguageModal from 'Components/BetaLanguageModal'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { startTour } from 'Utilities/redux/tourReducer'
import { homeTourViewed } from 'Utilities/redux/userReducer'
import Recommender from 'Components/NewEncouragements/Recommender'
import MedalSummary from './MedalSummary'
import PracticeModal from './PracticeModal'
import EloChart from './EloChart'
import LeaderboardSummary from './LeaderboardSummary'

const HomeviewButton = ({
  imgSrc,
  altText,
  translationKey,
  handleClick,
  dataCy,
  wide,
  beta_feature,
}) => {
  return (
    <button
      className={`homeview-btn${wide ? ' homeview-btn-wide' : ' homeview-btn-narrow'}`}
      type="button"
      onClick={handleClick}
      data-cy={dataCy}
    >
      <div
        className={`align-center ${!wide ? 'flex-col space-between' : 'flex justify-center'}`}
        style={{ height: '100%' }}
      >
        <div style={{ width: '100%', display: 'inline-flex' }}>
          {/* <div style={{width: '7%'}}></div> */}
          <div className="homeview-btn-text" style={{ width: '100%' }}>
            <FormattedMessage id={translationKey} />
            {beta_feature && (
              <sup>
                <b style={{ color: 'red' }}>BETA</b>
              </sup>
            )}
          </div>
          {/* <div style={{width: '7%'}}>
            &beta;
          </div> */}
        </div>

        {!wide && <img src={imgSrc} alt={altText} style={{ maxWidth: '55%', maxHeight: '55%' }} />}
      </div>
    </button>
  )
}

const HomeviewButtons = ({
  setPracticeModalOpen,
  setAddStoryModalOpen,
  setLessonModalOpen,
  aTestIsEnabled,
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { hasTests, hasAdaptiveTests } = useSelector(({ metadata }) => metadata)
  const { user } = useSelector(({ user }) => ({ user: user.data }))

  const homeViewButtonsGridClassName = user?.user.is_teacher && user?.teacherView ? "teacher-homeview-btns-cont" : "student-homeview-btns-cont"

  return (
    <div className="">
      {(user?.user.is_teacher && user?.teacherView) && (
        <div className={homeViewButtonsGridClassName}>
          <div className="add-new-stories-btn-cont tour-add-new-stories">
            <HomeviewButton
              wide
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
            />
          </div>
          <div className="lesson-btn-cont tour-lesson">
            <HomeviewButton
              imgSrc={images.readingBook}
              altText="reading a book"
              translationKey="lesson-home-btn"
              beta_feature={true}
              handleClick={() => history.push('/lessons/library')}
            />
          </div>

          {hiddenFeatures && (
            <>
              <Button onClick={() => history.push('/test-construction')}>Grammar check</Button>
              <Button style={{ padding: '5em' }} onClick={() => history.push('test-debug')}>
                Feedback check
              </Button>
            </>
          )}
        </div>
      )}

      {(!user?.user.is_teacher || (user?.user.is_teacher && !user?.teacherView)) && (
        <div className={homeViewButtonsGridClassName}>
          <div className="practice-btn-cont tour-practice-now">
            <HomeviewButton
              // imgSrc={images.dices}
              // altText="two dices"
              imgSrc={images.diveIn}
              altText="dive in"
              translationKey="practice-now"
              handleClick={() => setPracticeModalOpen(true)}
              dataCy="practice-now"
            />
          </div>
          <div className="lesson-btn-cont tour-lesson">
            <HomeviewButton
              imgSrc={images.readingBook}
              altText="reading a book"
              translationKey="lesson-home-btn"
              beta_feature={true}
              handleClick={() => history.push('/lessons/library')}
            />
          </div>
          <div className="flashcards-btn-cont tour-flashcards">
            <HomeviewButton
              imgSrc={images.flashcards}
              altText="three playing cards"
              translationKey="Flashcards"
              handleClick={() => history.push('/flashcards')}
            />
          </div>

          {hasAdaptiveTests && (
            <div className="adaptive-test-btn-cont">
              <HomeviewButton
                imgSrc={images.adaptiveTest}
                altText="a test form with a star on it"
                translationKey="adaptive-test"
                handleClick={() => history.push('/adaptive-test')}
              />
            </div>
          )}
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
          {user.user.email !== 'anonymous_email' && (
            <>
              <HomeviewButton
                imgSrc={images.lightbulbIcon}
                altText="light bulb"
                translationKey="Recommendations"
                handleClick={() => dispatch(openEncouragement())}
              />
            </>
          )}

          <div>
            <HomeviewButton
              imgSrc={images.notesIcon}
              altText="post-it notes"
              translationKey="notes-library"
              handleClick={() => history.push('/notes-library')}
            />
          </div>

          {hiddenFeatures && (
            <>
              <Button onClick={() => history.push('/test-construction')}>Grammar check</Button>
              <Button style={{ padding: '5em' }} onClick={() => history.push('test-debug')}>
                Feedback check
              </Button>
            </>
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
      dispatch(sidebarSetOpen(false))
      dispatch(startTour())
    }
  }, [])

  const homeviewButtonsContainerClassName = user?.user.is_teacher && user?.teacherView ? "pn-nm" : "flex pb-nm"

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm pt-lg blue-bg">
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

      {!userData.is_teacher && !userData.grade && !userIsAnonymous && !userData.is_new_user && (
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
              />
              {(!user?.user.is_teacher || (user?.user.is_teacher && !user?.teacherView)) && (
                <div
                  className="flex-col"
                  style={{
                    width: '500px',
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
        {showFooter && <Footer />}
      </div>
    </div>
  )
}

export default HomeView
