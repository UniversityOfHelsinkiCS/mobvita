import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTimer } from 'react-compound-timer'
import { Button } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { getTestQuestions, sendAnswer, finishTest } from 'Utilities/redux/testReducer'
import { learningLanguageSelector } from 'Utilities/common'
import MultipleChoice from './MultipleChoice'

const ReportDisplay = ({ report }) => {
  const { message, correct, total } = report
  if (message !== 'OK') {
    return <div>{message}</div>
  }

  return (
    <div>Test completed. Your score: {correct}/{total}</div>
  )
}

const Test = () => {
  const { controls: timer } = useTimer({
    initialTime: 15000,
    direction: 'backward',
    startImmediately: false,
    timeToUpdate: 100,
  })

  const [timeoutId, setTimeoutId] = useState(null)
  const [willStop, setWillStop] = useState(false)
  const [willPause, setWillPause] = useState(false)
  const [paused, setPaused] = useState(false)
  const { currentQuestion, report, sessionId, pending } = useSelector(({ tests }) => tests)
  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTestQuestions(learningLanguage))
  }, [])

  useEffect(() => {
    if (!sessionId) return
    if (!currentQuestion) {
      clearTimeout(timeoutId)
      timer.stop()
      dispatch(finishTest(learningLanguage, sessionId))
    } else if (willStop) {
      setWillStop(false)
      timer.stop()
      dispatch(finishTest(learningLanguage, sessionId))
    } else if (willPause) {
      setPaused(true)
      setWillPause(false)
    } else {
      timer.setTime(currentQuestion.time * 1000)
      setTimeoutId(setTimeout(() => timer.start(), 300))
    }
  }, [currentQuestion])

  const checkAnswer = (answer) => {
    timer.stop()
    timer.reset()

    dispatch(sendAnswer(
      learningLanguage,
      sessionId,
      {
        type: currentQuestion.type,
        question_id: currentQuestion.question_id,
        answer,
      },
    ))
  }

  useEffect(() => {
    timer.setCheckpoints([
      {
        time: 0,
        callback: () => {
          checkAnswer('')
        },
      },
    ])
  }, [currentQuestion])

  const resetTest = () => {
    setPaused(false)
    setWillPause(false)
    timer.stop()
    timer.reset()
    dispatch(getTestQuestions(learningLanguage))
  }

  const pauseTimer = () => {
    setWillPause(true)
  }

  const resumeTimer = () => {
    setPaused(false)
    setTimeoutId(setTimeout(() => timer.start(), 300))
  }

  const stop = () => {
    setWillStop(true)
  }

  return (
    <div className="component-container">
      <div>{(Math.round(timer.getTime() / 1000))}</div>
      <Icon
        color={willPause ? 'grey' : 'black'}
        name={paused ? 'play' : 'pause'}
        onClick={paused ? resumeTimer : pauseTimer}
      />
      <Icon
        color={willStop ? 'grey' : 'black'}
        name="stop"
        onClick={stop}
      />
      {willPause && <span>timer will pause after this exercise</span>}
      {willStop && <span>ending test after this exercise</span>}
      {currentQuestion && !report && !paused && (
        <>
          <MultipleChoice
            exercise={currentQuestion}
            onAnswer={checkAnswer}
          />
        </>
      )}

      {paused && (
        <div>Timer paused, questions are hidden until timer starts again</div>
      )}

      {report && (
        <>
          <ReportDisplay report={report} />
          <Button onClick={resetTest}>New test</Button>
          <Link to="/tests"><Button>Back to menu</Button></Link>
        </>
      )}


    </div>
  )
}

export default Test
