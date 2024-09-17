import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import { Spinner, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { 
    sendReadingTestAnswer, 
    finishExhaustiveTest, 
    updateTestFeedbacks, 
    updateReadingTestElicitation,
    nextReadingTestQuestion,
    finishReadingTest,
    markAnsweredChoice,
    sendReadingTestQuestionnaireResponses,
} from 'Utilities/redux/testReducer'
import { 
  learningLanguageSelector, 
  confettiRain, 
  hiddenFeatures 
} from 'Utilities/common'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import ReadingTestMC from './ReadingTestMC'
import ReadingTestFeedbacks from './ReadingTestFeedbacks'
import ReadingTestSelfReflect from '././ReadingTestSelfReflect'
import ReadingTestElicationDialog from '././ReadingTestElicitationDialog'
import ReadingTestNextSetDialog from '././ReadingTestNextSetDialog'
import ReadingTestStats from '././ReadingTestStats'

import {
  getReadingTestQuestions,
} from 'Utilities/redux/testReducer'

const ReadingTest = () => {
  const [displaySpinner, setDisplaySpinner] = useState(false)
  const [paused, setPaused] = useState(false)

  const [showNextSetDialog, setShowNextSetDialog] = useState(false)

  const [receivedFeedback, setReceivedFeedback] = useState(0)
  const [showCorrect, setShowCorrect] = useState(false)
  const [questionDone, setQuestionDone] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState(null)
  const [attempts, setAttempts] = useState(0) 

  const [showFeedbacks, setShowFeedbacks] = useState(false)

  const [currentReadingSetLength, setCurrentReadingSetLength] = useState(0)
  const [firstMediationSelfReflectionDone, setFirstMediationSelfReflectionDone] = useState(false)
  const [showSelfReflect, setShowSelfReflect] = useState(false)
  
  const [showElicitDialog, setShowElicitDialog] = useState(false)
  const [currentElicatedConstruct, setCurrentElicatedConstruct] = useState(null)

  const [correctFirstAttempt, setCorrectFirstAttempt] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [correctAfterHints, setCorrectAfterHints] = useState(0)
  const [totalHints, setTotalHints] = useState(0)
  const [hintsUsedThisQuestion, setHintsUsedThisQuestion] = useState(0)
  const [startTime] = useState(Date.now())
  const [timeSpent, setTimeSpent] = useState(0)
  const [showStats, setShowStats] = useState(false)

  const {
    feedbacks,
    currentReadingTestQuestion,
    currentReadingSet,
    prevReadingSet,
    readingSetLength,
    readingTestSessionId,
    readingTestQuestions,
    currentReadingQuestionIndex,
    currentQuestionIdxinSet,
    answerPending,
    answerFailure,
  } = useSelector(({ tests }) => tests)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { groups } = useSelector(({ groups }) => groups)

  const history = useHistory()

  let in_experimental_grp = false;
  let in_control_grp = false;

  groups.forEach(group => {
    if (group.group_type === "experimental") {
      in_experimental_grp = true;
    }
    if (group.group_type === "control") {
      in_control_grp = true;
    }
  });
  
  if (in_control_grp == true) {
    in_experimental_grp = false;
  }

  const dispatch = useDispatch()

  const nextQuestion = () => {
    setShowCorrect(false)
    setQuestionDone(false)
    setShowFeedbacks(false)
    setShowElicitDialog(false)
    setShowSelfReflect(false)
    setCurrentAnswer(null)
    setCurrentElicatedConstruct(null)
    setAttempts(0)

    setTotalQuestions(prev => prev + 1) // Increase the total questions count

    if (currentReadingQuestionIndex === readingTestQuestions.length - 1){
      dispatch(finishReadingTest())
      setShowStats(true)
    } else {
      dispatch(nextReadingTestQuestion())
    }
    setHintsUsedThisQuestion(0) // Reset hints count for the next question
  }

  const restartTest = () => {
    dispatch(getReadingTestQuestions(learningLanguage, false));
  };

  const goToHomePage = () => {
    history.push('/home')
  }

  const submitSelfReflectionResponse = (response_json) => {
    dispatch(sendReadingTestQuestionnaireResponses(response_json, learningLanguage))
    if (response_json.is_end_set_questionair !== true){
      setFirstMediationSelfReflectionDone(true)
    }
    else {
      if (currentReadingQuestionIndex === readingTestQuestions.length - 1){
        goToHomePage()
      } else {
        setShowNextSetDialog(true)
      }
    }
    setShowSelfReflect(false)
    if (currentReadingSet !== prevReadingSet && prevReadingSet !== null && currentReadingSet !== null) {
      setReceivedFeedback(0)
    }
  }

  const submitElication = (eliciated_construct) => {
    dispatch(updateReadingTestElicitation(eliciated_construct))
    setCurrentElicatedConstruct(eliciated_construct)
    setShowElicitDialog(false)
  }

  const checkAnswer = choice => {
    if (!currentReadingTestQuestion) return
  
    if (in_control_grp) {
      setAttempts(prev => prev + 1)
    }
  
    setCurrentAnswer(choice)
  
    const countNotSelectedChoices = currentReadingTestQuestion.choices.filter(choice => choice.isSelected != true).length;
    const question_concept_feedbacks = currentReadingTestQuestion.question_concept_feedbacks[currentElicatedConstruct]
  
    if (choice.is_correct){
      if (in_experimental_grp) {
        confettiRain(0,0.45,60)
        confettiRain(1,0.45,120)
      }
  
      if (hintsUsedThisQuestion === 0) {
        setCorrectFirstAttempt(prev => prev + 1) // Track correct on first attempt
      }
  
      if (in_experimental_grp) {
        if (countNotSelectedChoices >= currentReadingTestQuestion.choices.length){
          dispatch(updateTestFeedbacks(choice.option, ["Correct!"]))
        } else {
          if (question_concept_feedbacks && question_concept_feedbacks?.synthesis){
            dispatch(updateTestFeedbacks(choice.option, question_concept_feedbacks?.synthesis))
          }
        }
      }
  
      setShowCorrect(true)
      setQuestionDone(true)
      setCurrentAnswer(null)
  
      dispatch(
        sendReadingTestAnswer(
            learningLanguage,
            readingTestSessionId,
            {
                type: currentReadingTestQuestion.type,
                question_id: currentReadingTestQuestion.question_id,
                answer: choice.option,
                seenFeedbacks: feedbacks,
                questionDone: true,
            }
        )
      )
    } else {
      if (in_experimental_grp) {
        setHintsUsedThisQuestion(prev => prev + 1) // Increment the hints used
      }
  
      if (choice.is_correct && hintsUsedThisQuestion > 0) {
        setCorrectAfterHints(prev => prev + 1) // Track correct after using hints
        setTotalHints(prev => prev + hintsUsedThisQuestion) // Add to total hints count
      }
    }

    const isSelectedChoice = currentReadingTestQuestion.choices.filter(ch => ch.option == choice.option)?.length
      ? currentReadingTestQuestion.choices.filter(ch => ch.option == choice.option)[0].isSelected
      : false;
    let markQuestionDone = questionDone;

    if (choice.is_correct == false && in_experimental_grp){
      if (question_concept_feedbacks === undefined || currentReadingTestQuestion.eliciated_construct === undefined){
        setShowElicitDialog(true)
      } else {
        const synthesis_feedback = question_concept_feedbacks && question_concept_feedbacks?.synthesis
          ? question_concept_feedbacks.synthesis
          : undefined;
        const itemFeedbacks = currentReadingTestQuestion.item_feedbacks
          ? Object.entries(currentReadingTestQuestion.item_feedbacks)
            .filter(([, value]) => value !== undefined)
            .map(([, value]) => value)
          : [];   
        const mediationFeedbacks = question_concept_feedbacks
          ? Object.entries(question_concept_feedbacks)
              .filter(([key]) => key.startsWith('mediation_'))
              .map(([, value]) => value)
          : [];
    
        if (choice.is_correct == false){
          if (countNotSelectedChoices > 2){
            const remainItemFeedbacks = itemFeedbacks.filter(feedback => !feedbacks.includes(feedback));
            const remainMediationFeedbacks = mediationFeedbacks.filter(feedback => !feedbacks.includes(feedback));
            if (remainMediationFeedbacks.length > 0){
              dispatch(updateTestFeedbacks(choice.option, remainMediationFeedbacks[0]))
              setReceivedFeedback(receivedFeedback + 1)
            } else { 
              if (remainItemFeedbacks.length > 0) {
                dispatch(updateTestFeedbacks(choice.option, remainItemFeedbacks[0]))
                setReceivedFeedback(receivedFeedback + 1)
              } else if (!feedbacks.includes(synthesis_feedback)) {
                dispatch(updateTestFeedbacks(choice.option, synthesis_feedback))
                setShowCorrect(true)
                setQuestionDone(true)
                markQuestionDone = true
              }
            }
          } else {
            dispatch(updateTestFeedbacks(choice.option, synthesis_feedback))
            setShowCorrect(true)
            setQuestionDone(true)
            setCurrentAnswer(null)
            markQuestionDone = true
          }
        }
      }
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
                questionDone: markQuestionDone
            }
        )
      )
      dispatch(markAnsweredChoice(choice.option))
    }

    if (in_control_grp) {
      if (attempts >= 1) {
        setQuestionDone(true)
        return
      }
    }
  }
  

  useEffect(() => {
    if (currentReadingQuestionIndex === readingTestQuestions.length - 1) {
      const endTime = Date.now()
      setTimeSpent(Math.floor((endTime - startTime) / 60000)) // Time in minutes
    }
  }, [currentReadingQuestionIndex, readingTestQuestions.length, startTime])

  useEffect(() => {
    setCurrentReadingSetLength(readingSetLength)
  }, [readingSetLength]);

  useEffect(() => {
    if (currentAnswer) {
      checkAnswer(currentAnswer)
    }
  }, [currentElicatedConstruct]);
  
  useEffect(() => {
    setShowFeedbacks(false)
    if (currentReadingSet !== null && prevReadingSet !== null && currentReadingSet !== prevReadingSet) {
      if (in_experimental_grp && receivedFeedback > 0) {
        setShowSelfReflect(true)
      }
      if (in_control_grp && receivedFeedback == 0) {
        setShowSelfReflect(true)
      }
    }
    setFirstMediationSelfReflectionDone(false)
  }, [currentReadingSet])

  useEffect(() => {
    if (feedbacks.length == 0){
      setShowFeedbacks(false)
    } else {
      setShowFeedbacks(true)
    }
  }, [feedbacks, currentReadingTestQuestion?.choices])

  useEffect(() => {
    if (!readingTestSessionId) return
    if (!currentReadingTestQuestion) {
      dispatch(finishExhaustiveTest(learningLanguage, readingTestSessionId))
    } 
    setCurrentElicatedConstruct(currentReadingTestQuestion ? currentReadingTestQuestion.eliciated_construct : null)
  }, [currentReadingTestQuestion])

  useEffect(() => () => checkAnswer(''), [])

  if (!currentReadingTestQuestion) {
    return null
  }

  const testContainerOverflow = displaySpinner ? { overflow: "hidden" } : { overflowY: "auto" };

  if (showStats) {
    const firstAttemptCorrectRate = (correctFirstAttempt / totalQuestions) * 100
    const overallCorrectRate = ((correctFirstAttempt + correctAfterHints) / totalQuestions) * 100
    const avgHintsUsed = totalHints / correctAfterHints

    return (
      <ReadingTestStats 
        correctFirstAttempt={correctFirstAttempt}
        firstAttemptCorrectRate={firstAttemptCorrectRate}
        overallCorrectRate={overallCorrectRate}
        avgHintsUsed={avgHintsUsed}
        totalQuestions={totalQuestions}
        timeSpent={timeSpent}
      />
    )
  }

  return (
    <div className="cont mt-nm">
      <Segment style={{ minHeight: '700px', borderRadius: '20px' }}>
        <div className="align-center justify-center">
          <div className="test-container" style={{width: '90%'}}>
            <ReadingTestNextSetDialog showNextSetDialog={showNextSetDialog} confirmNextSet={() => setShowNextSetDialog(false)} />
            <ReadingTestFeedbacks 
              showFeedbacks={showFeedbacks}
              closeFeedbacks={() => {
                setShowFeedbacks(false)
                if (firstMediationSelfReflectionDone === false && receivedFeedback > 0 && in_experimental_grp && currentQuestionIdxinSet < currentReadingSetLength && questionDone) {
                  setShowSelfReflect(true)
                }
              }}
            />
            <ReadingTestSelfReflect 
              currentReadingTestQuestion={currentReadingTestQuestion}
              currentReadingSet={currentReadingSet}
              prevReadingSet={prevReadingSet}
              readingSetLength={currentReadingSetLength}
              currentQuestionIdxinSet={currentQuestionIdxinSet}
              questionDone={questionDone}
              in_control_grp={in_control_grp}
              in_experimental_grp={in_experimental_grp}
              showSelfReflect={showSelfReflect}
              receieved_feedback={receivedFeedback}
              submitSelfReflection={submitSelfReflectionResponse}
            />
            <ReadingTestElicationDialog 
              question={currentReadingTestQuestion}
              showElication={showElicitDialog}
              submitElication={submitElication}
            />
            <div className="test-top-info space-between" style={{ marginBottom: '0.2em' }}>
              <div>
                <FormattedHTMLMessage id="question" />: {currentReadingQuestionIndex + 1} /{' '}
                {readingTestQuestions.length}
              </div>

              {feedbacks.length > 0 && (
                <Button
                  className="show-reading-feedbacks-button btn-secondary"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => setShowFeedbacks(true)}
                  disabled={showFeedbacks}
                >
                  <span>
                    <FormattedMessage id="show-feedback" />
                  </span>
                </Button>
              )}

              {questionDone && (
                <Button
                  className="next-reading-question-button btn-secondary"
                  style={{ marginLeft: '0.5em' }}
                  onClick={() => nextQuestion()}
                  disabled={!questionDone || showFeedbacks }
                >
                  <span>
                    {currentReadingQuestionIndex === readingTestQuestions.length - 1 ? (
                      <FormattedMessage id="finish-reading-question" />
                    ) : (
                      <FormattedMessage id="next-reading-question" />
                    )}
                  </span>
                </Button>
              )}
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
                    showSelfReflect={showSelfReflect}
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
            {hiddenFeatures && (
              <div className="test-top-info space-between" style={{ marginBottom: '0.2em' }}>
                <Button
                  className="restart-reading-test-button btn-secondary"
                  style={{ marginRight: 'auto', marginTop: '1rem' }}
                  onClick={() => restartTest()}
                  disabled={showFeedbacks}
                >
                  <span>
                    <FormattedMessage id="restart-reading-test" />
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </Segment>
    </div>
  )
}

export default ReadingTest
