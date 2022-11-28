import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLessonInstance } from 'Utilities/redux/lessonInstanceReducer'
import { getTextStyle, learningLanguageSelector, getMode } from 'Utilities/common'
import { setAnswers, setTouchedIds } from 'Utilities/redux/practiceReducer'
import { Segment } from 'semantic-ui-react'
import { useParams } from 'react-router'

import useWindowDimensions from 'Utilities/windowDimensions'
import LessonExercise from './LessonExercise'


const LessonsPracticeView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, lesson_instance } = useSelector(({ lessonInstance }) => lessonInstance)
  const { isPaused, willPause, practiceFinished, currentAnswers } = useSelector(
    ({ practice }) => practice
  )

  const { lesson_syllabus_id } = useParams()
  const { width } = useWindowDimensions()
  const smallScreen = width < 700
  // const snippetsTotalNum = focused?.length

  useEffect(() => {
    dispatch(getLessonInstance(lesson_syllabus_id))
  }, [])
  console.log('lesson_instance', lesson_instance)

  const handleAnswerChange = (value, word) => {
    const { surface, id: candidateId, ID, story_id, concept, sentence_id, snippet_id } = word

    setTouchedIds(ID)

    const newAnswer = {
      [`${ID}-${candidateId}`]: {
        correct: surface,
        users_answer: value,
        word_id: ID,
        id: candidateId,
        story_id,
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

  if (!pending && lesson_instance && lesson_instance?.lesson_id) {
    return (
      <div className="cont-tall pt-sm flex-col space-between">
        <div className="justify-center">
          <div className="cont">
            <Segment>
              <div className="progress-bar-cont" style={{ top: smallScreen ? '.25em' : '3.25em' }}>
                {/* <ProgressBar
                  snippetProgress={currentSnippetNum}
                  snippetsTotal={snippetsTotalNum}
                  progress={(currentSnippetNum / snippetsTotalNum).toFixed(2)}
                /> */}
              </div>
              <div
                className="lesson-title"
                style={{
                  ...getTextStyle(learningLanguage, 'title'),
                  width: `${'100%'}`,
                }}
              >
                {!pending && `Lesson ${lesson_instance.syllabus.chapter}`}
              </div>
              <LessonExercise lesson_instance={lesson_instance} handleInputChange={handleAnswerChange} />
            </Segment>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="cont-tall cont flex-col auto gap-row-sm" style={{ textAlign: 'center' }}>
        {'... Loading...'}
      </div>
    )
  }
}

export default LessonsPracticeView
