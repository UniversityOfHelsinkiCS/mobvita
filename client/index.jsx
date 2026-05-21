import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import * as Sentry from '@sentry/react'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'Assets/custom.scss'
import 'Assets/tailwind.css'
import store from 'Utilities/store'
import { basePath, inProduction, isStaging } from 'Utilities/common'
import App from 'Components/App'
import ErrorBoundary from 'Components/ErrorBoundary'
import ConnectedIntlProvider from 'Components/ConnectedIntlProvider'

const sentryDsn = 'https://0db09ebcfc15d28247ed8ba70ae6cf98@toska.it.helsinki.fi/10'
const dsn = (process.env.ENVIRONMENT === 'development' || inProduction || isStaging && basePath.includes('mobvita.cs.helsinki.fi')) ? sentryDsn : null


const trimEventForSentry = event => {
  delete event.contexts?.state
  delete event.contexts?.['redux.state']
  return event
}

Sentry.init({
  dsn,
  environment: process.env.ENVIRONMENT,
  release: `revita@${__COMMIT__}`, // eslint-disable-line no-undef
  maxBreadcrumbs: 30,
  normalizeDepth: 4,
  maxValueLength: 500,
  beforeSend(event, hint) {
    return trimEventForSentry(event)
  },
})

console.log(process.env.ENVIRONMENT)

// This removes most of responsivevoice's logging.
if (window.responsiveVoice) {
  window.responsiveVoice.OnVoiceReady = () => {
    window.responsiveVoice.debug = 0
  }
}

const root = createRoot(document.getElementById('root'))
const muiTheme = createTheme({})

const refresh = () =>
  root.render(
    <ThemeProvider theme={muiTheme}>
      <Provider store={store}>
        <ConnectedIntlProvider>
          <BrowserRouter
            basename={basePath}
            future={{
              v7_relativeSplatPath: true,
              v7_startTransition: true,
            }}
          >
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </BrowserRouter>
        </ConnectedIntlProvider>
      </Provider>
    </ThemeProvider>
  )

refresh()

if (typeof module !== 'undefined' && module.hot) {
  module.hot.accept()
}
