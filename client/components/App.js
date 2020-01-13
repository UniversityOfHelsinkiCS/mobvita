import React from 'react'
import Router from 'Components/Router'
import Bar from './Bar'

const App = () => (
  <>
    <Bar />
    <div className="application-content">
      <Router />
    </div>
  </>
)


export default App
