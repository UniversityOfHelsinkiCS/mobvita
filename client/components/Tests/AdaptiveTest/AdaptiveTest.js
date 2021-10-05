import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTimer } from 'react-compound-timer'
import { Icon } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import { resetTests, sendAdaptiveTestAnswer } from 'Utilities/redux/testReducer'
import { learningLanguageSelector } from 'Utilities/common'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import MultipleChoice from '../MultipleChoice'

const TIMER_START_DELAY = 2000

const AdaptiveTest = () => {
  const { controls: timer } = useTimer({
    initialTime: 20000,
    direction: 'backward',
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
    timer.stop()
    timer.reset()

    dispatch(
      sendAdaptiveTestAnswer(
        learningLanguage,
        adaptiveTestSessionId,
        answer,
        currentAdaptiveQuestion.question_id
      )
    )
  }

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

    timer.setCheckpoints([
      {
        time: 0,
        callback: () => {
          checkAnswer('')
        },
      },
    ])
  }, [currentAdaptiveQuestion])

  // Reset tests if user leaves
  useEffect(
    () => () => {
      dispatch(resetTests())
    },
    []
  )

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
    <div className="cont">
      <div className="space-between">
        <div className="test-container">
          <div className="test-top-info space-between">
            <div>#{currentAdaptiveQuestionIndex + 1}</div>
          </div>
          <div className="test-question-container">
            {willPause && (
              <span className="test-info">
                <FormattedMessage id="pause-after-you-answer-this-question" />
              </span>
            )}
            {paused && (
              <div className="test-prephrase">
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
        <div className="test-aside">
          <div
            className="test-counter"
            style={{
              fontWeight: 'bold',
              color: Math.round(timer.getTime() / 1000) <= 5 ? '#f3172d' : '#212529',
            }}
          >
            {Math.round(timer.getTime() / 1000)}
          </div>
          <div className="test-controls">
            <div>
              <Icon
                size="large"
                color={willPause ? 'grey' : 'blue'}
                name={paused ? 'play' : 'pause'}
                onClick={paused ? resumeTimer : pauseTimer}
                style={{ margin: '0.25em' }}
              />
              <Icon
                size="large"
                color="blue"
                name="stop"
                onClick={() => dispatch(resetTests())}
                style={{ margin: '0.25em' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdaptiveTest
