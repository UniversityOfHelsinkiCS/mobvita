import React from 'react'
import Router from 'Components/Router'
import { Route, Router as ReactRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { basePath } from 'Utilities/common'
import Toaster from './Toaster'
import Bar from './Bar'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavBar from './NavBar'


const App = () => {
  const history = createBrowserHistory({ basename: basePath })


  if (window.gtag) {
    history.listen((location, action) => { // Sends notifications to google analytics whenever location changes
      gtag('config', 'UA-157268430-1', {
        page_title: location.pathname,
        page_path: location.pathname,
      })
    })
  }


  history.listen((location, action) => { // Scroll to top when page changes.
    window.scrollTo(0, 0)
  })

  // Use push, replace, and go to navigate around.
  history.push(history.location)

  return (
    <>
      <ReactRouter history={history}>
        <Toaster />
        <Route component={NavBar} />
        <div style={{ display: 'flex' }}>
          <Route component={Bar} />

          <div className="application-content">
            <Router />
          </div>
        </div>
      </ReactRouter>
    </>
  )
}


export default App
