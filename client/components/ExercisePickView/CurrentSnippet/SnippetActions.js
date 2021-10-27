import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
// import { postAnswers, resetCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import {
  postAnswers,
  resetCurrentSnippet,
  refreshCurrentSnippet,
} from 'Utilities/redux/exercisePickReducer'
import { resetAnnotations } from 'Utilities/redux/annotationsReducer'
// import { refreshCurrentSnippet } from 'Utilities/redux/exercisePickReducer'
import { finishSnippet, clearTouchedIds, clearPractice } from 'Utilities/redux/practiceReducer'

const CheckAnswersButton = ({ handleClick, checkAnswersButtonTempDisable }) => {
  const attempt = useSelector(({ practice }) => practice.attempt)
  const {
    focused: focusedSnippet,
    pending: snippetPending,
    answersPending,
  } = useSelector(({ snippets }) => snippets)
  const [barColor, setBarColor] = useState('#4c91cd')
  const [attemptRatioPercentage, setAttemptRatioPercentage] = useState(100)

  const getFontStyle = () => {
    if (attemptRatioPercentage === 100) return { color: 'white' }
    return { color: 'black', textShadow: '0px 0px 4px #FFF' }
  }

  useEffect(() => {
    if (!snippetPending) {
      // const isFreshAttempt = !focusedSnippet?.max_attempt || attempt === 0
      const newAttemptRatioPercentage = 100 - 100 * ((attempt + 1) / focusedSnippet?.max_attempt)

      if (typeof newAttemptRatioPercentage !== 'number') setBarColor('#4c91cd')
      else {
        if (newAttemptRatioPercentage <= 60) setBarColor('#719ac6')
        if (newAttemptRatioPercentage <= 40) setBarColor('#84a1c2')
        if (newAttemptRatioPercentage <= 20) setBarColor('#a5adb9')
      }

      if (focusedSnippet?.max_attempt - attempt === 1) {
        setAttemptRatioPercentage(1)
      } else if (newAttemptRatioPercentage <= 100) {
        setAttemptRatioPercentage(newAttemptRatioPercentage)
      } else {
        setAttemptRatioPercentage(100)
        setBarColor('#4c91cd')
      }
    }
  }, [focusedSnippet, attempt])

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
      <div style={{ width: `${attemptRatioPercentage}%`, backgroundColor: barColor }} />
      <span style={{ ...getFontStyle() }}>
        <FormattedMessage id="check-answer" />
      </span>
    </button>
  )
}

const SnippetActions = ({ storyId, exerciseCount }) => {
  const [checkAnswersButtonTempDisable, setcheckAnswersButtonTempDisable] = useState(false)
  const { currentAnswers, touchedIds, attempt, options, audio } = useSelector(
    ({ practice }) => practice
  )
  const { snippets } = useSelector(({ snippets }) => ({ snippets }))
  const exercisePick = useSelector(({ exercisePick }) => exercisePick)
  const dispatch = useDispatch()
  const { id } = useParams()

  const rightAnswerAmount = useMemo(
    () =>
      snippets.focused &&
      snippets.focused.practice_snippet.reduce(
        (sum, word) => (word.tested && !word.isWrong ? sum + 1 : sum),
        0
      ),
    [snippets]
  )

  const checkAnswers = async lastAttempt => {
    // const { starttime, snippetid } = snippets.focused
    const { starttime, snippetid } = exercisePick.focused

    const answersObj = {
      starttime,
      story_id: storyId,
      snippet_id: snippetid,
      touched: touchedIds.length,
      untouched: exerciseCount - touchedIds.length - rightAnswerAmount,
      attempt,
      options,
      audio,
      answers: currentAnswers,
      last_attempt: lastAttempt,
    }

    dispatch(clearTouchedIds())
    dispatch(postAnswers(storyId, answersObj))
  }

  const submitAnswers = () => {
    dispatch(finishSnippet())
    // checkAnswers(true)
  }

  const handleRestart = () => {
    dispatch(clearPractice())
    dispatch(resetCurrentSnippet(id))
    dispatch(resetAnnotations())
    setcheckAnswersButtonTempDisable(true)
    setTimeout(() => {
      setcheckAnswersButtonTempDisable(false)
    }, 5000)
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* <CheckAnswersButton
          handleClick={checkAnswers}
          checkAnswersButtonTempDisable={checkAnswersButtonTempDisable}
        /> */}
        <Button
          variant="primary"
          onClick={() =>
            dispatch(
              refreshCurrentSnippet(
                storyId,
                exercisePick.focused.snippetid[0],
                exercisePick.acceptedTokens
              )
            )
          }
          type="button"
          style={{ width: '100%', marginBottom: '.5em' }}
        >
          Refresh
        </Button>
        <div className="space-between">
          <Button
            variant="secondary"
            size="sm"
            // disabled={snippets.answersPending || snippets.pending || !snippets.focused}
            disabled={exercisePick.pending}
            onClick={submitAnswers}
            style={{ marginBottom: '0.5em' }}
          >
            <span>
              <FormattedMessage id="go-to-next-snippet" /> <Icon name="level down alternate" />
            </span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRestart}
            style={{ marginBottom: '0.5em' }}
            // disabled={snippets.answersPending || snippets.pending}
            disabled
          >
            <span>
              <FormattedMessage id="start-over" /> <Icon name="level up alternate" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SnippetActions
