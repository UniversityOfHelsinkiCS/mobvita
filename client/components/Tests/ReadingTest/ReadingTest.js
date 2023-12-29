import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import { Spinner, Button } from 'react-bootstrap'
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

  const [showCorrect, setShowCorrect] = useState(false)
  const [questionDone, setquestionDone] = useState(false)
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

  const nextQuestion = () => {
    setShowCorrect(false)
    setquestionDone(false)
    dispatch(nextReadingTestQuestion())
  }

  const checkAnswer = choice => {
    if (!currentReadingTestQuestion) return

    const isSelectedChoice = currentReadingTestQuestion.choices.filter(ch => ch.option == choice.option)?.length
      ? currentReadingTestQuestion.choices.filter(ch => ch.option == choice.option)[0].isSelected
      : false;
    const countNotSelectedChoices = currentReadingTestQuestion.choices.filter(choice => choice.isSelected != true).length;
    const synthesis_feedback = currentReadingTestQuestion.question_concept_feedbacks && currentReadingTestQuestion.question_concept_feedbacks?.synthesis
      ? currentReadingTestQuestion.question_concept_feedbacks.synthesis
      : undefined;
    const itemFeedbacks = currentReadingTestQuestion.item_feedbacks
      ? Object.entries(currentReadingTestQuestion.item_feedbacks)
        .filter(([, value]) => value !== undefined)
        .map(([, value]) => value)
      : [];   
    const mediationFeedbacks = currentReadingTestQuestion.question_concept_feedbacks
      ? Object.entries(currentReadingTestQuestion.question_concept_feedbacks)
          .filter(([key]) => key.startsWith('mediation_'))
          .map(([, value]) => value)
      : [];

    if (choice.is_correct == false){
      if (countNotSelectedChoices > 2){
        const remainItemFeedbacks = itemFeedbacks.filter(feedback => !feedbacks.includes(feedback));
        const remainMediationFeedbacks = mediationFeedbacks.filter(feedback => !feedbacks.includes(feedback));
        if (remainItemFeedbacks.length > 0){
          dispatch(updateTestFeedbacks(choice.option, remainItemFeedbacks[0]))
        } else { 
          if (remainMediationFeedbacks.length > 0) {
            dispatch(updateTestFeedbacks(choice.option, remainMediationFeedbacks[0]))
          } else if (!feedbacks.includes(synthesis_feedback)) {
            dispatch(updateTestFeedbacks(choice.option, synthesis_feedback))
            setShowCorrect(true)
            setquestionDone(true)
          }
        }
      } else {
        dispatch(updateTestFeedbacks(choice.option, synthesis_feedback))
        setShowCorrect(true)
        setquestionDone(true)
      }
    }

    if (choice.is_correct){
      setquestionDone(true)
    }

    if (choice.is_correct == true && synthesis_feedback != undefined && !feedbacks.includes(synthesis_feedback)) {
      dispatch(updateTestFeedbacks(choice.option, synthesis_feedback))
    }
    
    if (!isSelectedChoice){
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
    }
  }

  useEffect(() => {
    if (feedbacks.length == 0){
      setShowFeedbacks(false)
    } else {
      setShowFeedbacks(true)
    }
  }, [feedbacks, currentReadingTestQuestion.choices])

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
            <div className="test-top-info space-between" style={{ marginBottom: '0.2em' }}>
              <div>
                <FormattedHTMLMessage id="question" />: {currentReadingQuestionIndex + 1} /{' '}
                {readingTestQuestions.length}
              </div>
              <Button
                className="next-reading-question-button"
                onClick={() => nextQuestion()}
                disabled={showFeedbacks || currentReadingQuestionIndex == readingTestQuestions.length - 1}
                style={{ 
                    whiteSpace: 'pre-line', 
                    lineHeight: '1.0', 
                    padding: '0.6em',
                }}
              >
                  <span>
                      <FormattedMessage id="next-reading-question" />
                  </span>
              </Button>
            </div>
            <div className="test-question-container" style={testContainerOverflow}>
              {currentReadingTestQuestion && !paused && !answerFailure && !displaySpinner && (
                <div>
                  <ReadingTestMC
                    exercise={currentReadingTestQuestion}
                    onAnswer={checkAnswer}
                    answerPending={answerPending}
                    showFeedbacks={showFeedbacks}
                    showCorrect={showCorrect}
                    questionDone={questionDone}
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
