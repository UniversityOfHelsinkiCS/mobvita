import React from 'react'
import Router from 'Components/Router'
import { Route } from 'react-router-dom'
import Toaster from './Toaster'
import Bar from './Bar'


const App = () => (
  <>
    <Toaster />
    <div style={{ display: 'flex' }}>
      <Route component={Bar} />
      <div className="application-content">
        <Router />
      </div>
    </div>
  </>
)


export default App
