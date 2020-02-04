import React from 'react'
import Router from 'Components/Router'
import { Route, Router as ReactRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import Toaster from './Toaster'
import Bar from './Bar'


const App = () => {
  const history = createBrowserHistory()

  if (window.gtag) {
    history.listen((location, action) => { // Sends notifications to google analytics whenever location changes
      gtag('config', 'UA-157268430-1', {
        page_title: location.pathname,
        page_path: location.pathname,
      })
    })
  }


  // Use push, replace, and go to navigate around.
  history.push(history.location)

  return (
    <>
      <ReactRouter history={history}>
        <Toaster />
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
