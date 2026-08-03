import React from 'react'
import { styled } from '@mui/material/styles'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * AppActionCard — a full-width cream "action" button (icon + label) used for the HomeView activity
 * list. Pass `icon` (a node, usually an <img>) and the label as children.
 */
const StyledCard = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  width: '100%',
  padding: '14px 32px',
  backgroundColor: colors.card,
  border: 'none',
  borderRadius: '999px',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: font.family,
  fontSize: '24px',
  fontWeight: 600,
  color: colors.ink,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
  transition: 'box-shadow 0.15s ease, transform 0.15s ease',
  '&:hover': { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' },
  '&:active': { transform: 'scale(0.995)' },
  '&:disabled': { opacity: 0.5, cursor: 'default', boxShadow: 'none' },
  '& img, & svg': {
    width: 40,
    height: 40,
    flexShrink: 0,
    transition: 'transform 0.15s ease',
  },
  '&:hover img, &:hover svg': { transform: 'scale(1.18)' },
})

// forwardRef so a wrapping MUI Tooltip (CustomTooltip) can anchor to the card and show on hover.
const AppActionCard = React.forwardRef(({ icon, children, ...rest }, ref) => (
  <StyledCard ref={ref} type="button" {...rest}>
    {icon}
    <span>{children}</span>
  </StyledCard>
))

AppActionCard.displayName = 'AppActionCard'

export default AppActionCard
