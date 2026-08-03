import React from 'react'
import Checkbox from '@mui/material/Checkbox'
import CheckIcon from '@mui/icons-material/Check'
import { styled } from '@mui/material/styles'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppCheckbox — design-system checkbox: white box, dark ink border, dark checkmark (not MUI's
 * default filled square). Pass the usual Checkbox props (checked, onChange, disabled, sx, …).
 */
const CheckBox = styled('span')({
  width: 18,
  height: 18,
  borderRadius: 4,
  border: `2px solid ${colors.ink}`,
  backgroundColor: '#fff',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
})

const uncheckedIcon = <CheckBox />
const checkedIcon = (
  <CheckBox>
    <CheckIcon sx={{ fontSize: 16, color: colors.ink }} />
  </CheckBox>
)

const AppCheckbox = props => (
  <Checkbox icon={uncheckedIcon} checkedIcon={checkedIcon} disableRipple {...props} />
)

export default AppCheckbox
