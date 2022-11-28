import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExerciseLesson } from 'Utilities/redux/lessonExercisesReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { resetSessionId } from 'Utilities/redux/snippetsReducer'
import {
  setAnswers,
  clearPractice,
  addToOptions,
  addToAudio,
  setTouchedIds
} from 'Utilities/redux/practiceReducer'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { Divider } from 'semantic-ui-react'
import PracticeText from './PracticeText'
import LessonExerciseActions from './LessonExerciseActions'

const LessonExercise = ({ lesson_instance, handleInputChange }) => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const practiceForm = useRef(null)
  
  const lessonExercises = useSelector(({ lessonExercises }) => lessonExercises.lesson_exercises)
  const [exerciseCount, setExerciseCount] = useState(0)
  
  const getExerciseCount = () => {
    let count = 0
    lessonExercises.forEach(sentence => {
      sentence.sent.forEach(word => {
        if (word.id) {
          count++
        }
      })
    })
    return count
  }
  
  const getExerciseTokens = () => {
    let tokens = []
    lessonExercises?.forEach(sentence => {
      sentence.sent.forEach(word => {
        if (word.id) {
          tokens = tokens.concat({
            ...word,
            story_id: sentence.story_id, 
          })
        }
      })
    })

    return tokens
  }

  const setInitialAnswers = () => {
    if (lessonExercises) {
      const filteredSnippet = getExerciseTokens()
      const initialAnswers = filteredSnippet.reduce((answerObject, currentWord) => {
        const {
          surface,
          id,
          ID,
          base,
          bases,
          listen,
          choices,
          concept,
          audio,
          sentence_id,
          snippet_id,
          story_id,
        } = currentWord

        let usersAnswer
        if (listen || choices) {
          usersAnswer = ''
        } else {
          usersAnswer = base || bases
        }

        if (choices) {
          dispatch(
            addToOptions({
              [`${ID}-${id}`]: {
                distractors: choices,
                snippet_id,
                sentence_id,
                id,
                word_id: ID,
                story_id,
              },
            })
          )
        }

        if (listen) {
          dispatch(
            addToAudio({
              [`${ID}-${id}`]: {
                context: audio,
                snippet_id,
                sentence_id,
                id,
                word_id: ID,
                story_id,
              },
            })
          )
        }

        return {
          ...answerObject,
          [`${ID}-${id}`]: {
            correct: surface,
            users_answer: usersAnswer,
            id,
            concept,
            sentence_id,
            snippet_id,
            story_id,
            word_id: ID,
          },
        }
      }, {})
      if (Object.keys(initialAnswers).length > 0) dispatch(setAnswers({ ...initialAnswers }))
      setExerciseCount(getExerciseCount())
      /*
      if (snippets?.lessonExercises?.practice_snippet) {
        snippets.lessonExercises.practice_snippet.forEach(word => (
          word.surface !== '\n\n' && word.id && !word.listen && dispatch(initEloHearts(word.ID))
        ))
      }
      */
    }
  }

  useEffect(() => {
    dispatch(clearPractice())
    dispatch(resetSessionId())
    dispatch(clearTranslationAction())
    dispatch(getExerciseLesson(lesson_instance.lesson_id))
  }, [])

  useEffect(() => {
    if (lessonExercises) {
      setInitialAnswers()
    }
  }, [])

  const handleMultiselectChange = (event, word, data) => {
    const { id, ID, surface, concept, snippet_id, sentence_id } = word
    const { value } = data

    setTouchedIds(ID)

    const newAnswer = {
      [`${ID}-${id}`]: {
        correct: surface,
        users_answer: value,
        id,
        word_id: ID,
        concept,
        snippet_id,
        sentence_id,
      },
    }

    dispatch(setAnswers(newAnswer))
  }

  if (!lessonExercises) {
    return null
  }

  return (
    <div>
      <form ref={practiceForm}>
        <div style={{ width: '100%' }}>
          <div
            className="practice-container"
            style={getTextStyle(learningLanguage)}
            data-cy="practice-view"
          >
            <PracticeText
              handleAnswerChange={handleInputChange}
              handleMultiselectChange={handleMultiselectChange}
            />
            <Divider />
            <LessonExerciseActions lessonId={lesson_instance.lesson_id} exerciseCount={exerciseCount} />
          </div>
        </div>
      </form>
    </div>
  )
}

export default LessonExercise
