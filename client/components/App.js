import React, { useEffect, useState } from 'react'
import Router from 'Components/Router'
import { Router as ReactRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { basePath, checkRevitaStatus } from 'Utilities/common'
import { useDispatch } from 'react-redux'
import { setServerError } from 'Utilities/redux/serverErrorReducer'
import { getMTAvailableLanguage } from 'Utilities/redux/contextTranslationReducer'  
import Toaster from './Toaster'
import Sidebar from './Sidebar'
import StoryFetcher from './StoryFetcher'
import Chatbot from './ChatBot'
import 'bootstrap/dist/css/bootstrap.min.css'

import { hiddenFeatures } from 'Utilities/common'

const App = () => {
  const history = createBrowserHistory({ basename: basePath })
  const dispatch = useDispatch()
  const [revitaStatus, setRevitaStatus] = useState('OK')

  useEffect(() => {
    checkRevitaStatus().then(res => setRevitaStatus(res.data))
    dispatch(getMTAvailableLanguage())
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
        {hiddenFeatures && (
          <Chatbot />
        )}
        <Toaster />
      </ReactRouter>
    </>
  )
}

export default App
