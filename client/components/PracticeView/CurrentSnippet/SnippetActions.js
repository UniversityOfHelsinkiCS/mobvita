import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import {
  postAnswers,
  getCurrentSnippet,
  resetCurrentSnippet,
} from 'Utilities/redux/snippetsReducer'
import { finishSnippet, clearTouchedIds, clearPractice } from 'Utilities/redux/practiceReducer'

const CheckAnswersButton = ({ handleClick, checkAnswersButtonTempDisable }) => {
  const attempt = useSelector(({ practice }) => practice.attempt)
  const { focused: focusedSnippet, pending: snippetPending, answersPending } = useSelector(
    ({ snippets }) => snippets
  )

  const [attemptRatioPercentage, setAttemptRatioPercentage] = useState(20)

  useEffect(() => {
    if (!snippetPending) {
      const isFreshAttempt = !focusedSnippet?.max_attempt || attempt === 0
      if (isFreshAttempt) {
        setAttemptRatioPercentage(20)
      } else {
        const newAttemptRatioPercentage = 100 * ((attempt + 1) / focusedSnippet?.max_attempt)

        if (newAttemptRatioPercentage <= 100) {
          setAttemptRatioPercentage(newAttemptRatioPercentage)
        } else {
          setAttemptRatioPercentage(100)
        }
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
      <div style={{ width: `${attemptRatioPercentage}%` }} />
      <span>
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
    dispatch(postAnswers(storyId, answersObj))
  }

  const submitAnswers = () => {
    dispatch(finishSnippet())
    checkAnswers(true)
  }

  const handleRetry = () => {
    dispatch(getCurrentSnippet(storyId))
  }

  const handleRestart = () => {
    dispatch(clearPractice())
    dispatch(resetCurrentSnippet(id))
    setcheckAnswersButtonTempDisable(true)
    setTimeout(() => {
      setcheckAnswersButtonTempDisable(false)
    }, 5000)
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
          />
          <div className="space-between">
            <Button
              variant="secondary"
              size="sm"
              disabled={snippets.answersPending || snippets.pending || !snippets.focused}
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
              disabled={snippets.answersPending || snippets.pending}
            >
              <span>
                <FormattedMessage id="start-over" /> <Icon name="level up alternate" />
              </span>
            </Button>
          </div>
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
