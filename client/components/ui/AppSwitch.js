import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppSwitch — the 2026 toggle. Off: light track with a grey-ringed white knob. On: sage-green track
 * with an ink-ringed white knob. The knob carries a second, white ring outside the first, so the
 * dark ring reads against the green track instead of sitting straight on it; that outer ring is
 * drawn with a shadow, so it can overhang the track without changing the control's size.
 * Drop-in for MUI Switch (checked / onChange / disabled).
 *
 * Track colours can be chosen per use: `onColor` (default the brand green) and `offColor` (default
 * the light beige). Both are style-only props and never reach the DOM. The off-state knob ring is
 * grey only on the default track; any other `offColor` gets an ink ring so the knob still reads.
 */
const OFF_TRACK = '#E4E1D3'
const OFF_RING = '#BFBBB0'
// Halo around the knob. A shadow rather than a second border: it grows outwards from the knob
// without shrinking its white centre or taking width from the dark ring.
const OUTER_RING_WIDTH = 2

const AppSwitch = styled(Switch, {
  shouldForwardProp: prop => prop !== 'onColor' && prop !== 'offColor',
})(({ onColor = colors.green, offColor = OFF_TRACK }) => {
  // The grey ring is tuned to the default track; on any other off colour the ring goes ink.
  const offRing = offColor === OFF_TRACK ? OFF_RING : colors.ink

  return {
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
          backgroundColor: onColor,
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
      border: `2px solid ${offRing}`,
      boxShadow: `0 0 0 ${OUTER_RING_WIDTH}px #FFFFFF`,
      transition: 'border-color 0.15s ease',
    },
    '& .MuiSwitch-track': {
      borderRadius: 999,
      backgroundColor: offColor,
      opacity: 1,
    },
  }
})

export default AppSwitch
