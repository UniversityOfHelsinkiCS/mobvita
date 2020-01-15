import React from 'react'
import Router from 'Components/Router'
import { Route } from 'react-router-dom'
import Bar from './Bar'

const App = () => (
  <>
    <Route component={Bar} />
    <div className="application-content">
      <Router />
    </div>
  </>
)


export default App
