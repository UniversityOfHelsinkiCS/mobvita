import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Checkbox } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'

const ConceptToggles = (
  { showTestConcepts, handleTestConceptToggle, showLevels, setShowLevels }
) => {
  const { target } = useParams()
  const intl = useIntl()
  const { pending } = useSelector(({ groups }) => ({ pending: groups.testConceptsPending }))

  return (
    <div className="concept-toggles">
      <Checkbox
        toggle
        label={intl.formatMessage({ id: 'show-levels' })}
        checked={showLevels}
        onChange={() => setShowLevels(!showLevels)}
        className="concept-toggle"
      />
      {target === 'groups'
        && (
          <div>
            <Checkbox
              toggle
              label={intl.formatMessage({ id: 'show-test-settings' })}
              checked={showTestConcepts}
              onChange={handleTestConceptToggle}
              className="concept-toggle"
              disabled={pending}
            />
            {pending
              && (
                <Spinner
                  animation="border"
                  variant="primary"
                  size="sm"
                  style={{ marginLeft: '1em' }}
                />
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default ConceptToggles
