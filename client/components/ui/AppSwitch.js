import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppSwitch — the 2026 toggle. Off: light track with a grey-ringed white knob. On: sage-green track
 * with an ink-ringed white knob. Drop-in for MUI Switch (checked / onChange / disabled).
 */
const OFF_TRACK = '#E4E1D3'
const OFF_RING = '#BFBBB0'

const AppSwitch = styled(Switch)({
  width: 56,
  height: 32,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 3,
    transition: 'transform 0.15s ease',
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      '& + .MuiSwitch-track': {
        backgroundColor: colors.green,
        opacity: 1,
      },
      '& .MuiSwitch-thumb': {
        borderColor: colors.ink,
      },
    },
    '&.Mui-disabled': {
      '& .MuiSwitch-thumb': { opacity: 0.5 },
      '& + .MuiSwitch-track': { opacity: 0.5 },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 26,
    height: 26,
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
    border: `2px solid ${OFF_RING}`,
    boxShadow: 'none',
    transition: 'border-color 0.15s ease',
  },
  '& .MuiSwitch-track': {
    borderRadius: 999,
    backgroundColor: OFF_TRACK,
    opacity: 1,
  },
})

export default AppSwitch
