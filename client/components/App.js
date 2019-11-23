import React from 'react'
import NavBar from 'Components/NavBar'
import Router from 'Components/Router'

export default () => (
  <div style={{ backgroundColor: '#fafafa' }}>
    <NavBar />
    <div className="content">
      <Router />
    </div>
  </div>
)
