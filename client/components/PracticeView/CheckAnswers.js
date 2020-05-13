import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button, Spinner } from 'react-bootstrap'
import { postAnswers, getCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import { setAttempts } from 'Utilities/redux/practiceReducer'

const CheckAnswers = ({ storyId, exerciseCount }) => {
  const { currentAnswers, touchedIds, attempt, options, audio } = useSelector(({ practice }) => practice)
  const { snippets } = useSelector(({ snippets }) => ({ snippets }))

  const dispatch = useDispatch()

  const checkAnswers = async () => {
    const { starttime, snippetid } = snippets.focused

    const answersObj = {
      starttime,
      story_id: storyId,
      snippet_id: snippetid,
      touched: touchedIds.length,
      untouched: exerciseCount - touchedIds.length,
      attempt,
      options,
      audio,
      answers: currentAnswers,
    }

    dispatch(setAttempts(attempt + 1))
    dispatch(postAnswers(storyId, answersObj))
  }

  const handleRetry = () => {
    dispatch(getCurrentSnippet(storyId))
  }

  const showCheckAsnwers = snippets.answersPending || snippets.pending || snippets.focused

  return (
    <div>
      {showCheckAsnwers
        ? (
          <Button
            data-cy="check-answer"
            block
            variant="primary"
            disabled={snippets.answersPending || snippets.pending || !snippets.focused}
            onClick={() => checkAnswers()}
          >
            {snippets.answersPending
              ? <Spinner animation="border" variant="dark" size="lg" />
              : <span><FormattedMessage id="check-answer" /></span>}
          </Button>
        ) : (
          <Button
            block
            variant="primary"
            disabled={snippets.answersPending || snippets.pending}
            onClick={() => handleRetry()}
          >
            Retry loading snippet
          </Button>
        )
      }

    </div>
  )
}

export default CheckAnswers
