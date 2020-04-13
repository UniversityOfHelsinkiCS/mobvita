import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button, Spinner } from 'react-bootstrap'
import { postAnswers } from 'Utilities/redux/snippetsReducer'
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

  return (
    <Button
      data-cy="check-answer"
      block
      variant="primary"
      disabled={snippets.answersPending || snippets.pending}
      onClick={() => checkAnswers()}
    >
      <div className="spinner-container">
        {snippets.answersPending ? <Spinner animation="border" variant="dark" size="lg" />
          : <FormattedMessage id="check-answer" />}

      </div>

    </Button>
  )
}

export default CheckAnswers
