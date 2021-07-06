import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { postAnswers, getCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import { clearTouchedIds } from 'Utilities/redux/practiceReducer'

const CheckAnswersButton = ({ handleClick, checkAnswersButtonTempDisable, playerFinished }) => {
  const attempt = useSelector(({ practice }) => practice.attempt)
  const { focused: focusedSnippet, pending: snippetPending, answersPending } = useSelector(
    ({ snippets }) => snippets
  )
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
        answersPending ||
        snippetPending ||
        !focusedSnippet ||
        checkAnswersButtonTempDisable ||
        playerFinished !== null
      }
    >
      <div style={{ width: `${attemptRatioPercentage}%`, backgroundColor: barColor }} />
      <span style={{ ...getFontStyle() }}>
        <FormattedMessage id="check-answer" />
      </span>
    </button>
  )
}

const SnippetActions = ({ storyId, exerciseCount, playerFinished }) => {
  const [checkAnswersButtonTempDisable, setcheckAnswersButtonTempDisable] = useState(false)
  const { currentAnswers, touchedIds, attempt, options, audio } = useSelector(
    ({ practice }) => practice
  )
  const { snippets } = useSelector(({ snippets }) => ({ snippets }))
  const dispatch = useDispatch()

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
    const { starttime, snippetid } = snippets.focused

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
    dispatch(postAnswers(storyId, answersObj, true))
    setcheckAnswersButtonTempDisable(true)
    setTimeout(() => {
      setcheckAnswersButtonTempDisable(false)
    }, 5000)
  }

  const handleRetry = () => {
    dispatch(getCurrentSnippet(storyId))
  }

  const isSnippetFetchedSuccessfully =
    snippets.answersPending || snippets.pending || snippets.focused

  return (
    <div>
      {isSnippetFetchedSuccessfully ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <CheckAnswersButton
            handleClick={checkAnswers}
            checkAnswersButtonTempDisable={checkAnswersButtonTempDisable}
            playerFinished={playerFinished}
          />
        </div>
      ) : (
        <Button
          block
          variant="primary"
          disabled={snippets.answersPending || snippets.pending}
          onClick={() => handleRetry()}
        >
          Retry loading snippet
        </Button>
      )}
    </div>
  )
}

export default SnippetActions
