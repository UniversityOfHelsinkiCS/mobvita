import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/react'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'Assets/custom.scss'
import store from 'Utilities/store'
import { basePath, inProduction, isStaging } from 'Utilities/common'
import App from 'Components/App'
import ErrorBoundary from 'Components/ErrorBoundary'
import ConnectedIntlProvider from 'Components/ConnectedIntlProvider'

const dsn = basePath.includes('localhost') ? 'https://0db09ebcfc15d28247ed8ba70ae6cf98@toska.it.helsinki.fi/10' : null

const filterReduxStateForSentry = event => {
  const url = event.request?.url ?? ''

  if (!url.includes('practice')) {
    delete event.contexts['redux.state'].practice
    delete event.contexts['redux.state'].focusedSnippet
    delete event.contexts['redux.state'].translation
  }

  if (!url.includes('flashcards')) {
    delete event.contexts['redux.state'].flashcards
    delete event.contexts['redux.state'].flashcardList
  }

  if (!url.includes('crossword')) {
    delete event.contexts['redux.state'].crossword
  }

  if (!url.includes('tests')) {
    delete event.contexts['redux.state'].tests
  }

  if (!url.includes('concepts')) {
    delete event.contexts['redux.state'].metadata
    delete event.contexts['redux.state'].groups
  }

  return event
}

Sentry.init({
  dsn,
  environment: isStaging ? 'staging' : 'production',
  release: `revita@${__COMMIT__}`, // eslint-disable-line no-undef
  normalizeDepth: 10,
  maxValueLength: 1000,
  beforeSend(event, hint) {
    return event.contexts ? filterReduxStateForSentry(event) : event
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

const refresh = () =>
  root.render(
    <Provider store={store}>
      <ConnectedIntlProvider>
        <BrowserRouter basename={basePath}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </ConnectedIntlProvider>
    </Provider>
  )

refresh()

if (typeof module !== 'undefined' && module.hot) {
  module.hot.accept()
}
