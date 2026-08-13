// This file overrides global MUI component styles and default props.
// It is imported in `index.jsx` and applied across the entire application
// through the MUI `ThemeProvider` component.

import { createTheme } from '@mui/material/styles'

const muiTheme = createTheme({
  // Legacy palette, inherited from the pre-2026 look. Components built to the design system take
  // their colours from `designTokens` instead; this only still backs plain MUI components that have
  // no App* wrapper yet. Tune these to the real brand palette as the redesign reaches them.
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
          fontFamily: 'Rubik, sans-serif',
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
