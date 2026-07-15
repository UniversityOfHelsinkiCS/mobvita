import React from 'react'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'

/**
 * AppProgressBar — the app's standard progress bar (MUI `LinearProgress` inside a `styled`
 * wrapper). It mirrors the react-bootstrap `ProgressBar` prop names we used so migrating is a
 * near drop-in: keep `now` / `label` / `variant`, swap the import + tag name.
 *
 * Props:
 *   now      - completion percentage 0..100 (bootstrap `now`)
 *   label    - node rendered centered over the bar (bootstrap `label`)
 *   variant  - 'success' tints the fill green; anything else = primary blue
 *   height   - bar height (default 2rem, matching the old .achievement-progress)
 *   className / style / … pass straight through to the wrapper.
 */

// Fill colours matching the bootstrap palette the app is migrating away from.
const BAR_COLORS = {
  primary: '#0d6efd',
  success: '#28a745',
}

const ProgressRoot = styled('div')({
  position: 'relative',
  width: '100%',
})

const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: prop => prop !== 'barColor' && prop !== 'barHeight',
})(({ barColor, barHeight }) => ({
  height: barHeight,
  borderRadius: '0.5rem',
  backgroundColor: '#e9ecef', // bootstrap progress track colour
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: '0.5rem',
    backgroundColor: barColor,
  },
}))

const ProgressLabel = styled('span')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontWeight: 650,
  color: '#232b2b',
})

const AppProgressBar = ({ now = 0, label, variant, height = '2rem', className, style, ...rest }) => {
  const barColor = variant === 'success' ? BAR_COLORS.success : BAR_COLORS.primary
  const value = Math.min(100, Math.max(0, now || 0))

  return (
    <ProgressRoot className={className} style={style}>
      <StyledLinearProgress
        variant="determinate"
        value={value}
        barColor={barColor}
        barHeight={height}
        {...rest}
      />
      {label != null && <ProgressLabel>{label}</ProgressLabel>}
    </ProgressRoot>
  )
}

export default AppProgressBar
