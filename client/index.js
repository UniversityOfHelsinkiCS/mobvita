import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'
import 'react-virtualized/styles.css'
import 'Assets/custom.css'

import store from 'Utilities/store'
import { basePath } from 'Utilities/common'
import App from 'Components/App'
import ErrorBoundary from 'Components/ErrorBoundary'

const refresh = () => render(
  <Provider store={store}>
    <BrowserRouter basename={basePath}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
)

refresh()

if (module.hot) {
  module.hot.accept()
}
