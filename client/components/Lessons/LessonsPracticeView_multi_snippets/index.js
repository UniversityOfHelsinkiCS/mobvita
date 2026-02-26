import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Segment, Divider } from 'semantic-ui-react'

import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { clearContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import { getLessonInstance, clearLessonInstanceState } from 'Utilities/redux/lessonInstanceReducer'
import { clearExerciseState } from 'Utilities/redux/lessonExercisesReducer'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { setAnswers, setTouchedIds } from 'Utilities/redux/practiceReducer'

import AnnotationBox from 'Components/AnnotationBox'
import DictionaryHelp from 'Components/DictionaryHelp'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import ProgressBar from '../../PracticeView/CurrentSnippet/ProgressBar'
import useWindowDimensions from 'Utilities/windowDimensions'
import LessonExercise from './LessonExercise'

const LessonsPracticeView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, lesson_instance } = useSelector(({ lessonInstance }) => lessonInstance)
  const { previous_snippets, lesson_exercises } = useSelector(
    ({ lessonExercises }) => lessonExercises
  )
  const { currentAnswers, previousAnswers, attempt } = useSelector(({ practice }) => practice)

  const { lesson_syllabus_id } = useParams()
  const { width } = useWindowDimensions()
  const smallScreen = width < 700

  const [currentSnippetNum, setCurrentSnippetNum] = useState(0)
  const [snippetsTotalNum, setsnippetsTotalNum] = useState(0)

  useEffect(() => {
    dispatch(clearLessonInstanceState())
    dispatch(clearExerciseState())
    dispatch(getLessonInstance())
    dispatch(clearTranslationAction())
    dispatch(clearContextTranslation())
  }, [])

  useEffect(() => {
    setCurrentSnippetNum(previous_snippets ? previous_snippets.length + 1 : 1)
    setsnippetsTotalNum(lesson_exercises ? lesson_exercises.length : 1)
  }, [previous_snippets, lesson_exercises])

  const handleAnswerChange = (value, word) => {
    const { surface, id: candidateId, ID, story_id, concept, sentence_id, snippet_id } = word
    const word_cue = currentAnswers[`${ID}-${candidateId}`]?.cue

    setTouchedIds(ID)

    const newAnswer = {
      [`${ID}-${candidateId}`]: {
        correct: surface,
        users_answer: value,
        cue: word_cue,
        word_id: ID,
        id: candidateId,
        story_id,
        sentence_id,
        snippet_id,
        concept,
        hintsRequested: currentAnswers[`${ID}-${candidateId}`]?.hintsRequested,
        requestedHintsList: currentAnswers[`${ID}-${candidateId}`]?.requestedHintsList,
        penalties: currentAnswers[`${ID}-${candidateId}`]?.penalties,
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
                <ProgressBar
                  snippetProgress={
                    currentSnippetNum > snippetsTotalNum ? snippetsTotalNum : currentSnippetNum
                  }
                  snippetsTotal={snippetsTotalNum}
                  progress={(currentSnippetNum / snippetsTotalNum).toFixed(2)}
                />
              </div>
              <div
                className="lesson-title"
                style={{
                  ...getTextStyle(learningLanguage, 'title'),
                  width: `${'100%'}`,
                  'font-weight': 'bold',
                  'font-size': 'large',
                }}
              >
                {!pending && `Lesson ${lesson_instance.syllabus.syllabus_id}`}
              </div>
              <Divider />
              {previous_snippets?.map((snippet, index) => (
                <div className="pt-nm" style={getTextStyle(learningLanguage)}>
                  <TextWithFeedback
                    key={index}
                    snippet={snippet.sent}
                    answers={previousAnswers}
                    mode="practice"
                    style={' display: block'}
                  />
                  <Divider />
                </div>
              ))}
              <LessonExercise
                lesson_instance={lesson_instance}
                handleInputChange={handleAnswerChange}
              />
            </Segment>
          </div>
          <div className="dictionary-and-annotations-cont">
            <DictionaryHelp />
            <AnnotationBox />
          </div>
          <FeedbackInfoModal />
        </div>
      </div>
    )
  } else {
    return (
      <Spinner fullHeight size={60} />
    )
  }
}

export default LessonsPracticeView
