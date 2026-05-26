// This file overrides global MUI component styles and default props.
// It is imported in `index.jsx` and applied across the entire application
// through the MUI `ThemeProvider` component.

import { createTheme } from '@mui/material/styles'

const muiTheme = createTheme({
  components: {
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
