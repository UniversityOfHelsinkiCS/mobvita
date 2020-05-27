import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTimer } from 'react-compound-timer'
import { Button } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { getTestQuestions, sendAnswer, getTestResults } from 'Utilities/redux/testReducer'
import MultipleChoice from './MultipleChoice'

const Test = () => {
  const { controls: timer } = useTimer({
    initialTime: 15000,
    direction: 'backward',
    startImmediately: false,
    timeToUpdate: 100,
  })

  const [timeoutId, setTimeoutId] = useState(null)
  const [willPause, setWillPause] = useState(false)
  const [paused, setPaused] = useState(false)
  const { currentQuestion, report } = useSelector(({ tests }) => tests)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTestQuestions())
  }, [])

  useEffect(() => {
    if (!currentQuestion) {
      clearTimeout(timeoutId)
      timer.stop()
      dispatch(getTestResults())
    } else if (willPause) {
      setPaused(true)
      setWillPause(false)
    } else {
      setTimeoutId(setTimeout(() => timer.start(), 300))
    }
  }, [currentQuestion])

  const checkAnswer = (answer) => {
    timer.stop()
    timer.reset()
    dispatch(sendAnswer(answer))
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
  }, [])

  const resetTest = () => {
    setPaused(false)
    setWillPause(false)
    timer.stop()
    timer.reset()
    dispatch(getTestQuestions())
  }

  const pauseTimer = () => {
    setWillPause(true)
  }

  const resumeTimer = () => {
    setPaused(false)
    setTimeoutId(setTimeout(() => timer.start(), 300))
  }

  return (
    <div className="component-container">

      <h3>Test</h3>
      <div>{(Math.round(timer.getTime() / 100) / 10).toFixed(1)}</div>
      <Icon
        color={willPause ? 'grey' : 'black'}
        name={paused ? 'play' : 'pause'}
        onClick={paused ? resumeTimer : pauseTimer}
      />
      {willPause && <span>timer will pause after this exercise</span>}
      {currentQuestion && !paused && (
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

      {!currentQuestion && (
        <>
          <div>Test ended</div>
          <div>Report: {report}</div>
          <Button onClick={resetTest}>New test</Button>
          <Link to="/tests"><Button>Back to menu</Button></Link>
        </>
      )}


    </div>
  )
}

export default Test
