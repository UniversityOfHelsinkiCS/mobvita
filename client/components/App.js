import React from 'react'
import Router from 'Components/Router'
import { Route, Router as ReactRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { basePath } from 'Utilities/common'
import { Navbar } from 'react-bootstrap'
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


  // Use push, replace, and go to navigate around.
  history.push(history.location)

  return (
    <>
      <ReactRouter history={history}>
        <Toaster />
        <NavBar />
        <div style={{ display: 'flex' }}>
          <div className="application-content">
            <Router />
          </div>
        </div>
      </ReactRouter>
    </>
  )
}


export default App
