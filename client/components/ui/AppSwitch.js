import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppSwitch — the 2026 toggle. Off: light track with a grey-ringed white knob. On: sage-green track
 * with an ink-ringed white knob. The knob carries a second, white ring outside the first, so the
 * dark ring reads against the green track instead of sitting straight on it; that outer ring is
 * drawn with a shadow, so it can overhang the track without changing the control's size.
 * Drop-in for MUI Switch (checked / onChange / disabled).
 */
const OFF_TRACK = '#E4E1D3'
const OFF_RING = '#BFBBB0'
// Halo around the knob. A shadow rather than a second border: it grows outwards from the knob
// without shrinking its white centre or taking width from the dark ring.
const OUTER_RING_WIDTH = 2

const AppSwitch = styled(Switch)({
  width: 56,
  height: 32,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    // 4 = the 2px halo + the 2px of track that should stay visible around it.
    padding: 4,
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
    // 24 + the 2px halo on each side leaves a 2px band of track showing all the way round, in a
    // 32px-high control. Changing either number without the other closes that band.
    width: 24,
    height: 24,
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
    border: `2px solid ${OFF_RING}`,
    boxShadow: `0 0 0 ${OUTER_RING_WIDTH}px #FFFFFF`,
    transition: 'border-color 0.15s ease',
  },
  '& .MuiSwitch-track': {
    borderRadius: 999,
    backgroundColor: OFF_TRACK,
    opacity: 1,
  },
})

export default AppSwitch
