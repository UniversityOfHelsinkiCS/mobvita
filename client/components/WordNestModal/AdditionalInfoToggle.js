import React from 'react'
import { useIntl } from 'react-intl'
import { Checkbox } from 'semantic-ui-react'

const AdditionalInfoToggle = ({ showMoreInfo, setShowMoreInfo }) => {
  const intl = useIntl()

  return (
    <div className="concept-toggles">
      <Checkbox
        toggle
        label={intl.formatMessage({ id: 'show-additional-info' })}
        checked={showMoreInfo}
        onChange={() => setShowMoreInfo(!showMoreInfo)}
        className="concept-toggle"
      />
    </div>
  )
}

export default AdditionalInfoToggle
