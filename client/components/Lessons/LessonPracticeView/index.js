import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { useParams, useHistory } from 'react-router-dom'
import { Segment, Icon, Checkbox } from 'semantic-ui-react'
import {
  clearFocusedSnippet,
  resetSnippets,
  resetCachedSnippets,
} from 'Utilities/redux/snippetsReducer'
import { updateShowReviewDiff } from 'Utilities/redux/userReducer'
import {
  setTouchedIds,
  setAnswers,
  setWillPause,
  setIsPaused,
} from 'Utilities/redux/practiceReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { clearContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import {
  getLessonInstance,
  clearLessonInstanceState,
} from 'Utilities/redux/lessonInstanceReducer'
import { resetAnnotations } from 'Utilities/redux/annotationsReducer'
import { useTimer } from 'react-compound-timer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getTextStyle, learningLanguageSelector, getMode, hiddenFeatures } from 'Utilities/common'
import PracticeChatbot from 'Components/ChatBot/PracticeChatbot'
import CurrentSnippet from 'Components/PracticeView/CurrentSnippet'
import DictionaryHelp from 'Components/DictionaryHelp'
import ReportButton from 'Components/ReportButton'
import AnnotationBox from 'Components/AnnotationBox'
import StartModal from 'Components/TimedActivityStartModal'
import PreviousSnippets from 'Components/CommonStoryTextComponents/PreviousSnippets'
import VirtualKeyboard from 'Components/PracticeView/VirtualKeyboard'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import { keyboardLayouts } from 'Components/PracticeView/KeyboardLayouts'
import ProgressBar from 'Components/PracticeView/CurrentSnippet/ProgressBar'
import PracticeTimer from 'Components/PracticeView/PracticeTimer'
import Footer from 'Components/Footer'
import ScrollArrow from 'Components/ScrollArrow'
import PracticeCompletedEncouragement from '../../Encouragements/PracticeCompletedEncouragement'
import LessonPracticeTopicsHelp from './LessonPracticeTopicsHelp'
import Spinner from 'Components/Spinner'

