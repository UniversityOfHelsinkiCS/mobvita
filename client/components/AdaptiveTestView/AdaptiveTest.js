import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTimer } from 'react-compound-timer'
import { Icon } from 'semantic-ui-react'
import { finishTest, sendAdaptiveTestAnswer } from 'Utilities/redux/testReducer'
import { learningLanguageSelector } from 'Utilities/common'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import MultipleChoice from './MultipleChoice'

const TIMER_START_DELAY = 300

const AdaptiveTest = () => {
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
    sessionId,
    questions,
    currentIndex,
    answerPending,
    answerFailure,
    currentAdaptiveQuestion,
  } = useSelector(({ tests }) => tests)
  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()

  const checkAnswer = answer => {
    // if (!currentQuestion) return
    if (!currentAdaptiveQuestion) return
    timer.stop()
    timer.reset()

    const pauseTimeStamp = willPause ? new Date() : null

    dispatch(
      sendAdaptiveTestAnswer(
        learningLanguage,
        sessionId,
        answer,
        currentAdaptiveQuestion.question_id
      )
    )
  }

  // useEffect(() => {
  //   if (!sessionId) return
  //   if (!currentQuestion) {
  //     timer.stop()
  //     dispatch(finishTest(learningLanguage, sessionId))
  //   } else if (willStop) {
  //     timer.stop()
  //     dispatch(finishTest(learningLanguage, sessionId))
  //   } else if (willPause) {
  //     setPaused(true)
  //     setWillPause(false)
  //   } else {
  //     timer.setTime(currentQuestion.time * 1000)
  //     setTimeout(() => timer.start(), TIMER_START_DELAY)
  //     window.localStorage.setItem('testIndex', currentIndex)
  //   }

  //   timer.setCheckpoints([
  //     {
  //       time: 0,
  //       callback: () => {
  //         checkAnswer('')
  //       },
  //     },
  //   ])
  // }, [currentQuestion])

  useEffect(() => {
    if (!sessionId) return
    if (!currentAdaptiveQuestion) {
      timer.stop()
      // dispatch(finishTest(learningLanguage, sessionId))
    } else if (willStop) {
      timer.stop()
      // dispatch(finishTest(learningLanguage, sessionId))
    } else if (willPause) {
      setPaused(true)
      setWillPause(false)
    } else {
      timer.setTime(currentAdaptiveQuestion.time * 1000)
      setTimeout(() => timer.start(), TIMER_START_DELAY)
      // window.localStorage.setItem('testIndex', currentIndex)
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

  if (!currentAdaptiveQuestion) {
    return null
  }

  return (
    <div className="cont">
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
                <FormattedHTMLMessage id="paused-click-to-resume" />
              </div>
            )}
            {currentAdaptiveQuestion && !paused && !answerFailure && (
              <div>
                <MultipleChoice
                  exercise={currentAdaptiveQuestion}
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

export default AdaptiveTest
