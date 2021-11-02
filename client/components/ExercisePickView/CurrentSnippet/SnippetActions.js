import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { resetCurrentSnippet, refreshCurrentSnippet } from 'Utilities/redux/exercisePickReducer'
import { resetAnnotations } from 'Utilities/redux/annotationsReducer'
import { finishSnippet, clearPractice } from 'Utilities/redux/practiceReducer'

const SnippetActions = ({ storyId }) => {
  const exercisePick = useSelector(({ exercisePick }) => exercisePick)
  const dispatch = useDispatch()
  const { id } = useParams()

  const submitAnswers = () => {
    dispatch(finishSnippet())
  }

  const handleRestart = () => {
    dispatch(clearPractice())
    dispatch(resetCurrentSnippet(id))
    dispatch(resetAnnotations())
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
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
