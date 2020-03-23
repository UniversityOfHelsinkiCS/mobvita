import React, { useEffect, useState } from 'react'
import Router from 'Components/Router'
import { Route, Router as ReactRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { basePath, checkRevitaStatus } from 'Utilities/common'
import { useDispatch } from 'react-redux'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { Offline } from 'react-detect-offline'
import Toaster from './Toaster'
import Bar from './Bar'
import StoryFetcher from './StoryFetcher'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavBar from './NavBar'


const App = () => {
  const history = createBrowserHistory({ basename: basePath })
  const dispatch = useDispatch()
  const [revitaStatus, setRevitaStatus] = useState('OK')

  useEffect(() => {
    checkRevitaStatus()
      .then(res => setRevitaStatus(res.data))
  }, [])

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

  if (revitaStatus !== 'OK') {
    dispatch(setNotification('The server is experincing issues. Please check back later!', 'error', { autoClose: false }))
  }

  return (
    <>
      <ReactRouter history={history}>
        <Toaster />
        <Offline><div className="offline-notification"><h3>Please re-connect to the internet to use revita!</h3></div></Offline>
        <Route component={NavBar} />
        <div style={{ display: 'flex' }}>
          <Route component={Bar} />
          <Route component={StoryFetcher} />

          <div className="application-content">
            <Router />
          </div>
        </div>
      </ReactRouter>
    </>
  )
}


export default App
