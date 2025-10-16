import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/react'
import 'semantic-ui-css/semantic.min.css'
import 'Assets/bootstrap.css'
import 'Assets/rc-slider.css'
import 'Assets/custom.scss'
import store from 'Utilities/store'
import { basePath, inProduction, isStaging } from 'Utilities/common'
import App from 'Components/App'
import ErrorBoundary from 'Components/ErrorBoundary'
import ConnectedIntlProvider from 'Components/ConnectedIntlProvider'

const dsn = inProduction ? 'https://0db09ebcfc15d28247ed8ba70ae6cf98@toska.it.helsinki.fi/10' : null

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

const refresh = () =>
  render(
    <Provider store={store}>
      <ConnectedIntlProvider>
        <BrowserRouter basename={basePath}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </ConnectedIntlProvider>
    </Provider>,
    document.getElementById('root')
  )

refresh()

if (module.hot) {
  module.hot.accept()
}
