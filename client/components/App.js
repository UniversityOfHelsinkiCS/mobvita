import React from 'react'
import Router from 'Components/Router'
import Bar from './Bar'

/* eslint-disable no-undef */
// __VERSION__ is defined in webpack
const App = () => (
  <>
    <Bar />
    <div style={{ backgroundColor: '#fafafa' }}>
      <div className="content">
        <Router />
      </div>
    </div>
    {<span>{`Built at: ${__VERSION__}`}</span>}
  </>
)


export default App
