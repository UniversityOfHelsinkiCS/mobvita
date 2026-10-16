import React from 'react'
import { FormControlLabel } from '@mui/material'
import AppSwitch from 'Components/ui/AppSwitch'

// Labelled md switch for the nest panel's view options (markup, compound words).
const NestToggle = ({ checked, onChange, label, dataCy }) => (
  <FormControlLabel
    className="wordnest-toggle"
    data-cy={dataCy}
    labelPlacement="start"
    control={<AppSwitch size="md" checked={checked} onChange={onChange} />}
    label={label}
  />
)

export default NestToggle
