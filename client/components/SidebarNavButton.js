import React from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'

// Full-width sidebar nav button (MUI). Encapsulates the
// router Link, the leading icon (MUI `startIcon`), the i18n label, and the shared sidebar styling,
// so the Sidebar only declares route / icon / label.
//
// Props:
//   to       - route to navigate to
//   icon     - a MUI icon element, e.g. <BookIcon fontSize="small" />
//   labelId  - i18n message id for the button text
//   onClick  - click handler (e.g. closeSidebar)
//   dataCy   - optional data-cy
//   sx       - per-instance style overrides (e.g. marginBottom for the last item)
//   className- optional extra classes (kept for existing SCSS hooks like .sidebar-action-button)
const StyledSidebarButton = styled(Button)({
  width: '100%',
  marginTop: '8px',
  textTransform: 'none', // MUI uppercases by default; keep the original casing
  fontWeight: 'bold',
  fontSize: 'larger',
  fontFamily: 'Lato, "Helvetica Neue", Arial, Helvetica, sans-serif',
  borderRadius: '10px',
  // Default look: outlined with the sidebar accent colours.
  '&.MuiButton-outlined': {
    color: 'darkslateblue',
    borderColor: 'slateblue',
    '&:hover': { borderColor: 'darkslateblue' },
  },
  // Emphasis look (e.g. the Register CTA): filled background, white text.
  '&.MuiButton-contained': {
    color: '#fff',
    backgroundColor: 'slateblue',
    '&:hover': { backgroundColor: 'darkslateblue' },
  },
})

const SidebarNavButton = ({
  to,
  state,
  icon,
  labelId,
  onClick,
  dataCy,
  sx,
  className,
  children,
  variant = 'outlined',
}) => (
  <StyledSidebarButton
    component={Link}
    to={to}
    state={state}
    onClick={onClick}
    startIcon={icon}
    variant={variant}
    data-cy={dataCy}
    className={className}
    sx={sx}
  >
    {labelId ? <FormattedMessage id={labelId} /> : children}
  </StyledSidebarButton>
)

export default SidebarNavButton
