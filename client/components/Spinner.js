import React from 'react'
import { Spinner as BootstrapSpinner } from 'react-bootstrap'

const Spinner = ({ fullHeight = false }) => (
  <div className="spinner-container" style={{ height: fullHeight ? '90vh' : '100%' }}>
    <BootstrapSpinner animation="border" variant="primary" size="lg" />
  </div>
)

export default Spinner
