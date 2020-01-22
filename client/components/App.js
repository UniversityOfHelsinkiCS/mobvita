import React from 'react'
import Router from 'Components/Router'
import { Route } from 'react-router-dom'
import { getTextWidth } from 'Utilities/common'
import Toaster from './Toaster'
import Bar from './Bar'


const App = () => (
  <>
    <Toaster />
    <Route component={Bar} />
    <div className="application-content">
      <Router />
    </div>
    <span>{getTextWidth('toska')}</span>
  </>
)


export default App
