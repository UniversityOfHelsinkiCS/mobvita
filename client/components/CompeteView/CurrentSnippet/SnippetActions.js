import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { postAnswers, getCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import { finishSnippet, clearTouchedIds } from 'Utilities/redux/practiceReducer'

const CheckAnswersButton = ({ handleClick, checkAnswersButtonTempDisable, playerFinished }) => {
  const attempt = useSelector(({ practice }) => practice.attempt)
  const { focused: focusedSnippet, pending: snippetPending, answersPending } = useSelector(
    ({ snippets }) => snippets
  )
  const { cachedSnippets } = useSelector(({ compete }) => compete)
  const [barColor, setBarColor] = useState('#4c91cd')
  const [attemptRatioPercentage, setAttemptRatioPercentage] = useState(100)

  const getFontStyle = () => {
    if (attemptRatioPercentage === 100) return { color: 'white' }
    return { color: 'black', textShadow: '0px 0px 4px #FFF' }
  }

  const currentSnippetId = () => {
    if (!focusedSnippet) return -1
    const { snippetid } = focusedSnippet
    return snippetid[snippetid.length - 1]
  }

  const noSnippetToFetchFromCache = () => {
    return (
      currentSnippetId() === cachedSnippets.length &&
      cachedSnippets.length !== focusedSnippet.total_num - 1
    )
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
        playerFinished !== null ||
        noSnippetToFetchFromCache()
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
  const { cachedSnippets } = useSelector(({ compete }) => compete)
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

  const currentSnippetId = () => {
    if (!snippets.focused) return -1
    const { snippetid } = snippets.focused
    return snippetid[snippetid.length - 1]
  }

  const noSnippetToFetchFromCache = () => {
    return (
      currentSnippetId() === cachedSnippets.length &&
      cachedSnippets.length !== snippets.focused?.total_num - 1
    )
  }

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

  const submitAnswers = () => {
    dispatch(finishSnippet())
    checkAnswers(true)
  }

  const nextSnippetButtonDisabled =
    snippets.answersPending || snippets.pending || !snippets.focused || noSnippetToFetchFromCache()

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
          <div>
            <Button
              data-cy={!nextSnippetButtonDisabled ? 'next-snippet-ready' : 'next-snippet-waiting'}
              variant="secondary"
              size="sm"
              disabled={nextSnippetButtonDisabled}
              onClick={submitAnswers}
              style={{ marginBottom: '0.5em' }}
            >
              <span>
                <FormattedMessage id="go-to-next-snippet" /> <Icon name="level down alternate" />
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
