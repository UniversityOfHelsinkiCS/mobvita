import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTimer } from 'react-compound-timer'
import { Icon, Segment } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import { resetTests, sendAdaptiveTestAnswer } from 'Utilities/redux/testReducer'
import { learningLanguageSelector } from 'Utilities/common'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import MultipleChoice from '../MultipleChoice'

const TIMER_START_DELAY = 2000

const AdaptiveTest = ({ showingInfo }) => {
  const { controls: timer } = useTimer({
    initialTime: 20000,
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

  const [willPause, setWillPause] = useState(false)
  const [displaySpinner, setDisplaySpinner] = useState(false)
  const [paused, setPaused] = useState(false)
  const {
    adaptiveTestSessionId,
    answerPending,
    answerFailure,
    currentAdaptiveQuestion,
    currentAdaptiveQuestionIndex,
  } = useSelector(({ tests }) => tests)
  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()

  const checkAnswer = answer => {
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
        answer,
        duration,
        currentAdaptiveQuestion.question_id
      )
    )
  }

  useEffect(() => {
    if (Math.round(timer.getTime() / 1000) === 0) {
      overtimeTimer.start()
    }
  }, [timer.getTime()])

  useEffect(() => {
    if (!adaptiveTestSessionId || showingInfo) return
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
    []
  )

  useEffect(() => {
    if (!showingInfo) timer.start()
  }, [showingInfo])

  const pauseTimer = () => {
    if (willPause) {
      setWillPause(false)
    } else {
      setWillPause(true)
    }
  }

  const resumeTimer = () => {
    setPaused(false)
    setTimeout(() => timer.start(), TIMER_START_DELAY)
  }

  return (
    <div className="cont mt-nm">
      <Segment style={{ minHeight: '700px', borderRadius: '20px' }}>
        <div className="align-center justify-center">
          <div
            className="flex align-start"
            style={{ position: 'absolute', top: '1em', right: '1em', gap: '.5em' }}
          >
            <div className="test-controls">
              <div>
                <Icon
                  size="large"
                  color={willPause ? 'grey' : 'black'}
                  name={paused ? 'play' : 'pause'}
                  onClick={paused ? resumeTimer : pauseTimer}
                  style={{ margin: '0.25em' }}
                />
                <Icon
                  size="large"
                  name="stop"
                  onClick={() => dispatch(resetTests())}
                  style={{ margin: '0.25em' }}
                />
              </div>
            </div>
            <div
              className="test-counter"
              style={{
                fontSize: '2em',
                fontWeight: 'bold',
                color: '#212529',
                padding: 0,
              }}
            >
              {Math.round(timer.getTime() / 1000)}
            </div>
          </div>
          <div className="test-container">
            <div className="test-top-info space-between">
              <div className="bold">
                <FormattedHTMLMessage id="question" /> #{currentAdaptiveQuestionIndex + 1}
              </div>
            </div>
            <div className="test-question-container">
              {willPause && (
                <span className="test-info">
                  <FormattedMessage id="pause-after-you-answer-this-question" />
                </span>
              )}
              {paused && (
                <div className="test-paused-text-cont">
                  <FormattedHTMLMessage id="paused-click-to-resume" />
                </div>
              )}
              {currentAdaptiveQuestion && !paused && !answerFailure && !displaySpinner && (
                <div>
                  <MultipleChoice
                    exercise={currentAdaptiveQuestion}
                    onAnswer={checkAnswer}
                    answerPending={answerPending}
                  />
                </div>
              )}
              {displaySpinner && (
                <div className="test-question-spinner-container">
                  <Spinner animation="border" variant="info" size="lg" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Segment>
    </div>
  )
}

export default AdaptiveTest
