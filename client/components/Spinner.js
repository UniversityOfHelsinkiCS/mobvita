import React from 'react'
import { Spinner as BootstrapSpinner } from 'react-bootstrap'

const Spinner = () => (
  <div className="spinner-container">
    <BootstrapSpinner animation="border" variant="primary" size="lg" />
  </div>
)

export default Spinner
