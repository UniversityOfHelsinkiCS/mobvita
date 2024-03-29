import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedHTMLMessage, useIntl } from 'react-intl'
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
      {target === 'groups' && (
        <div style={{ display: 'flex', fontWeight: 'bold' }}>
          <span style={{ marginRight: '0.5em' }}>
            <input type="radio" onChange={handleTestConceptToggle} checked={!showTestConcepts} />
          </span>
          <span style={{ marginRight: '0.5em' }}>
            <FormattedHTMLMessage id="show-exercise-settings" />
          </span>
          <span style={{ marginRight: '0.5em' }}>
            <input type="radio" onChange={handleTestConceptToggle} checked={showTestConcepts} />
          </span>
          <span style={{ marginRight: '0.5em' }}>
            <FormattedHTMLMessage id="show-test-settings" />
          </span>
        </div>
      )}
      {pending && (
        <Spinner animation="border" variant="primary" size="sm" style={{ marginLeft: '1em' }} />
      )}
      <Checkbox
        style={{ marginLeft: '6em' }}
        toggle
        label={intl.formatMessage({ id: 'show-levels' })}
        checked={showLevels}
        onChange={() => setShowLevels(!showLevels)}
        className="concept-toggle"
      />
    </div>
  )
}

export default ConceptToggles
