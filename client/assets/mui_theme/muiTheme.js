// This file overrides global MUI component styles and default props.
// It is imported in `index.jsx` and applied across the entire application
// through the MUI `ThemeProvider` component.

import { createTheme } from '@mui/material/styles'
import { font } from './designTokens'

const muiTheme = createTheme({
  // MUI defaults to Roboto, a font this app never loads, so point it at the app's own family.
  // Deliberately no `htmlFontSize`: every rem is calibrated to the 14px root set in base.scss.
  typography: {
    fontFamily: font.family,

    // Not redundant: setting `fontFamily` above drops MUI's own per-variant tracking, so restate
    // it — the `0em` entries included, since omitting those leaves an inheritable `normal`.
    h1: { letterSpacing: '-0.01562em' },
    h2: { letterSpacing: '-0.00833em' },
    h3: { letterSpacing: '0em' },
    h4: { letterSpacing: '0.00735em' },
    h5: { letterSpacing: '0em' },
    h6: { letterSpacing: '0.0075em' },
    subtitle1: { letterSpacing: '0.00938em' },
    subtitle2: { letterSpacing: '0.00714em' },
    body1: { letterSpacing: '0.00938em' },
    body2: { letterSpacing: '0.01071em' },
    button: { letterSpacing: '0.02857em' },
    caption: { letterSpacing: '0.03333em' },
    overline: { letterSpacing: '0.08333em' },
  },
  // Legacy palette for plain MUI components; design-system components use `designTokens` instead.
  palette: {
    primary: { main: '#0d6efd' }, // blue
    secondary: { main: '#6c757d', contrastText: '#ffffff' }, // grey
    error: { main: '#dc3545' }, // red
    success: { main: '#198754' }, // green
    warning: { main: '#ffc107' },
    info: { main: '#0dcaf0' },
  },
  components: {
    // Override backdrop styling only for MUI Dialog
    MuiDialog: {
      styleOverrides: {
        backdrop: {
          backgroundColor: 'rgba(253, 253, 253, 0.8)',
        },
      },
    },

    // Override default props and styles for MUI Tooltip component
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        placement: 'top-start',
      },
      styleOverrides: {
        tooltip: {
          backgroundColor: '#ffffff',
          border: '1px solid #d4d4d5',
          borderRadius: '0.28571429rem',
          boxShadow:
            '0 2px 4px 0 rgba(34, 36, 38, 0.12), 0 2px 10px 0 rgba(34, 36, 38, 0.15)',
          color: 'rgba(0, 0, 0, 0.87)',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: '1.4285em',
          maxWidth: '250px',
          padding: '0.833em 1em',
        },
        arrow: {
          color: '#ffffff',
        },
      },
    },
  },
})

export default muiTheme
