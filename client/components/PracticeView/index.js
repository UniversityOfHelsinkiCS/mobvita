import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useParams, useHistory } from 'react-router-dom'
import { Segment, Icon } from 'semantic-ui-react'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { clearFocusedSnippet } from 'Utilities/redux/snippetsReducer'
import { Spinner } from 'react-bootstrap'
import {
  setTouchedIds,
  setAnswers,
  setWillPause,
  setIsPaused,
} from 'Utilities/redux/practiceReducer'
import { resetAnnotations } from 'Utilities/redux/annotationsReducer'
import { useTimer } from 'react-compound-timer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getTextStyle, learningLanguageSelector, getMode } from 'Utilities/common'
import CurrentSnippet from 'Components/PracticeView/CurrentSnippet'
import DictionaryHelp from 'Components/DictionaryHelp'
import ReportButton from 'Components/ReportButton'
import AnnotationBox from 'Components/AnnotationBox'
import StartModal from 'Components/TimedActivityStartModal'
import PreviousSnippets from '../CommonStoryTextComponents/PreviousSnippets'
import VirtualKeyboard from './VirtualKeyboard'
import FeedbackInfoModal from '../CommonStoryTextComponents/FeedbackInfoModal'
import { keyboardLayouts } from './KeyboardLayouts'
import ProgressBar from './CurrentSnippet/ProgressBar'
import PracticeTimer from './PracticeTimer'
import Footer from '../Footer'
import ScrollArrow from '../ScrollArrow'

const PracticeView = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { id } = useParams()
  const { width } = useWindowDimensions()

  const snippets = useSelector(({ snippets }) => snippets)
  const { focused: story, pending } = useSelector(({ stories }) => stories)
  const { isPaused, willPause, practiceFinished } = useSelector(({ practice }) => practice)

  const [startModalOpen, setStartModalOpen] = useState(false)

  const smallScreen = width < 700
  const mode = getMode()
  const snippetsTotalNum = snippets?.focused?.total_num
  const controlledPractice = mode === 'controlled-practice'

  const TIMER_START_DELAY = 2000

  const currentSnippetId = () => {
    if (!snippets.focused) return -1
    const { snippetid } = snippets.focused
    return snippetid[snippetid.length - 1]
  }

  const currentSnippetNum = currentSnippetId() + 1

  const showPauseButton =
    (snippetsTotalNum - currentSnippetId() > 1 && !practiceFinished) ||
    (snippetsTotalNum - currentSnippetId() === 1 && isPaused)

  const { controls: timer } = useTimer({
    initialTime: null,
    direction: 'backward',
    startImmediately: false,
    timeToUpdate: 100,
  })

  useEffect(() => {
    if (!snippets.testTime || !snippets.focused) return

    timer.setTime(snippets.testTime * 1000)
    // timer.setTime(8000) // For testing with manual timer value

    if (!willPause && !isPaused && !startModalOpen) {
      setTimeout(() => {
        timer.start()
      }, TIMER_START_DELAY)
    } else {
      dispatch(setWillPause(false))
      timer.stop()
    }
  }, [currentSnippetId()])

  useEffect(() => {
    dispatch(getStoryAction(id, mode))
  }, [learningLanguage])

  useEffect(() => {
    if (!isPaused) timer.start()
  }, [isPaused])

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
    if (!startModalOpen) timer.start()
  }, [startModalOpen])

  if (!story) return null

  const handleAnswerChange = (value, word) => {
    const { surface, id, ID, concept } = word

    dispatch(setTouchedIds(ID))

    const newAnswer = {
      [ID]: {
        correct: surface,
        users_answer: value,
        id,
        concept,
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

  const showVirtualKeyboard = width > 500 && keyboardLayouts[learningLanguage]
  const showFooter = width > 640

  const getTimerContent = () => {
    if (snippets.pending || !timer.getTime())
      return <Spinner animation="border" variant="info" size="sm" />
    if (practiceFinished) return <Icon size="small" name="thumbs up" style={{ margin: 0 }} />

    return Math.round(timer.getTime() / 1000)
  }

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

            <PracticeTimer
              controlledPractice={controlledPractice}
              timerContent={getTimerContent()}
              showPauseButton={showPauseButton}
              handlePauseOrResumeClick={handlePauseOrResumeClick}
            />

            <div
              className="story-title"
              style={{
                ...getTextStyle(learningLanguage, 'title'),
                width: `${controlledPractice ? '75%' : '100%'}`,
              }}
            >
              {!pending && `${story.title}`}
            </div>
            {story.url && !pending && (
              <a target="blank" href={story.url}>
                <FormattedMessage id="Source" />
              </a>
            )}
            <PreviousSnippets />
            <hr />
            <CurrentSnippet
              storyId={id}
              handleInputChange={handleAnswerChange}
              timerValue={Math.round(timer.getTime() / 1000)}
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
}

export default PracticeView
