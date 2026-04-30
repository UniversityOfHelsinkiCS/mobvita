import React, { useEffect, useState } from 'react'
import Router from 'Components/Router'
import { useLocation } from 'react-router-dom'
import { checkRevitaStatus } from 'Utilities/common'
import { useDispatch } from 'react-redux'
import { setServerError } from 'Utilities/redux/serverErrorReducer'
import { getMTAvailableLanguage } from 'Utilities/redux/contextTranslationReducer'  
import Toaster from './Toaster'
import Sidebar from './Sidebar'
import StoryFetcher from './StoryFetcher'
// import Chatbot from './ChatBot'

import { hiddenFeatures } from 'Utilities/common'

const RouteEffects = () => {
  const location = useLocation()


  useEffect(() => {
    if (window.gtag) {
      gtag('config', 'UA-157268430-1', {
        // eslint-disable-line no-undef
        page_title: location.pathname,
        page_path: location.pathname })
    }

    window.scrollTo(0, 0)
  }, [location.pathname])

  return null
}

const App = () => {
  const dispatch = useDispatch()
  const [revitaStatus, setRevitaStatus] = useState('OK')

  useEffect(() => {
    checkRevitaStatus()
      .then(res => setRevitaStatus(res.data))
      .catch(() => {
        setRevitaStatus('NOT OK')
      })

    Promise.resolve(dispatch(getMTAvailableLanguage())).catch(() => {
      // Request middleware already dispatches failure actions; this prevents uncaught promise noise.
    })
  }, [dispatch])

  useEffect(() => {
    if (revitaStatus !== 'OK') {
      dispatch(setServerError())
    }
  }, [dispatch, revitaStatus])

  return (
    <>
      <RouteEffects />
      <StoryFetcher />
      <Sidebar />
      <Router />
      {/* {hiddenFeatures && location.pathname.includes('practice') && (
        <Chatbot />
      )} */}
      <Toaster />
    </>
  )
}

export default App
