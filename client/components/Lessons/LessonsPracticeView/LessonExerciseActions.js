import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

const CheckAnswersButton = ({ handleClick, checkAnswersButtonTempDisable }) => {
  const { attempt, isNewSnippet } = useSelector(({ practice }) => practice)
  const {
    focused: focusedSnippet,
    pending: snippetPending,
    answersPending,
  } = useSelector(({ snippets }) => snippets)
  const [barColor, setBarColor] = useState('rgb(50, 170, 248)')
  const [attemptRatioPercentage, setAttemptRatioPercentage] = useState(100)

  const getFontStyle = () => {
    if (attemptRatioPercentage > 60) return { color: 'white' }
    return { color: 'black', textShadow: '0px 0px 4px #FFF' }
  }

  useEffect(() => {
    if (!snippetPending) {
      // const isFreshAttempt = !focusedSnippet?.max_attempt || attempt === 0
      const newAttemptRatioPercentage = 100 - 100 * ((attempt + 1) / focusedSnippet?.max_attempt)

      if (typeof newAttemptRatioPercentage !== 'number') setBarColor('rgb(50, 170, 248)')
      else {
        if (newAttemptRatioPercentage <= 60) setBarColor('#67b5ed')
        if (newAttemptRatioPercentage <= 40) setBarColor('#8ebfe2')
        if (newAttemptRatioPercentage <= 20) setBarColor('#b0c8d8')
      }

      if (focusedSnippet?.max_attempt - attempt === 1) {
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
    <button
      data-cy="check-answer"
      type="button"
      onClick={() => handleClick()}
      className="check-answers-button"
      disabled={
        answersPending || snippetPending || !focusedSnippet || checkAnswersButtonTempDisable
      }
    >
      <div
        className="attempt-bar"
        style={{
          width: `${attemptRatioPercentage}%`,
          borderRadius: '13px',
        }}
      />
      <span style={{ ...getFontStyle() }}>
        <FormattedMessage id="check-answer" />
      </span>
    </button>
  )
}

const LessonExerciseActions = () => {
  const dispatch = useDispatch()
  const { attempt, isNewSnippet } = useSelector(({ practice }) => practice)

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <CheckAnswersButton
          handleClick={checkAnswers}
          checkAnswersButtonTempDisable={checkAnswersButtonTempDisable}
        />
      </div>
    </div>
  )
}

export default LessonExerciseActions