import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { postAnswers, getCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import { setAttempts, finishSnippet, clearTouchedIds } from 'Utilities/redux/practiceReducer'

const SnippetActions = ({ storyId, exerciseCount }) => {
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

    dispatch(setAttempts(attempt + 1))
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

  const isSnippetFetchedSuccessfully =
    snippets.answersPending || snippets.pending || snippets.focused

  return (
    <div>
      {isSnippetFetchedSuccessfully ? (
        <div style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'flex-end' }}>
          <Button
            data-cy="check-answer"
            variant="primary"
            disabled={snippets.answersPending || snippets.pending || !snippets.focused}
            onClick={() => checkAnswers()}
            block
          >
            <span>
              <FormattedMessage id="check-answer" />
            </span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={snippets.answersPending || snippets.pending || !snippets.focused}
            onClick={submitAnswers}
            style={{ marginBottom: '0.5em' }}
          >
            <span>
              <FormattedMessage id="Go to next snippet" />
            </span>
          </Button>
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
