import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { Checkbox } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'

const ConceptToggles = ({
  showTestConcepts,
  handleTestConceptToggle,
  showLevels,
  setShowLevels,
}) => {
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
      {target === 'groups' && (
        <div style={{ display: 'flex', marginLeft:'6em'}}>
          <label><FormattedMessage id="show-exercise-settings"/></label>
          <Checkbox
            toggle
            checked={showTestConcepts}
            onChange={handleTestConceptToggle}
            className="concept-toggle"
            disabled={pending}
          />
          <label style={{  marginLeft: '1em' }}><FormattedMessage id="show-test-settings"/></label>
          {pending && (
            <Spinner animation="border" variant="primary" size="sm" style={{ marginLeft: '1em' }} />
          )}
        </div>
      )}
    </div>
  )
}

export default ConceptToggles
