import React from 'react'
import { useIntl } from 'react-intl'
import { FormControlLabel } from '@mui/material'
import AppSwitch from 'Components/ui/AppSwitch'
import { colors } from 'Assets/mui_theme/designTokens'

const AdditionalInfoToggle = ({ showMoreInfo, setShowMoreInfo }) => {
  const intl = useIntl()

  return (
    <div className="concept-toggles">
      <FormControlLabel
        control={<AppSwitch checked={showMoreInfo} onChange={() => setShowMoreInfo(!showMoreInfo)} />}
        label={intl.formatMessage({ id: 'show-additional-info' })}
        sx={{
          m: 0,
          '& .MuiFormControlLabel-label': {
            marginLeft: '0.5em',
            color: colors.ink,
          },
        }}
      />
    </div>
  )
}

export default AdditionalInfoToggle
