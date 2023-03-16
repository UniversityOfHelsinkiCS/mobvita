import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExerciseLesson, setFocusingSnippets } from 'Utilities/redux/lessonExercisesReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { resetSessionId } from 'Utilities/redux/snippetsReducer'
import {
  setAnswers,
  clearPractice,
  clearCurrentPractice,
  clearCurrentAnswers,
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
  
  const { lesson_exercises, focusing_snippets, current_attempt, max_attempt_per_snippet } = useSelector(({ lessonExercises }) => lessonExercises)
  const [ exerciseCount, setExerciseCount ] = useState(0)
  
  const getExerciseCount = () => {
    let count = 0
    focusing_snippets.forEach(sentence => {
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
    focusing_snippets?.forEach(snippet => {
      snippet.sent.forEach(word => {
        if (word.id) {
          tokens = tokens.concat({
            ...word,
            story_id: snippet.story_id, 
          })
        }
      })
    })

    return tokens
  }

  const setInitialAnswers = () => {
    if (focusing_snippets) {
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
          audio_wids,
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
        let word_cue = userAnswer

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
                cue: word_cue
              },
            })
          )
        }

        if (listen) {
          dispatch(
            addToAudio({
              [`${ID}-${id}`]: {
                context: audio,
                audio_wids,
                snippet_id,
                sentence_id,
                id,
                word_id: ID,
                story_id,
                cue: word_cue
              },
            })
          )
        }

        return {
          ...answerObject,
          [`${ID}-${id}`]: {
            correct: surface,
            users_answer: usersAnswer,
            cue: word_cue,
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
      if (snippets?.lesson_exercises?.practice_snippet) {
        snippets.lesson_exercises.practice_snippet.forEach(word => (
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
    if (lesson_exercises && lesson_exercises?.length) {
      let next_snippet_idx = 0
      dispatch(setFocusingSnippets([lesson_exercises[next_snippet_idx]]))
    }
  }, [lesson_exercises])

  useEffect(() => {
    if (focusing_snippets) {
      let has_wrong_answers = false
      for (let i=0; i < focusing_snippets.length; i++){
        let _snippet = focusing_snippets[i]
        _snippet.sent.forEach((e, i) => {
          if (e.isWrong) { has_wrong_answers = true }
        }); 
      }

      if (current_attempt >= max_attempt_per_snippet || !has_wrong_answers){
        dispatch(clearPractice())
        setInitialAnswers()
      } else {
        dispatch(clearCurrentAnswers())
      }
    }
  }, [focusing_snippets])

  const handleMultiselectChange = (event, word, data) => {
    const { id, ID, surface, concept, snippet_id, story_id, sentence_id } = word
    const { value } = data
    const word_cue = currentAnswers[`${ID}-${id}`]?.cue

    setTouchedIds(ID)

    const newAnswer = {
      [`${ID}-${id}`]: {
        correct: surface,
        users_answer: value,
        cue: word_cue,
        id,
        word_id: ID,
        concept,
        story_id,
        snippet_id,
        sentence_id,
        hintsRequested: currentAnswers[`${ID}-${id}`]?.hintsRequested,
        requestedHintsList: currentAnswers[`${ID}-${id}`]?.requestedHintsList,
        penalties: currentAnswers[`${ID}-${id}`]?.penalties,
      },
    }

    dispatch(setAnswers(newAnswer))
  }

  if (!lesson_exercises) {
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
