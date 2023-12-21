import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTimer } from 'react-compound-timer'
import { Icon, Segment } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import { 
    sendReadingTestAnswer, 
    finishExhaustiveTest, 
    updateTestFeedbacks, 
    nextReadingTestQuestion,
    markAnsweredChoice
} from 'Utilities/redux/testReducer'
import { learningLanguageSelector } from 'Utilities/common'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import ReadingTestMC from './ReadingTestMC'
import ReadingTestFeedbacks from './ReadingTestFeedbacks'

const TIMER_START_DELAY = 3000

const ReadingTest = () => {
  const [displaySpinner, setDisplaySpinner] = useState(false)
  const [paused, setPaused] = useState(false)
  const [showFeedbacks, setShowFeedbacks] = useState(false)
  const {
    feedbacks,
    currentReadingTestQuestion,
    readingTestSessionId,
    readingTestQuestions,
    currentReadingQuestionIndex,
    answerPending,
    answerFailure,
  } = useSelector(({ tests }) => tests)
  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()

  const checkAnswer = choice => {
    if (!currentReadingTestQuestion) return
    dispatch(
        sendReadingTestAnswer(
            learningLanguage,
            readingTestSessionId,
            {
                type: currentReadingTestQuestion.type,
                question_id: currentReadingTestQuestion.question_id,
                answer: choice.option,
                seenFeedbacks: feedbacks,
            }
        )
    )
    dispatch(markAnsweredChoice(choice.option))

    const countNotSelectedChoices = currentReadingTestQuestion.choices.filter(choice => choice.isSelected != true).length;
    if (
      !choice.is_correct &&
      countNotSelectedChoices > 0 &&
      (currentReadingTestQuestion.question_concept_feedbacks || 
      (choice.item_feedbacks && Object.keys(choice.item_feedbacks).length !== 0))
    ) {
      let mediationFeedbacks = Object.entries(currentReadingTestQuestion.question_concept_feedbacks)
        .filter(([key]) => key.startsWith('mediation_'))
        .map(([, value]) => value);
      const remainFeedbacks = mediationFeedbacks.filter(feedback => !feedbacks.includes(feedback));

      // if (
      //   choice.item_feedbacks && 
      //   currentReadingTestQuestion?.concept_id && 
      //   choice.item_feedbacks[currentReadingTestQuestion?.concept_id]
      // ) {
      //     mediationFeedbacks.push(choice.item_feedbacks[currentReadingTestQuestion?.concept_id])
      // }

      if (remainFeedbacks.length > 0){
        dispatch(updateTestFeedbacks(choice.option, remainFeedbacks[0]))
        setShowFeedbacks(true)
      } else {
        dispatch(nextReadingTestQuestion())
        setShowFeedbacks(false)
      }
    } else {
      dispatch(nextReadingTestQuestion())
      setShowFeedbacks(false)
    }
  }

  useEffect(() => {
    if (!readingTestSessionId) return
    if (!currentReadingTestQuestion) {
      dispatch(finishExhaustiveTest(learningLanguage, readingTestSessionId))
    } 
  }, [currentReadingTestQuestion])

  useEffect(() => {
    if (!readingTestSessionId) return
  }, [currentReadingTestQuestion])

  // Send an empty answer if user leaves test
  useEffect(() => () => checkAnswer(''), [])

  if (!currentReadingTestQuestion) {
    return null
  }

  const testContainerOverflow = displaySpinner ? { overflow: "hidden" } : { overflowY: "auto" };

  return (
    <div className="cont mt-nm">
      <Segment style={{ minHeight: '700px', borderRadius: '20px' }}>
        <div className="align-center justify-center">
          <div className="test-container" style={{width: '90%'}}>
            <ReadingTestFeedbacks 
              showFeedbacks={showFeedbacks}
              closeFeedbacks={() => {setShowFeedbacks(false)}}
            />
            <div className="test-top-info space-between">
              <div>
                <FormattedHTMLMessage id="question" />: {currentReadingQuestionIndex + 1} /{' '}
                {readingTestQuestions.length}
              </div>
            </div>
            <div className="test-question-container" style={testContainerOverflow}>
              {currentReadingTestQuestion && !paused && !answerFailure && !displaySpinner && (
                <div>
                  <ReadingTestMC
                    exercise={currentReadingTestQuestion}
                    onAnswer={checkAnswer}
                    answerPending={answerPending}
                    showFeedbacks={showFeedbacks}
                    closeFeedbacks={() => {setShowFeedbacks(false)}}
                  />
                </div>
              )}
              {displaySpinner && (
                <div className="test-question-spinner-container" style={{ overflow: 'hidden' }}>
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

export default ReadingTest
