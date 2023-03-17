import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { images, hiddenFeatures, supportedLearningLanguages } from 'Utilities/common'
import { dispatch, useDispatch, useSelector } from 'react-redux'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { getAllStories } from 'Utilities/redux/storiesReducer'
import { openEncouragement } from 'Utilities/redux/encouragementsReducer'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import Footer from 'Components/Footer'
import AddStoryModal from 'Components/AddStoryModal'
import SetCEFRReminder from 'Components/SetCEFRReminder'
import DefaultActivityModal from 'Components/Encouragements/DefaultActivityModal'
import BetaLanguageModal from 'Components/BetaLanguageModal'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { startTour } from 'Utilities/redux/tourReducer'
import { homeTourViewed } from 'Utilities/redux/userReducer'
import MedalSummary from './MedalSummary'
import PracticeModal from './PracticeModal'
import EloChart from './EloChart'
import LeaderboardSummary from './LeaderboardSummary'
import SelectLessonModal from 'Components/Lessons/SelectLessonModal'
import Recommender from 'Components/NewEncouragements/Recommender'

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

  return (
    <div className="homeview-btns-cont">
      <div className="add-new-stories-btn-cont tour-add-new-stories">
        <HomeviewButton
          wide
          translationKey="add-your-stories"
          handleClick={() => setAddStoryModalOpen(true)}
          dataCy="add-story-button"
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
          handleClick={() => history.push('/lessons/library')} // setLessonModalOpen(true)
        />
      </div>
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
      <div>
        <HomeviewButton
          imgSrc={images.notesIcon}
          altText="post-it notes"
          translationKey="notes-library"
          handleClick={() => history.push('/notes-library')}
        />
      </div>
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
      {hiddenFeatures && (
        <>
          <Button onClick={() => history.push('/test-construction')}>Test construction</Button>
          <Button style={{ padding: '5em' }} onClick={() => history.push('test-debug')}>
            Feedback debugger
          </Button>
        </>
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
  const showDAModal = open && homeView && userData?.grade && !userIsAnonymous
  const showWelcomeModal =
    open && welcomeView && !userIsAnonymous && !userData.is_new_user && userData.grade

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

  // Change this to true when developing new encouragement!
  // REMEMBER TO SWITCH BACK TO FALSE BEFORE PUSHING!!!
  const TESTING_NEW_ENCOURAGEMENT = false

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm pt-lg blue-bg">
      <AddStoryModal open={addStoryModalOpen} setOpen={setAddStoryModalOpen} />
      <PracticeModal open={practiceModalOpen} setOpen={setPracticeModalOpen} />
      <SelectLessonModal open={lessonModalOpen} setOpen={setLessonModalOpen} />
      <BetaLanguageModal
        open={betaModalOpen}
        setOpen={setBetaModalOpen}
        language={learningLanguage}
      />
      {TESTING_NEW_ENCOURAGEMENT && (
        <Recommender />
      )}
      {welcomeView && !TESTING_NEW_ENCOURAGEMENT && (
        <DefaultActivityModal
          open={showWelcomeModal}
          username={username}
          storiesCovered={storiesCovered}
          incompleteStories={incomplete}
          pending={loading}
          learningLanguage={learningLanguage}
          enable_recmd={enable_recmd}
          welcomeBack
        />
      )}
      {!TESTING_NEW_ENCOURAGEMENT && (
        <DefaultActivityModal
          open={showDAModal}
          username={username}
          storiesCovered={storiesCovered}
          incompleteStories={incomplete}
          pending={loading}
          learningLanguage={learningLanguage}
          enable_recmd={enable_recmd}
        />
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
            <div className="flex pb-nm" style={{ gap: '1.5em' }}>
              <HomeviewButtons
                setPracticeModalOpen={setPracticeModalOpen}
                setAddStoryModalOpen={setAddStoryModalOpen}
                setLessonModalOpen={setLessonModalOpen}
                aTestIsEnabled={aTestIsEnabled}
              />
              <div
                className="flex-col"
                style={{
                  width: '500px',
                  gap: '1em',
                }}
              >
                <EloChart width="100%" />
                <LeaderboardSummary />
                <MedalSummary />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-col" style={{ gap: '1.5em', marginBottom: '.5em' }}>
            <HomeviewButtons
              setPracticeModalOpen={setPracticeModalOpen}
              setAddStoryModalOpen={setAddStoryModalOpen}
              aTestIsEnabled={aTestIsEnabled}
            />
            <EloChart width="100%" />
            <LeaderboardSummary />
            <MedalSummary />
          </div>
        )}
        {showFooter && <Footer />}
      </div>
    </div>
  )
}

export default HomeView
