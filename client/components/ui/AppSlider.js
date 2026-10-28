import { styled } from '@mui/material/styles'
import Slider from '@mui/material/Slider'
import { colors } from 'Assets/mui_theme/designTokens'

const THUMB = '1.5em'
// Half a thumb: the root is inset by this so the thumb never overhangs the track's ends.
const INSET = '0.75em'
const MUTED_TRACK = '#DDDDDD'

const thumbShadow = '0 1px 3px rgb(0 0 0 / 15%)'

// MUI Slider drop-in: cream thumb with a sage ring on a pale-green track with a sage fill.
// `muted` greys the track out (thin, no fill) — used while a setting is locked.
const AppSlider = styled(Slider, { shouldForwardProp: prop => prop !== 'muted' })(
  ({ muted = false }) => ({
    display: 'block',
    width: 'auto',
    height: '3em',
    margin: `0 ${INSET}`,
    padding: 0,
    borderRadius: 0,
    '&.MuiSlider-marked': { marginBottom: 0 },
    '& .MuiSlider-rail': {
      left: `-${INSET}`,
      width: `calc(100% + ${THUMB})`,
      top: muted ? 22 : 23,
      height: muted ? 4 : 6,
      borderRadius: muted ? 0 : 999,
      backgroundColor: muted ? MUTED_TRACK : colors.progressBarTrack,
      opacity: 1,
    },
    '& .MuiSlider-track': {
      boxSizing: 'content-box',
      marginLeft: `-${INSET}`,
      paddingLeft: INSET,
      top: muted ? 22 : 23,
      height: muted ? 4 : 6,
      border: 'none',
      borderRadius: muted ? 0 : 999,
      backgroundColor: muted ? MUTED_TRACK : colors.progressBarFill,
    },
    '& .MuiSlider-thumb': {
      top: `calc(11px + ${INSET})`,
      width: THUMB,
      height: THUMB,
      boxSizing: 'border-box',
      backgroundColor: colors.card,
      border: `2px solid ${colors.focus}`,
      boxShadow: thumbShadow,
      cursor: 'pointer',
      '&::before': { boxShadow: 'none' },
      '&:hover, &.Mui-focusVisible, &.Mui-active': { boxShadow: thumbShadow },
    },
  }),
)

export default AppSlider
