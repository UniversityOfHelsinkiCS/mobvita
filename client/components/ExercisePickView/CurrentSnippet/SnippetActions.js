import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { refreshCurrentSnippet } from 'Utilities/redux/exercisePickReducer'
import { finishSnippet } from 'Utilities/redux/practiceReducer'

const SnippetActions = ({ storyId }) => {
  const exercisePick = useSelector(({ exercisePick }) => exercisePick)
  const dispatch = useDispatch()

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
          <FormattedMessage id="refresh" />
        </Button>
        <div className="space-between">
          <Button
            variant="secondary"
            size="sm"
            // disabled={snippets.answersPending || snippets.pending || !snippets.focused}
            disabled={exercisePick.pending}
            onClick={() => dispatch(finishSnippet())}
            style={{ marginBottom: '0.5em' }}
          >
            <span>
              <FormattedMessage id="go-to-next-snippet" /> <Icon name="level down alternate" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SnippetActions
