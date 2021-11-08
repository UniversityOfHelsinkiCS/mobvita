import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Icon, Popup } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { refreshCurrentSnippet } from 'Utilities/redux/controlledPracticeReducer'
import { finishSnippet } from 'Utilities/redux/practiceReducer'

const SnippetActions = ({ storyId }) => {
  const controlledPractice = useSelector(({ controlledPractice }) => controlledPractice)
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
                controlledPractice.focused.snippetid[0],
                controlledPractice.acceptedTokens
              )
            )
          }
          type="button"
          style={{ width: '100%', marginBottom: '.5em' }}
        >
          <FormattedMessage id="regenerate-exercises" />
        </Button>
        <div className="space-between">
          <Button
            variant="secondary"
            size="sm"
            disabled={controlledPractice.pending}
            onClick={() => dispatch(finishSnippet())}
            style={{ marginBottom: '0.5em' }}
          >
            <span>
              <FormattedMessage id="freeze-snippet" /> <Icon name="level down alternate" />
            </span>
          </Button>
          <Popup
            position="top center"
            content={<FormattedMessage id="controlled-exercise-popup-text" />}
            trigger={<Icon className="pt-sm" name="info circle" size="large" color="grey" />}
          />
        </div>
      </div>
    </div>
  )
}

export default SnippetActions