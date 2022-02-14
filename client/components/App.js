import React, { useEffect, useState } from 'react'
import Router from 'Components/Router'
import { Router as ReactRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { basePath, checkRevitaStatus, timerExpired } from 'Utilities/common'
import { useDispatch } from 'react-redux'
import { setServerError } from 'Utilities/redux/serverErrorReducer'
import Toaster from './Toaster'
import Sidebar from './Sidebar'
import StoryFetcher from './StoryFetcher'
import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => {
  const history = createBrowserHistory({ basename: basePath })
  const dispatch = useDispatch()
  const [revitaStatus, setRevitaStatus] = useState('OK')

  useEffect(() => {
    checkRevitaStatus().then(res => setRevitaStatus(res.data))
  }, [])

  if (window.gtag) {
    history.listen((location, action) => {
      // Sends notifications to google analytics whenever location changes
      gtag('config', 'UA-157268430-1', {
        // eslint-disable-line no-undef
        page_title: location.pathname,
        page_path: location.pathname,
      })
    })
  }

  const activityCheckInterval = setInterval(() => {
    const requestStorage = localStorage.getItem('last_request')
    const parsedDate = Date.parse(requestStorage)

    const needsRefreshing = timerExpired(parsedDate, 10)
    if (needsRefreshing) {
      const requestSentAt = new Date()
      window.localStorage.setItem('last_request', requestSentAt)
      window.location.reload()
    }
  }, 36_000_000)

  history.listen((location, action) => {
    // Scroll to top when page changes.
    window.scrollTo(0, 0)
  })

  // Use push, replace, and go to navigate around.
  history.push(history.location)

  if (revitaStatus !== 'OK') {
    dispatch(setServerError())
  }

  return (
    <>
      <ReactRouter history={history}>
        <StoryFetcher />
        <Sidebar history={history} />
        <Router />
        <Toaster />
      </ReactRouter>
    </>
  )
}

export default App
