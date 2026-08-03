import React from 'react'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppThemeSwitch — the light/dark toggle. A cream knob (no ring) carrying a filled sun (light, off)
 * or an outline moon (dark, on), riding on a sage-green track in both states. Drop-in for MUI Switch
 * (checked / onChange).
 */
const StyledThemeSwitch = styled(Switch)({
  width: 56,
  height: 32,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 3,
    transition: 'transform 0.15s ease',
    '&.Mui-checked': {
      transform: 'translateX(24px)',
    },
  },
  '& .MuiSwitch-thumb': {
    width: 26,
    height: 26,
    boxSizing: 'border-box',
    backgroundColor: colors.card, // cream, no ring
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .MuiSwitch-track': {
    borderRadius: 999,
    backgroundColor: colors.green, // green in both states
    opacity: 1,
  },
  '& .Mui-checked + .MuiSwitch-track': {
    opacity: 1,
  },
})

const AppThemeSwitch = props => (
  <StyledThemeSwitch
    icon={<LightModeIcon sx={{ fontSize: 18, color: colors.ink }} />}
    checkedIcon={<DarkModeOutlinedIcon sx={{ fontSize: 18, color: colors.ink }} />}
    {...props}
  />
)

export default AppThemeSwitch
