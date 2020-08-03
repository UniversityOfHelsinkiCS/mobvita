import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTimer } from 'react-compound-timer'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { sendAnswer, finishTest } from 'Utilities/redux/testReducer'
import { learningLanguageSelector } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import MultipleChoice from './MultipleChoice'

const TIMER_START_DELAY = 300

const Test = () => {
  const { controls: timer } = useTimer({
    initialTime: 15000,
    direction: 'backward',
    startImmediately: false,
    timeToUpdate: 100,
  })

  const [willStop, setWillStop] = useState(false)
  const [willPause, setWillPause] = useState(false)
  const [paused, setPaused] = useState(false)
  const {
    currentQuestion,
    sessionId,
    questions,
    currentIndex,
    answerPending,
    answerFailure,
  } = useSelector(({ tests }) => tests)
  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()

  const checkAnswer = answer => {
    if (!currentQuestion) return
    timer.stop()
    timer.reset()

    const pauseTimeStamp = willPause ? new Date() : null

    dispatch(
      sendAnswer(
        learningLanguage,
        sessionId,
        {
          type: currentQuestion.type,
          question_id: currentQuestion.question_id,
          answer,
        },
        pauseTimeStamp
      )
    )
  }

  useEffect(() => {
    if (!sessionId) return
    if (!currentQuestion) {
      timer.stop()
      dispatch(finishTest(learningLanguage, sessionId))
    } else if (willStop) {
      timer.stop()
      dispatch(finishTest(learningLanguage, sessionId))
    } else if (willPause) {
      setPaused(true)
      setWillPause(false)
    } else {
      timer.setTime(currentQuestion.time * 1000)
      setTimeout(() => timer.start(), TIMER_START_DELAY)
      window.localStorage.setItem('testIndex', currentIndex)
    }

    timer.setCheckpoints([
      {
        time: 0,
        callback: () => {
          checkAnswer('')
        },
      },
    ])
  }, [currentQuestion])

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

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="component-container">
      <div className="space-between">
        <div className="test-container">
          <div className="test-top-info space-between">
            <div>
              {currentIndex + 1} / {questions.length}
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
                <FormattedMessage id="paused-click-to-resume-27ac769f5d88934067af4294483b9807" />
              </div>
            )}
            {currentQuestion && !paused && !answerFailure && (
              <div>
                <MultipleChoice
                  exercise={currentQuestion}
                  onAnswer={checkAnswer}
                  answerPending={answerPending}
                />
              </div>
            )}
          </div>
        </div>
        <div className="test-aside">
          <div
            className="test-counter"
            style={{ color: Math.round(timer.getTime() / 1000) <= 5 ? 'firebrick' : '#212529' }}
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
                style={{ marginRight: '0.25em' }}
              />
              <Icon size="large" color={willStop ? 'grey' : 'blue'} name="stop" onClick={stop} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Test
