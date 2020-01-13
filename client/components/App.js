import React from 'react'
import Router from 'Components/Router'
import Bar from './Bar'

const App = () => (
  <div>
    <Bar />
    <div className="application-content">
      <Router />
    </div>
  </div>
)


export default App
