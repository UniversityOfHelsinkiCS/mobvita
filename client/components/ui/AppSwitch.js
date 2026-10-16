import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { colors } from 'Assets/mui_theme/designTokens'

const OFF_TRACK = '#E4E1D3'
const OFF_RING = '#BFBBB0'
// Halo around the knob. A shadow rather than a second border: it grows outwards from the knob
// without shrinking its white centre or taking width from the dark ring.
const OUTER_RING_WIDTH = 2
// 4 = the 2px halo + the 2px of track that should stay visible around it.
const KNOB_PAD = 4

// Track sizes; 'lg' is the original switch, so switches that don't set `size` are unchanged.
const SIZES = {
  sm: { width: 36, height: 20 },
  md: { width: 44, height: 24 },
  lg: { width: 56, height: 32 },
}

// MUI Switch drop-in with sage-green on / beige off tracks; `size` is 'sm' | 'md' | 'lg' (default).
// `onColor` / `offColor` recolour the tracks; a non-default off track gets an ink knob ring.
const AppSwitch = styled(Switch, {
  shouldForwardProp: prop => prop !== 'onColor' && prop !== 'offColor' && prop !== 'size',
})(({ onColor = colors.green, offColor = OFF_TRACK, size = 'lg' }) => {
  // The grey ring is tuned to the default track; on any other off colour the ring goes ink.
  const offRing = offColor === OFF_TRACK ? OFF_RING : colors.ink
  const { width, height } = SIZES[size] || SIZES.lg
  // Knob fills the height minus the halo + track band on each side.
  const thumb = height - 2 * KNOB_PAD

  return {
    width,
    height,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: KNOB_PAD,
      transition: 'transform 0.15s ease',
      '&.Mui-checked': {
        transform: `translateX(${width - height}px)`,
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
      width: thumb,
      height: thumb,
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
