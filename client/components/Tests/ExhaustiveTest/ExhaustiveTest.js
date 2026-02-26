import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTimer } from 'react-compound-timer'
import { Icon, Segment } from 'semantic-ui-react'
import { 
  sendExhaustiveTestAnswer, 
  finishExhaustiveTest, 
  updateTestFeedbacks, 
  nextTestQuestion,
  markAnsweredChoice
} from 'Utilities/redux/testReducer'
import { learningLanguageSelector } from 'Utilities/common'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import MultipleChoice from '../MultipleChoice'
import Spinner from 'Components/Spinner'

const TIMER_START_DELAY = 3000

const ExhaustiveTest = ({ showingInfo }) => {
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
    feedbacks,
    currentExhaustiveTestQuestion,
    exhaustiveTestSessionId,
    exhaustiveTestQuestions,
    currentExhaustiveQuestionIndex,
    answerPending,
    answerFailure,
  } = useSelector(({ tests }) => tests)
  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()

  const checkAnswer = choice => {
    if (!currentExhaustiveTestQuestion) return

    const timeToAnswer = currentExhaustiveTestQuestion.time
    const overTimeInSeconds = Math.round(overtimeTimer.getTime() / 1000)
    const duration =
      timer.getTime() < 0 ? timeToAnswer + overTimeInSeconds : timeToAnswer - timer.getTime() / 1000

    timer.stop()
    timer.reset()
    overtimeTimer.stop()
    overtimeTimer.reset()

    const pauseTimeStamp = willPause ? new Date() : null

    dispatch(
      sendExhaustiveTestAnswer(
        learningLanguage,
        exhaustiveTestSessionId,
        {
          type: currentExhaustiveTestQuestion.type,
          question_id: currentExhaustiveTestQuestion.question_id,
          answer: choice.option,
          seenFeedbacks: feedbacks,
        },
        duration,
        pauseTimeStamp
      )
    )
    dispatch(markAnsweredChoice(choice.option))

    const countNotSelectedChoices = currentExhaustiveTestQuestion.choices.filter(choice => choice.isSelected != true).length;
    if (
      !choice.is_correct &&
      countNotSelectedChoices > 0 &&
      (currentExhaustiveTestQuestion.question_concept_feedbacks || 
      (choice.item_feedbacks && Object.keys(choice.item_feedbacks).length !== 0))
    ) {
      let mediationFeedbacks = Object.entries(currentExhaustiveTestQuestion.question_concept_feedbacks)
        .filter(([key]) => key.startsWith('mediation_'))
        .map(([, value]) => value);
      const remainFeedbacks = mediationFeedbacks.filter(feedback => !feedbacks.includes(feedback));

      // if (
      //   choice.item_feedbacks && 
      //   currentExhaustiveTestQuestion?.concept_id && 
      //   choice.item_feedbacks[currentExhaustiveTestQuestion?.concept_id]
      // ) {
      //     mediationFeedbacks.push(choice.item_feedbacks[currentExhaustiveTestQuestion?.concept_id])
      // }
      if (remainFeedbacks.length > 0){
        dispatch(updateTestFeedbacks(choice.option, remainFeedbacks[0]))
      } else {
        dispatch(nextTestQuestion())
      }
    } else {
      dispatch(nextTestQuestion())
    }
  }

  useEffect(() => {
    if (!exhaustiveTestSessionId || showingInfo) return
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
  }, [currentExhaustiveTestQuestion])

  // Send an empty answer if user leaves test
  useEffect(() => () => checkAnswer(''), [])

  useEffect(() => {
    if (Math.round(timer.getTime() / 1000) === 0) {
      overtimeTimer.start()
    }
  }, [timer.getTime()])

  const pauseTimer = () => {
    if (willPause) {
      setWillPause(false)
    } else {
      setWillPause(true)
    }
  }

  useEffect(() => {
    if (!showingInfo) timer.start()
  }, [showingInfo])

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

  const testContainerOverflow = displaySpinner ? { overflow: "hidden" } : { overflowY: "auto" };

  return (
    <div className="cont mt-nm">
      <Segment style={{ minHeight: '700px', borderRadius: '20px' }}>
        <div className="align-center justify-center">
          <div
            className="flex align-start"
            style={{ position: 'absolute', top: '1em', right: '1em', gap: '.5em' }}
          >
            <div className="test-controls">
              <Icon
                size="large"
                color={willPause ? 'grey' : 'black'}
                name={paused ? 'play' : 'pause'}
                onClick={paused ? resumeTimer : pauseTimer}
                style={{ margin: '0.25em' }}
              />
              <Icon
                size="large"
                color={willStop ? 'grey' : 'black'}
                name="stop"
                onClick={stop}
                style={{ margin: '0.25em' }}
              />
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
              <div>
                <FormattedHTMLMessage id="question" />: {currentExhaustiveQuestionIndex + 1} /{' '}
                {exhaustiveTestQuestions.length}
              </div>
            </div>
            <div className="test-question-container" style={testContainerOverflow}>
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
                <div className="test-question-spinner-container" style={{ overflow: 'hidden' }}>
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </div>
      </Segment>
    </div>
  )
}

export default ExhaustiveTest
