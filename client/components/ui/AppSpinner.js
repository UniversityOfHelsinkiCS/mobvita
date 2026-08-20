// eslint-disable-next-line no-unused-vars
import React from 'react'
import { styled, keyframes } from '@mui/material/styles'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppSpinner — the 2026 design-system loading spinner: a rotating ring that draws itself in with a
 * clip-path sweep (sage green by default).
 *
 *   size  – diameter in px (default 48). The ring thickness scales with it (5/48 of the diameter).
 *   color – ring colour (default the brand green).
 *
 * Pure/presentational. For a full-page/centred loader keep using `Spinner`; use AppSpinner as the
 * raw design-system spinner element.
 */
const rotate = keyframes`
  100% { transform: rotate(360deg); }
`

const prixClipFix = keyframes`
  0%   { clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0); }
  25%  { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0); }
  50%  { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%); }
  75%  { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%); }
  100% { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0); }
`

const Ring = styled('span', {
  shouldForwardProp: prop => prop !== 'size' && prop !== 'ringColor',
})(({ size, ringColor }) => ({
  display: 'inline-block',
  width: size,
  height: size,
  borderRadius: '50%',
  position: 'relative',
  animation: `${rotate} 1s linear infinite`,
  '&::before': {
    content: '""',
    boxSizing: 'border-box',
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: `${(5 / 48) * size}px solid ${ringColor}`,
    animation: `${prixClipFix} 2s linear infinite`,
  },
}))

const AppSpinner = ({ size = 48, color = colors.green, ...rest }) => (
  <Ring size={size} ringColor={color} role="status" aria-label="loading" {...rest} />
)

export default AppSpinner
