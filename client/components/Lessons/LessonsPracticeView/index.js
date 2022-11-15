import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExerciseLesson } from 'Utilities/redux/lessonsReducer'
import { setAnswers } from 'Utilities/redux/practiceReducer'
import { Segment } from 'semantic-ui-react'
import { useParams } from 'react-router'
import useWindowDimensions from 'Utilities/windowDimensions'
import ProgressBar from 'Components/PracticeView/CurrentSnippet/ProgressBar'
import LessonExercise from './LessonExercise'

const LessonsPracticeView = () => {
  const dispatch = useDispatch()
  const lessons = useSelector(({ lessons }) => lessons)
  const { isPaused, willPause, practiceFinished, currentAnswers } = useSelector(
    ({ practice }) => practice
  )
  const { focused } = lessons
  const { id } = useParams()
  const { width } = useWindowDimensions()
  const smallScreen = width < 700
  // const snippetsTotalNum = focused?.length

  useEffect(() => {
    dispatch(getExerciseLesson(id))
  }, [])

  if (!focused) {
    return null
  }

  const handleAnswerChange = (value, word) => {
    const { surface, id: candidateId, ID, concept, sentence_id, snippet_id } = word
    
    const newAnswer = {
      [`${ID}-${candidateId}`]: {
        correct: surface,
        users_answer: value,
        word_id: ID,
        id: candidateId,
        story_id: id,
        sentence_id,
        snippet_id,
        concept,
        hintsRequested: currentAnswers[ID]?.hintsRequested,
        requestedHintsList: currentAnswers[ID]?.requestedHintsList,
        penalties: currentAnswers[ID]?.penalties,
      },
    }

    dispatch(setAnswers(newAnswer))
  }

  return (
    <div className="cont-tall pt-sm flex-col space-between">
      <div className="justify-center">
        <div className="cont">
          <Segment>
            {/*
            <div className="progress-bar-cont" style={{ top: smallScreen ? '.25em' : '3.25em' }}>
              <ProgressBar
                snippetProgress={currentSnippetNum}
                snippetsTotal={snippetsTotalNum}
                progress={(currentSnippetNum / snippetsTotalNum).toFixed(2)}
              />
  </div>*/}
            <LessonExercise lessonId={id} handleInputChange={handleAnswerChange} />
          </Segment>
        </div>
      </div>
    </div>
  )
}

export default LessonsPracticeView
