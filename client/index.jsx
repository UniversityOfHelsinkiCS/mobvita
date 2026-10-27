import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import * as Sentry from '@sentry/react'
import 'Assets/custom.scss'
import store from 'Utilities/store'
import { basePath, inProduction, isStaging } from 'Utilities/common'
import { watchForDeploys } from 'Utilities/deployUpdates'
import App from 'Components/App'
import ErrorBoundary from 'Components/ErrorBoundary'
import ConnectedIntlProvider from 'Components/ConnectedIntlProvider'
import muiTheme from 'Assets/mui_theme/muiTheme'

const sentryDsn = 'https://0db09ebcfc15d28247ed8ba70ae6cf98@toska.it.helsinki.fi/10'
const dsn = (inProduction || isStaging && basePath.includes('mobvita.cs.helsinki.fi')) ? sentryDsn : null


const filterReduxStateForSentry = event => {
  const url = event.request?.url ?? ''
  const reduxState = event.contexts?.state || event.contexts?.['redux.state']

  if (!reduxState) return event

  if (!url.includes('practice')) {
    delete reduxState.practice
    delete reduxState.focusedSnippet
    delete reduxState.translation
  }

  if (!url.includes('flashcards')) {
    delete reduxState.flashcards
    delete reduxState.flashcardList
  }

  if (!url.includes('crossword')) {
    delete reduxState.crossword
  }

  if (!url.includes('tests')) {
    delete reduxState.tests
  }

  if (!url.includes('concepts')) {
    delete reduxState.metadata
    delete reduxState.groups
  }

  return event
}

// v10's SDK defaults (sendDefaultPii unset); v11 otherwise collects user info, cookies and bodies.
const PII_HEADER_DENY = ['forwarded', '-ip', 'remote-', 'via', '-user']

Sentry.init({
  dsn,
  environment: process.env.ENVIRONMENT,
  release: `revita@${__COMMIT__}`, // eslint-disable-line no-undef
  maxBreadcrumbs: 30,
  normalizeDepth: 4,
  maxValueLength: 500,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: { request: { deny: PII_HEADER_DENY }, response: { deny: PII_HEADER_DENY } },
    httpBodies: [],
    urlQueryParams: { deny: PII_HEADER_DENY },
  },
  // v11 defaults to one session per page load; keep v10's per-navigation release-health sessions.
  integrations: [Sentry.browserSessionIntegration({ lifecycle: 'route' })],
  beforeSend(event, hint) {
    return filterReduxStateForSentry(event)
  },
})

console.log(process.env.ENVIRONMENT)

watchForDeploys()

// This removes most of responsivevoice's logging.
if (window.responsiveVoice) {
  window.responsiveVoice.OnVoiceReady = () => {
    window.responsiveVoice.debug = 0
  }
}

// Pin MUI's styles right after the entry stylesheets (the last thing in <head> here), so lazily
// loaded route CSS always lands after them like in dev; a prod cold load used to put it before.
const emotionCache = createCache({
  key: 'css',
  insertionPoint: document.head.lastElementChild,
})

const root = createRoot(document.getElementById('root'))

const refresh = () =>
  root.render(
    <CacheProvider value={emotionCache}>
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
    </CacheProvider>,
  )

refresh()

if (typeof module !== 'undefined' && module.hot) {
  module.hot.accept()
}
