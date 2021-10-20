import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTimer } from 'react-compound-timer'
import { Icon } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import { sendExhaustiveTestAnswer, finishExhaustiveTest } from 'Utilities/redux/testReducer'
import { learningLanguageSelector } from 'Utilities/common'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import MultipleChoice from '../MultipleChoice'

const TIMER_START_DELAY = 2000

const Test = () => {
  const { controls: timer } = useTimer({
    initialTime: 20000,
    direction: 'backward',
    startImmediately: false,
    timeToUpdate: 100,
  })

  const [willStop, setWillStop] = useState(false)
  const [willPause, setWillPause] = useState(false)
  const [displaySpinner, setDisplaySpinner] = useState(false)
  const [paused, setPaused] = useState(false)
  const {
    currentExhaustiveTestQuestion,
    exhaustiveTestSessionId,
    exhaustiveTestQuestions,
    currentExhaustiveQuestionIndex,
    answerPending,
    answerFailure,
  } = useSelector(({ tests }) => tests)
  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()

  const checkAnswer = answer => {
    if (!currentExhaustiveTestQuestion) return

    const timeToAnswer = currentExhaustiveTestQuestion.time * 1000
    const duration = timer.getTime() < 0 ? timeToAnswer : timeToAnswer - timer.getTime()

    timer.stop()
    timer.reset()

    const pauseTimeStamp = willPause ? new Date() : null

    dispatch(
      sendExhaustiveTestAnswer(
        learningLanguage,
        exhaustiveTestSessionId,
        {
          type: currentExhaustiveTestQuestion.type,
          question_id: currentExhaustiveTestQuestion.question_id,
          answer,
        },
        duration,
        pauseTimeStamp
      )
    )
  }

  useEffect(() => {
    if (!exhaustiveTestSessionId) return
    if (!currentExhaustiveTestQuestion) {
      timer.stop()
      dispatch(finishExhaustiveTest(learningLanguage, exhaustiveTestSessionId))
    } else if (willStop) {
      timer.stop()
      dispatch(finishExhaustiveTest(learningLanguage, exhaustiveTestSessionId))
    } else if (willPause) {
      setPaused(true)
      setWillPause(false)
    } else {
      timer.setTime(currentExhaustiveTestQuestion.time * 1000)
      if (currentExhaustiveQuestionIndex !== 0) setDisplaySpinner(true)
      setTimeout(() => {
        timer.start()
        setDisplaySpinner(false)
      }, TIMER_START_DELAY)
      window.localStorage.setItem('testIndex', currentExhaustiveQuestionIndex)
    }

    timer.setCheckpoints([
      {
        time: 0,
        callback: () => {
          checkAnswer('')
        },
      },
    ])
  }, [currentExhaustiveTestQuestion])

  // Send an empty answer if user leaves test
  useEffect(() => () => checkAnswer(''), [])

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

  const stop = () => {
    if (willStop) {
      setWillStop(false)
    } else {
      setWillStop(true)
    }
  }

  if (!currentExhaustiveTestQuestion) {
    return null
  }

  return (
    <div className="cont">
      <div className="space-between">
        <div className="test-container">
          <div className="test-top-info space-between">
            <div>
              {currentExhaustiveQuestionIndex + 1} / {exhaustiveTestQuestions.length}
            </div>
          </div>
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
              <div className="test-prephrase">
                <FormattedHTMLMessage id="paused-click-to-resume" />
              </div>
            )}
            {currentExhaustiveTestQuestion && !paused && !answerFailure && !displaySpinner && (
              <div>
                <MultipleChoice
                  exercise={currentExhaustiveTestQuestion}
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
                color={willStop ? 'grey' : 'blue'}
                name="stop"
                onClick={stop}
                style={{ margin: '0.25em' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Test
