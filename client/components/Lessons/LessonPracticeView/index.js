import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { useParams, useHistory } from 'react-router-dom'
import { Segment, Icon, Checkbox } from 'semantic-ui-react'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { clearFocusedSnippet, resetSnippets } from 'Utilities/redux/snippetsReducer'
import { updateShowReviewDiff } from 'Utilities/redux/userReducer'
import { Spinner } from 'react-bootstrap'
import { setTouchedIds, setAnswers, setWillPause, setIsPaused, } from 'Utilities/redux/practiceReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { getLessonActiveInstance, clearLessonInstanceState } from 'Utilities/redux/lessonInstanceReducer'
import { resetAnnotations } from 'Utilities/redux/annotationsReducer'
import { useTimer } from 'react-compound-timer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getTextStyle, learningLanguageSelector, getMode } from 'Utilities/common'
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

const LessonPracticeView = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const intl = useIntl()
  const { lesson_syllabus_id } = useParams()
  const { width } = useWindowDimensions()

  const { show_review_diff } = useSelector(({ user }) => user.data.user)
  const learningLanguage = useSelector(learningLanguageSelector)
  const snippets = useSelector(({ snippets }) => snippets)
  const { pending: lesson_instance_pending, lesson_instance } = useSelector(({ lessonInstance }) => lessonInstance)
  const { isPaused, willPause, practiceFinished, currentAnswers } = useSelector(({ practice }) => practice)

  const [ startModalOpen, setStartModalOpen ] = useState(false)
  const [ currentSnippetNum, setCurrentSnippetNum ] = useState(1)
  const [ snippetsTotalNum, setSnippetsTotalNum ] = useState(10)
  const [ showDifficulty, setShowDifficulty ] = useState(show_review_diff || false)
 
  const mode = getMode()
  const TIMER_START_DELAY = 2000
  const smallScreen = width < 700
  const timedExercise = snippets?.focused?.timed_exercise
  const controlledPractice = mode === 'controlled-practice'

  const { controls: timer } = useTimer({
    initialTime: null,
    direction: 'backward',
    startImmediately: false,
    timeToUpdate: 100,
  })

  useEffect(() => {
    setCurrentSnippetNum(0)
    dispatch(clearLessonInstanceState())
    dispatch(resetSnippets())
    // dispatch(clearExerciseState())
    if (lesson_syllabus_id){
      dispatch(getLessonActiveInstance(lesson_syllabus_id))
    }
    dispatch(clearTranslationAction())
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
    setSnippetsTotalNum(Math.floor(currentSnippetNum / 10)*10 + 10) // snippets?.focused?.total_num
  }, [snippets.focused])

  useEffect(() => {
    if (!snippets.testTime || !snippets.focused) return

    timer.setTime(snippets.testTime * 1000)
    // timer.setTime(10000) // For testing with manual timer value

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
    console.log("trigger start over")
    setCurrentSnippetNum(0)
    setSnippetsTotalNum(10)
    dispatch(clearLessonInstanceState())
    dispatch(resetSnippets())
    if (lesson_syllabus_id){
      dispatch(getLessonActiveInstance(lesson_syllabus_id))
    }
    dispatch(clearTranslationAction())
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
      return <Spinner animation="border" variant="info" size="sm" />
    if (practiceFinished) return <Icon size="small" name="thumbs up" style={{ margin: 0 }} />

    return Math.round(timer.getTime() / 1000)
  }

  if (!lesson_instance_pending && lesson_instance && lesson_instance?.lesson_id) {
    return (
      <div className="cont-tall pt-sm flex-col space-between">
        <div className="justify-center">
          <div className="cont">
            <Segment>
              <div className="progress-bar-cont" style={{ top: smallScreen ? '.25em' : '3.25em' }}>
                <ProgressBar
                  snippetProgress={currentSnippetNum}
                  snippetsTotal={snippetsTotalNum}
                  progress={(currentSnippetNum / snippetsTotalNum).toFixed(2)}
                />
              </div>
              {timedExercise && (
                <PracticeTimer
                  controlledPractice={controlledPractice}
                  timerContent={getTimerContent()}
                  showPauseButton={showPauseButton}
                  handlePauseOrResumeClick={handlePauseOrResumeClick}
                />
              )}
              <div
                className="lesson-title"
                style={{
                  ...getTextStyle(learningLanguage, 'title'),
                  width: `${'100%'}`,
                  'font-weight': 'bold',
                  'font-size': 'large',
                }}
              >
                {`Lesson ${lesson_instance.syllabus.syllabus_id}`}
                {/* <sup>
                  <b style={{color:'red'}}>&beta;</b>
                </sup> */}
              </div>
              <Checkbox
                toggle
                label={intl.formatMessage({ id: 'show-difficulty-level' })}
                checked={showDifficulty}
                onChange={updateUserReviewDiff}
                style={{ paddingTop: '.5em', marginLeft: '.5em' }}
              />
              <PreviousSnippets showDifficulty={showDifficulty} isLesson={true}/>
              <hr />
              <CurrentSnippet
                storyId={null}
                handleInputChange={handleAnswerChange}
                timer={timer}
                // numSnippets={story?.paragraph?.length}
                numSnippets={10}
                lessonId={lesson_instance?.lesson_id}
                lessonStartOver={startOvertLessonSnippets}
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
          <div className="dictionary-and-annotations-cont">
            <DictionaryHelp />
            <AnnotationBox />
          </div>
          <FeedbackInfoModal />
        </div>
        {showFooter && <Footer />}
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