const LessonPracticeView = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const intl = useIntl()
  
  const { width } = useWindowDimensions()

  const { show_review_diff } = useSelector(({ user }) => user.data.user)
  
  const learningLanguage = useSelector(learningLanguageSelector)
  const snippets = useSelector(({ snippets }) => snippets)
  const { pending: lesson_instance_pending, lesson:lesson_instance } = useSelector(
    ({ lessonInstance }) => lessonInstance
  )
  const { isPaused, willPause, practiceFinished, currentAnswers } = useSelector(
    ({ practice }) => practice
  )
  
  const [startModalOpen, setStartModalOpen] = useState(false)
  const [showPracticeCompletedEncouragement, setShowPracticeCompletedEncouragement] =
    useState(false)
  const [currentSnippetNum, setCurrentSnippetNum] = useState(1)
  const [snippetsTotalNum, setSnippetsTotalNum] = useState(10)
  const [showDifficulty, setShowDifficulty] = useState(show_review_diff || false)

  const mode = getMode()
  const TIMER_START_DELAY = 2000
  const smallScreen = width < 700
  const timedExercise = snippets?.focused?.timed_exercise
  const controlledPractice = mode === 'controlled-practice'
  const isGroupLesson = history.location.pathname.includes('/group')
  const { id: groupId } = useParams()

  const { controls: timer } = useTimer({
    initialTime: null,
    direction: 'backward',
    startImmediately: false,
    timeToUpdate: 100,
  })

  useEffect(() => {
    setCurrentSnippetNum(0)
    if (isGroupLesson) {
      dispatch(getLessonInstance(groupId))
    }
    else dispatch(getLessonInstance())
    dispatch(clearTranslationAction())
    dispatch(clearContextTranslation())

    return () => {
      dispatch(clearLessonInstanceState())
      dispatch(resetSnippets())
      dispatch(resetCachedSnippets())
    }
  }, [])

  useEffect(() => {
    if (controlledPractice) setStartModalOpen(true)

    dispatch(resetAnnotations())
    timer.stop()
    timer.setTime(null)

    return () => {
      dispatch(clearFocusedSnippet())
    }
  }, [])

  useEffect(() => {
    setCurrentSnippetNum(snippets.previous.length + 1)
    // setSnippetsTotalNum(Math.floor(currentSnippetNum / 10) * 10 + 10)
  }, [snippets.focused])

  useEffect(() => {
    if (!snippets.testTime || !snippets.focused) return

    timer.setTime(snippets.testTime * 1000)

    if (startModalOpen) return

    if (!willPause && !isPaused) {
      setTimeout(() => {
        timer.start()
      }, TIMER_START_DELAY)
    } else {
      dispatch(setWillPause(false))
      timer.stop()
    }
  }, [currentSnippetNum])

  useEffect(() => {
    if (!isPaused) timer.start()
  }, [isPaused])

  const startOvertLessonSnippets = () => {
    setCurrentSnippetNum(0)
    // setSnippetsTotalNum(10)
    dispatch(clearLessonInstanceState())
    dispatch(resetSnippets())
    if (isGroupLesson) {
      dispatch(getLessonInstance(groupId))
    }
    else dispatch(getLessonInstance())
    dispatch(clearTranslationAction())
    dispatch(clearContextTranslation())
  }

  const handleAnswerChange = (value, word) => {
    const { surface, id: candidateId, ID, concept, sentence_id, snippet_id } = word

    dispatch(setTouchedIds(ID))

    const newAnswer = {
      [`${ID}-${candidateId}`]: {
        correct: surface,
        users_answer: value,
        word_id: ID,
        id: candidateId,
        story_id: word.story_id,
        sentence_id,
        snippet_id,
        concept,
        hintsRequested: currentAnswers[`${ID}-${candidateId}`]?.hintsRequested,
        requestedHintsList: currentAnswers[`${ID}-${candidateId}`]?.requestedHintsList,
        penalties: currentAnswers[`${ID}-${candidateId}`]?.penalties,
      },
    }

    dispatch(setAnswers(newAnswer))
  }

  const handlePauseOrResumeClick = () => {
    if (isPaused) {
      dispatch(setIsPaused(false))
    } else {
      dispatch(setWillPause(true))
    }
  }

  const updateUserReviewDiff = () => {
    dispatch(updateShowReviewDiff(!showDifficulty))
    setShowDifficulty(!showDifficulty)
  }

  const showVirtualKeyboard = width > 500 && keyboardLayouts[learningLanguage]
  const showFooter = width > 640

  const getTimerContent = () => {
    if (snippets.pending || !timer.getTime())
      return <Spinner variant="info" />
    if (practiceFinished) return <Icon size="small" name="thumbs up" style={{ margin: 0 }} />

    return Math.round(timer.getTime() / 1000)
  }

  if (!lesson_instance_pending && lesson_instance && lesson_instance?.lesson_id) {
    return (
      <div>
        <div className="cont-tall pt-sm flex-col space-between">
          <div className="justify-center">
            <div className="cont">
              <Segment>
                <div
                  className="progress-bar-cont"
                  style={{ top: smallScreen ? '.25em' : '3.25em' }}
                >
                  <ProgressBar
                    snippetProgress={currentSnippetNum}
                    snippetsTotal={snippetsTotalNum}
                    progress={(currentSnippetNum / snippetsTotalNum).toFixed(2)}
                  />
                </div>
                {/*timedExercise && (
                  <PracticeTimer
                    controlledPractice={controlledPractice}
                    timerContent={getTimerContent()}
                    showPauseButton={showPauseButton}
                    handlePauseOrResumeClick={handlePauseOrResumeClick}
                  />
                )*/}
                {/* <div
                  className="lesson-title"
                  style={{
                    ...getTextStyle(learningLanguage, 'title'),
                    width: `${'100%'}`,
                    'font-weight': 'bold',
                    'font-size': 'large',
                  }}
                >
                  {`Lesson ${lesson_instance.syllabus.syllabus_id}`}
                </div> */}
                {hiddenFeatures && <Checkbox
                  toggle
                  label={intl.formatMessage({ id: 'show-difficulty-level' })}
                  checked={showDifficulty}
                  onChange={updateUserReviewDiff}
                  style={{ paddingTop: '.5em', marginLeft: '.5em' }}
                />}
                <PreviousSnippets showDifficulty={showDifficulty} isLesson={true} />
                <hr />
                <CurrentSnippet
                  storyId={null}
                  handleInputChange={handleAnswerChange}
                  timer={timer}
                  // numSnippets={story?.paragraph?.length}
                  numSnippets={snippetsTotalNum}
                  lessonId={lesson_instance?.lesson_id}
                  groupId={groupId}
                  lessonStartOver={startOvertLessonSnippets}
                  currentSnippetNum={currentSnippetNum}
                  setShowPracticeCompletedEncouragement={setShowPracticeCompletedEncouragement}
                />
                <ScrollArrow />

                {willPause && !isPaused && (
                  <div
                    className="justify-center"
                    style={{ color: 'rgb(81, 138, 248)', fontWeight: '500' }}
                  >
                    <FormattedMessage id="pausing-after-this-snippet" />
                  </div>
                )}
              </Segment>

              {showVirtualKeyboard && (
                <div>
                  <VirtualKeyboard />
                </div>
              )}
              {width >= 500 ? (
                <div className="flex-col align-end">
                  <ReportButton />
                </div>
              ) : (
                <div className="mb-nm">
                  <ReportButton />
                </div>
              )}
            </div>
            <StartModal
              open={startModalOpen}
              setOpen={setStartModalOpen}
              activity="control-story"
              onBackClick={() => history.push('/library')}
            />
            {showPracticeCompletedEncouragement && (
              <div
                className={
                  width > 700 ? 'draggable-encouragement' : 'draggable-encouragement-mobile'
                }
              >
                <div className="col-flex">
                  <PracticeCompletedEncouragement
                    practiceType="lesson"
                    setShow={setShowPracticeCompletedEncouragement}
                    continueAction={startOvertLessonSnippets}
                  />
                </div>
              </div>
            )}
            <div className="dictionary-and-annotations-cont">
              <LessonPracticeTopicsHelp selectedTopics={snippets?.focused?.topics} />
              <DictionaryHelp />
              <AnnotationBox />
            </div>
            <PracticeChatbot />
            <FeedbackInfoModal />
          </div>
          {showFooter && <Footer />}
        </div>
      </div>
    )
  } else {
    return (
      <div className="cont-tall cont flex-col auto gap-row-sm" style={{ textAlign: 'center' }}>
        {'... Loading...'}
      </div>
    )
  }
}

export default LessonPracticeView
