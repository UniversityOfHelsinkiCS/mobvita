import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTimer } from 'react-compound-timer'
import { getTestQuestions, nextQuestion } from 'Utilities/redux/testReducer'

const TestView = () => {
  const { controls: timer } = useTimer({
    initialTime: 15000,
    direction: 'backward',
    startImmediately: false,
  })
  const [visible, setVisible] = useState(true)
  const [answer, setAnswer] = useState('')
  const { ready, currentQuestion } = useSelector(({ tests }) => tests)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTestQuestions())
  }, [])

  useEffect(() => {
    if (ready) {
      dispatch(nextQuestion())
      timer.start()
    }
  }, [ready])

  useEffect(() => {
    if (ready && !currentQuestion) {
      timer.stop()
      setVisible(false)
    } else {
      timer.start()
    }
  }, [currentQuestion])

  const checkAnswer = () => {
    timer.reset()
    dispatch(nextQuestion())
    setAnswer('')
  }

  const submit = (event) => {
    event.preventDefault()
    checkAnswer()
  }

  useEffect(() => {
    timer.setCheckpoints([
      {
        time: 0,
        callback: () => {
          checkAnswer()
        },
      },
    ])
  }, [answer])

  return (
    <div className="component-container">

      <div>{Math.round(timer.getTime() / 1000) - 1}</div>
      <h1>hello</h1>

      {visible && (
        <form onSubmit={submit}>
          <span>{currentQuestion}</span>
          <input value={answer} type="text" onChange={e => setAnswer(e.target.value)} />
          <button type="submit">answer </button>
        </form>
      )}

      {!visible && (
        <div>Test ended</div>
      )}
    </div>
  )
}

export default TestView
