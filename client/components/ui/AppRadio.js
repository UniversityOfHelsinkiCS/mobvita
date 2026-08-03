import React from 'react'
import Radio from '@mui/material/Radio'
import { styled } from '@mui/material/styles'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppRadio — design-system radio: a white circle with a dark ink ring, and a filled ink dot when
 * selected (not MUI's default). Pass the usual Radio props (checked, value, onChange, disabled, …).
 */
const RadioCircle = styled('span')({
  width: 18,
  height: 18,
  borderRadius: '50%',
  border: `2px solid ${colors.ink}`,
  backgroundColor: '#fff',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
})

const Dot = styled('span')({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: colors.ink,
})

const uncheckedIcon = <RadioCircle />
const checkedIcon = (
  <RadioCircle>
    <Dot />
  </RadioCircle>
)

const AppRadio = props => (
  <Radio icon={uncheckedIcon} checkedIcon={checkedIcon} disableRipple {...props} />
)

export default AppRadio
