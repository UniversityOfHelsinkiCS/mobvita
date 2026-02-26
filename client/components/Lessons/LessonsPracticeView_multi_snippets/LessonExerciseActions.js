import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postLessonExerciseAnswers, setAttempt, getExerciseLesson } from 'Utilities/redux/lessonExercisesReducer'
import { clearTouchedIds, addToCorrectAnswerIDs, incrementAttempts } from 'Utilities/redux/practiceReducer'
import { FormattedMessage } from 'react-intl'
import { finalConfettiRain, confettiRain } from 'Utilities/common'
import Spinner from 'Components/Spinner'

const getFontStyle = (attemptRatioPercentage) => {
  if (attemptRatioPercentage > 60) return { color: 'white' }
  return { color: 'black', textShadow: '0px 0px 4px #FFF' }
}

const CheckAnswersButton = ({ handleClick, checkAnswersButtonTempDisable }) => {
  const { attempt, isNewSnippet } = useSelector(({ practice }) => practice)
  const { lesson_exercises, pending } = useSelector(({ lessonExercises }) => lessonExercises)

  const [barColor, setBarColor] = useState('rgb(50, 170, 248)')
  const [attemptRatioPercentage, setAttemptRatioPercentage] = useState(100)

  useEffect(() => {
    if (!pending) {
      const max_attempt = 3 //lesson_exercises?.max_attempt)
      const newAttemptRatioPercentage = 100 * ((max_attempt - attempt) / max_attempt)

      if (typeof newAttemptRatioPercentage !== 'number') setBarColor('rgb(50, 170, 248)')
      else {
        if (newAttemptRatioPercentage <= 60) setBarColor('#67b5ed')
        if (newAttemptRatioPercentage <= 40) setBarColor('#8ebfe2')
        if (newAttemptRatioPercentage <= 20) setBarColor('#b0c8d8')
      }

      if (max_attempt - attempt === 1) {
        setAttemptRatioPercentage(1)
      } else if (newAttemptRatioPercentage <= 100) {
        setAttemptRatioPercentage(newAttemptRatioPercentage)
      } else {
        setAttemptRatioPercentage(100)
        setBarColor('rgb(50, 170, 248)')
      }
    }
  }, [attempt, isNewSnippet])

  return (
    <>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {answersPending && <Spinner inline size={60} />}
      </div>
      <button
        data-cy="check-answer"
        type="button"
        onClick={() => handleClick()}
        className="check-answers-button"
        disabled={
          pending || !lesson_exercises || checkAnswersButtonTempDisable
        }
      >
        <div
          className="attempt-bar"
          style={{
            width: `${attemptRatioPercentage}%`,
            borderRadius: '13px',
          }}
        />
        <span style={{ ...getFontStyle(attemptRatioPercentage) }}>
        {
          <FormattedMessage id="check-answer" />
        }
        </span>
      </button>
    </>
  )
}

const GetNextExerciseBatchButton = () => {
  const dispatch = useDispatch()
  const { lesson_exercises, pending } = useSelector(({ lessonExercises }) => lessonExercises)
  const { lesson_instance } = useSelector(({ lessonInstance }) => lessonInstance)
  
  return (
    <button
      data-cy="check-answer"
      type="button"
      onClick={() => { dispatch(getExerciseLesson()) }}
      className="check-answers-button"
      disabled={
        pending || !lesson_exercises || !lesson_instance
      }
    >
      <div
        className="attempt-bar"
        style={{
          width: `100%`,
          borderRadius: '13px',
        }}
      />
      <span style={{ ...getFontStyle(100) }}>
        <FormattedMessage id="next-exercise-batch" />
      </span>
    </button>
  )
}

const LessonExerciseActions = ({ lessonId, exerciseCount }) => {
  const dispatch = useDispatch()
  const [ checkAnswersButtonTempDisable, setcheckAnswersButtonTempDisable ] = useState(false)
  const { lesson_exercises, session_id, starttime, focusing_snippets, previous_snippets, answersPending, pending } = useSelector(({ lessonExercises }) => lessonExercises)
  const { currentAnswers, correctAnswerIDs, touchedIds, attempt, options, audio, audio_wids, voice } = useSelector(
    ({ practice }) => practice
  )

  const getActionButton = () => {
    if (focusing_snippets.length === 0){
      return <GetNextExerciseBatchButton />
    } else {
      return <CheckAnswersButton
        handleClick={checkAnswers}
        checkAnswersButtonTempDisable={checkAnswersButtonTempDisable}
      />
    }
  }

  const getRightAnswerAmount = () => {
    let total = 0
    lesson_exercises?.forEach(sentence => {
      sentence.sent.forEach(word => {
        if (word.tested && !word.isWrong) {
          total++
        }
      })
    })
    return total
  }

  const checkAnswers = async lastAttempt => {
    const filteredCurrentAnswers = Object.keys(currentAnswers)
      .filter(key => !correctAnswerIDs.includes(key))
      .reduce((obj, key) => {
        obj[key] = currentAnswers[key]
        return obj
      }, {})

    const answersObj = {
      starttime,
      touched: touchedIds.length,
      untouched: exerciseCount - touchedIds.length - getRightAnswerAmount(),
      attempt,
      options,
      audio,
      audio_wids,
      voice,
      answers: filteredCurrentAnswers,
      last_attempt: lastAttempt,
      timer_value: null,
      session_id: session_id,
      frozen_exercise: false,
    }

    dispatch(clearTouchedIds())
    dispatch(postLessonExerciseAnswers(answersObj, false))
    dispatch(incrementAttempts())
    
    const wrongAnswers = Object.keys(filteredCurrentAnswers).filter(
      key =>
        filteredCurrentAnswers[key].users_answer.toLowerCase() !==
        filteredCurrentAnswers[key].correct.toLowerCase()
    )

    if (!wrongAnswers || wrongAnswers.length < 1) {
      if (attempt === 0){
        confettiRain()
      }
    }
  }

  useEffect(() => {
    const testedAndCorrectIDs = focusing_snippets[0]?.sent
      .filter(w => w.tested && !w.isWrong)
      .map(w => `${w.ID}`)

    dispatch(addToCorrectAnswerIDs(testedAndCorrectIDs))
    dispatch(setAttempt(attempt))
  }, [attempt])

  if (!pending) {
    if (previous_snippets?.length <= lesson_exercises?.length && lesson_exercises?.length) {
      if (!answersPending) {
        return (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {getActionButton()}
            </div>
          </div>
        )
      } else {
        return (
          <div className="spinner-container" style={{ minHeight: 0 }}>
            <Spinner inline size={60} />
          </div>
        )
      }
    } else {
      return (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', 'align-items': 'center' }}>
            <FormattedMessage id="no-available-exercise" />
          </div>
        </div>
      )
    }
  } else {
    return null
  }
}

export default LessonExerciseActions
