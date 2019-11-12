import React from 'react'
import NavBar from 'Components/NavBar'
import Footer from 'Components/Footer'
import Router from 'Components/Router'

export default () => (
  <div>
    <NavBar />
    <div className="content">
      <Router />
    </div>
    <Footer />
  </div>
)
