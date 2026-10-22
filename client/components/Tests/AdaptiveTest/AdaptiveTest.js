import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTimer } from 'Utilities/reactTimerHookCompat'
import { Box } from '@mui/material'
import AppButton from 'Components/AppButton'
import AppProgressBar from 'Components/ui/AppProgressBar'
import { colors } from 'Assets/mui_theme/designTokens'
import { resetTests, sendAdaptiveTestAnswer, resumeAdaptiveTest } from 'Utilities/redux/testReducer'
import { learningLanguageSelector, images } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import MultipleChoice from '../MultipleChoice'
import Spinner from 'Components/Spinner'
import CustomTooltip from 'Components/CustomTooltip'

const TIMER_START_DELAY = 3000

// ":30" under a minute (the design), "1:05" above.
const formatSeconds = totalSeconds => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return minutes ? `${minutes}:${seconds}` : `:${seconds}`
}

// Round 36px timer control: the original SVG as drawn, no hover recolouring.
// forwardRef: it sits directly inside a tooltip, which anchors to its child by ref.
// `className` is merged, not overridden: a wrapping tooltip passes its own (often empty) one, which
// spread after ours used to drop the button's styles and leave a default grey button.
const TimerButton = React.forwardRef(
  ({ icon, label, onClick, pending, className = '', ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={onClick}
      {...rest}
      className={`adaptive-test-timer-button${pending ? ' pending' : ''} ${className}`.trim()}
    >
      <img src={icon} alt="" width={36} height={36} style={{ display: 'block' }} />
    </button>
  ),
)
TimerButton.displayName = 'TimerButton'

const AdaptiveTest = () => {
  const { controls: timer } = useTimer({
    initialTime: 30000,
    direction: 'backward',
    startImmediately: false,
    timeToUpdate: 100,
  })

  const { controls: overtimeTimer } = useTimer({
    initialTime: 0,
    direction: 'forward',
    startImmediately: false,
    timeToUpdate: 100,
  })

  const [willStop, setWillStop] = useState(false)
  const [willPause, setWillPause] = useState(false)
  const [displaySpinner, setDisplaySpinner] = useState(false)
  const [paused, setPaused] = useState(false)

  const {
    adaptiveTestSessionId,
    answerPending,
    answerFailure,
    currentAdaptiveQuestion,
    currentAdaptiveQuestionIndex,
    timedTest,
    cefrLevel,
  } = useSelector(({ tests }) => tests)

  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()

  const checkAnswer = choice => {
    if (!currentAdaptiveQuestion) return

    const timeToAnswer = currentAdaptiveQuestion.time
    const overTimeInSeconds = Math.round(overtimeTimer.getTime() / 1000)
    const duration =
      timer.getTime() < 0 ? timeToAnswer + overTimeInSeconds : timeToAnswer - timer.getTime() / 1000

    timer.stop()
    timer.reset()
    overtimeTimer.stop()
    overtimeTimer.reset()

    dispatch(
      sendAdaptiveTestAnswer(
        learningLanguage,
        adaptiveTestSessionId,
        choice.option,
        duration,
        currentAdaptiveQuestion.question_id,
        timedTest,
        willStop,
      ),
    )
  }

  useEffect(() => {
    if (Math.round(timer.getTime() / 1000) === 0) {
      overtimeTimer.start()
    }
  }, [timer.getTime()])

  useEffect(() => {
    if (!adaptiveTestSessionId) return
    if (!currentAdaptiveQuestion) {
      timer.stop()
    } else if (willPause) {
      setPaused(true)
      setWillPause(false)
    } else {
      timer.setTime(currentAdaptiveQuestion.time * 1000)
      if (currentAdaptiveQuestionIndex !== 0) setDisplaySpinner(true)
      setTimeout(() => {
        timer.start()
        setDisplaySpinner(false)
      }, TIMER_START_DELAY)
    }
  }, [currentAdaptiveQuestion])

  // Reset tests if user leaves
  useEffect(
    () => () => {
      dispatch(resetTests())
    },
    [],
  )

  const pauseTimer = () => {
    if (willPause) {
      setWillPause(false)
    } else {
      setWillPause(true)
    }
  }

  const handleTestResumeClick = () => {
    dispatch(resumeAdaptiveTest(learningLanguage, adaptiveTestSessionId))
  }

  const resumeTimer = () => {
    setPaused(false)
    setTimeout(() => {
      timer.reset()
      timer.start()
    }, TIMER_START_DELAY)
  }

  const totalQuestions = 80
  const step = currentAdaptiveQuestionIndex + 1
  const pct = (step / totalQuestions) * 100

  const progress =
    currentAdaptiveQuestionIndex + 1 >= 64
      ? 'green'
      : currentAdaptiveQuestionIndex + 1 >= 40
        ? 'yellow'
        : 'red'

  return (
    // `adaptive-test-screen` scopes the 2026 question-screen styles (custom.scss): MultipleChoice and
    // the `.test-*` classes are shared with the exhaustive test, which keeps its old look.
    <div className="cont adaptive-test-screen">
      <Box sx={{ position: 'relative' }}>
        <div className="align-center justify-center">
          <div className="test-container">
            {/* Question number, then the progress bar on the same row. */}
            <div className="adaptive-test-top-row">
              <div
                className="adaptive-test-question-number"
                data-cy="adaptive-test-question-number"
              >
                <FormattedHTMLMessage id="question" /> #{currentAdaptiveQuestionIndex + 1}
              </div>
              <AppProgressBar
                value={pct}
                height="10px"
                style={{ flex: 1 }}
                fillColor={
                  progress === 'green'
                    ? colors.green
                    : progress === 'yellow'
                      ? '#E8D08A'
                      : '#E0A9A9'
                }
              />
              {/* Timer controls inline at the end of the row. A pause / stop requested mid-question
                  takes effect after the answer, so the button greys out (`pending`) until then. */}
              {/* Stop in every test (timed or not): the test ends after the current answer and the
                  result shows, as when it finishes by itself. Pause and the countdown are timed only. */}
              <div className="adaptive-test-timer">
                {timedTest &&
                  (paused ? (
                    <TimerButton
                      icon={images.playTimer}
                      label="resume"
                      onClick={resumeTimer}
                      data-cy="adaptive-test-resume"
                    />
                  ) : (
                    <TimerButton
                      icon={images.pauseTimer}
                      label="pause"
                      onClick={pauseTimer}
                      pending={willPause}
                      data-cy="adaptive-test-pause"
                    />
                  ))}
                {/* What stopping means for the level: no estimate yet (~first 30 answers) vs the
                    current, still approximate one. */}
                <CustomTooltip
                  permanent
                  placement="top"
                  keyId={
                    cefrLevel
                      ? 'adaptive-test-stop-with-estimate'
                      : 'adaptive-test-stop-no-estimate'
                  }
                  values={cefrLevel ? { level: cefrLevel } : undefined}
                >
                  <TimerButton
                    icon={images.stopTimer}
                    label="stop"
                    onClick={() => setWillStop(true)}
                    pending={willStop}
                    data-cy="adaptive-test-stop"
                  />
                </CustomTooltip>
                {timedTest && (
                  <div className="adaptive-test-time" data-cy="adaptive-test-time">
                    {formatSeconds(Math.max(0, Math.round(timer.getTime() / 1000)))}
                  </div>
                )}
              </div>
            </div>
            {/* The provisional CEFR estimate is a bubble in the helper sidebar now (index.js). */}

            <div className="test-question-container">
              {willPause && !willStop && (
                <span className="test-info">
                  <FormattedMessage id="pause-after-you-answer-this-question" />
                </span>
              )}
              {willStop && (
                <span className="test-info">
                  <FormattedMessage id="quitting-after-this-question" />
                </span>
              )}
              {paused && (
                <div className="test-paused-text-cont">
                  <FormattedHTMLMessage id="paused-click-to-resume" />
                </div>
              )}

              {answerFailure && (
                <div className="justify-center mt-lg">
                  <AppButton onClick={handleTestResumeClick}>
                    <FormattedHTMLMessage id="network-error-click-to-resume" />
                  </AppButton>
                </div>
              )}
              {currentAdaptiveQuestion && !paused && !answerFailure && !displaySpinner && (
                <div>
                  <MultipleChoice
                    exercise={currentAdaptiveQuestion}
                    onAnswer={checkAnswer}
                    answerPending={answerPending}
                    outlineLastChoice
                  />
                </div>
              )}
              {displaySpinner && (
                <div className="test-question-spinner-container">
                  <Spinner inline size={60} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Box>
    </div>
  )
}

export default AdaptiveTest
