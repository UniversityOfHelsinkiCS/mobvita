import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/browser'
import 'semantic-ui-css/semantic.min.css'
import 'react-virtualized/styles.css'
import 'Assets/custom.scss'

import store from 'Utilities/store'
import { basePath, inProduction } from 'Utilities/common'
import App from 'Components/App'
import ErrorBoundary from 'Components/ErrorBoundary'
import ConnectedIntlProvider from 'Components/ConnectedIntlProvider'

if (inProduction) {
  Sentry.init({ dsn: 'https://509ab4585bb54fda8a94a461c1007146@toska.cs.helsinki.fi/13' })
}
const refresh = () => render(
  <Provider store={store}>
    <ConnectedIntlProvider>
      <BrowserRouter basename={basePath}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById('root'),
)

refresh()

if (module.hot) {
  module.hot.accept()
}
